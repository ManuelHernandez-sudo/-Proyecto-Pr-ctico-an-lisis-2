const express = require('express');
const cors = require('cors');
const db = require('./db');
const incidentes = require('./routes/incidentes');

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ status: 'ok', version: process.env.APP_VERSION || '1.0.0' }));

app.get('/api/tecnicos', async (_req, res, next) => {
  try { res.json((await db.query('SELECT id, nombre, email FROM tecnicos ORDER BY nombre')).rows); } catch (e) { next(e); }
});

app.get('/api/dashboard', async (_req, res, next) => {
  try {
    const [tot, cat, tec] = await Promise.all([
      db.query(`SELECT
        COUNT(*) FILTER (WHERE estado <> 'CERRADO')::int AS abiertos,
        COUNT(*) FILTER (WHERE estado = 'CERRADO')::int AS cerrados,
        COUNT(*) FILTER (WHERE prioridad = 'CRITICA' AND estado <> 'CERRADO')::int AS criticos
        FROM incidentes`),
      db.query('SELECT categoria AS etiqueta, COUNT(*)::int AS total FROM incidentes GROUP BY categoria ORDER BY total DESC'),
      db.query(`SELECT COALESCE(t.nombre,'Sin asignar') AS etiqueta, COUNT(*)::int AS total
                FROM incidentes i LEFT JOIN tecnicos t ON t.id = i.tecnico_id GROUP BY 1 ORDER BY total DESC`),
    ]);
    res.json({ ...tot.rows[0], porCategoria: cat.rows, porTecnico: tec.rows });
  } catch (e) { next(e); }
});

app.use('/api/incidentes', incidentes);

// Manejo central de errores (no filtra detalles internos al cliente)
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

module.exports = app;
