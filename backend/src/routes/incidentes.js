const express = require('express');
const db = require('../db');
const { ESTADOS, puedeTransicionar } = require('../transitions');
const { validarIncidente } = require('../validate');

const router = express.Router();
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const BASE = `SELECT i.*, t.nombre AS tecnico FROM incidentes i LEFT JOIN tecnicos t ON t.id = i.tecnico_id`;

async function withTransaction(work) {
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    const result = await work(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    try {
      await client.query('ROLLBACK');
    } catch (rollbackError) {
      throw new AggregateError([error, rollbackError], 'La transacción falló y no se pudo revertir');
    }
    throw error;
  } finally {
    client.release();
  }
}

router.post('/', wrap(async (req, res) => {
  const errores = validarIncidente(req.body);
  if (errores.length) return res.status(400).json({ errores });
  const { titulo, descripcion, categoria, prioridad, usuario } = req.body;
  const incidente = await withTransaction(async (client) => {
    const { rows } = await client.query(
      `INSERT INTO incidentes (titulo, descripcion, categoria, prioridad, usuario)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [titulo.trim(), descripcion.trim(), categoria, prioridad, usuario.trim()],
    );
    await client.query(`INSERT INTO comentarios (incidente_id, autor, texto) VALUES ($1,'sistema',$2)`,
      [rows[0].id, 'Incidente creado']);
    return rows[0];
  });
  res.status(201).json(incidente);
}));

router.get('/', wrap(async (req, res) => {
  const filtros = { estado: 'i.estado', prioridad: 'i.prioridad', categoria: 'i.categoria', tecnico_id: 'i.tecnico_id' };
  const where = []; const params = [];
  for (const [k, col] of Object.entries(filtros)) {
    if (req.query[k]) { params.push(req.query[k]); where.push(`${col} = $${params.length}`); }
  }
  const sql = `${BASE} ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY i.creado_en DESC LIMIT 200`;
  const { rows } = await db.query(sql, params);
  res.json(rows);
}));

router.get('/:id', wrap(async (req, res) => {
  const { rows } = await db.query(`${BASE} WHERE i.id = $1`, [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: 'Incidente no encontrado' });
  const c = await db.query('SELECT * FROM comentarios WHERE incidente_id = $1 ORDER BY creado_en', [req.params.id]);
  res.json({ ...rows[0], comentarios: c.rows });
}));

router.patch('/:id/asignar', wrap(async (req, res) => {
  const { tecnico_id: tecnicoId, autor = 'sistema' } = req.body;
  if (!tecnicoId) return res.status(400).json({ error: 'tecnico_id requerido' });
  const result = await withTransaction(async (client) => {
    const cur = await client.query('SELECT id, estado FROM incidentes WHERE id = $1 FOR UPDATE', [req.params.id]);
    if (!cur.rows.length) return { status: 404, body: { error: 'Incidente no encontrado' } };
    if (cur.rows[0].estado === 'CERRADO') return { status: 409, body: { error: 'Incidente cerrado' } };
    const nuevoEstado = cur.rows[0].estado === 'NUEVO' ? 'ASIGNADO' : cur.rows[0].estado;
    const { rows } = await client.query(
      'UPDATE incidentes SET tecnico_id = $1, estado = $2, actualizado_en = now() WHERE id = $3 RETURNING *',
      [tecnicoId, nuevoEstado, req.params.id]);
    await client.query('INSERT INTO comentarios (incidente_id, autor, texto) VALUES ($1,$2,$3)',
      [req.params.id, autor, `Asignado al técnico #${tecnicoId}`]);
    return { status: 200, body: rows[0] };
  });
  res.status(result.status).json(result.body);
}));

router.patch('/:id/estado', wrap(async (req, res) => {
  const { estado, autor = 'sistema' } = req.body;
  if (!ESTADOS.includes(estado)) return res.status(400).json({ error: `estado debe ser ${ESTADOS.join(', ')}` });
  const result = await withTransaction(async (client) => {
    const cur = await client.query('SELECT id, estado, tecnico_id FROM incidentes WHERE id = $1 FOR UPDATE', [req.params.id]);
    if (!cur.rows.length) return { status: 404, body: { error: 'Incidente no encontrado' } };
    const actual = cur.rows[0];
    if (!puedeTransicionar(actual.estado, estado)) {
      return { status: 409, body: { error: `Transición no permitida: ${actual.estado} -> ${estado}` } };
    }
    const { rows } = await client.query(
      'UPDATE incidentes SET estado = $1, actualizado_en = now() WHERE id = $2 RETURNING *', [estado, req.params.id]);
    await client.query('INSERT INTO comentarios (incidente_id, autor, texto) VALUES ($1,$2,$3)',
      [req.params.id, autor, `Estado: ${actual.estado} -> ${estado}`]);
    return { status: 200, body: rows[0] };
  });
  res.status(result.status).json(result.body);
}));

router.post('/:id/comentarios', wrap(async (req, res) => {
  const { autor, texto } = req.body;
  if (!autor || !texto || !String(texto).trim()) return res.status(400).json({ error: 'autor y texto requeridos' });
  const { rows } = await db.query(
    'INSERT INTO comentarios (incidente_id, autor, texto) VALUES ($1,$2,$3) RETURNING *',
    [req.params.id, autor, String(texto).trim()]);
  res.status(201).json(rows[0]);
}));

module.exports = router;
