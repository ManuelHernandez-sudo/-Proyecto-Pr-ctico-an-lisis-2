import { useCallback, useEffect, useState } from 'react';
import { api } from './api.js';

const ESTADOS = ['NUEVO', 'ASIGNADO', 'EN_PROCESO', 'RESUELTO', 'CERRADO'];
const SIGUIENTE = { NUEVO: [], ASIGNADO: ['EN_PROCESO'], EN_PROCESO: ['RESUELTO'], RESUELTO: ['CERRADO', 'EN_PROCESO'], CERRADO: [] };
const CATEGORIAS = ['HARDWARE', 'SOFTWARE', 'RED', 'ACCESOS', 'OTRO'];
const PRIORIDADES = ['BAJA', 'MEDIA', 'ALTA', 'CRITICA'];
const fmt = (d) => new Date(d).toLocaleString('es-GT', { dateStyle: 'short', timeStyle: 'short' });

function Barras({ datos }) {
  const max = Math.max(1, ...datos.map((d) => d.total));
  return (
    <ul className="barras">
      {datos.map((d) => (
        <li key={d.etiqueta}>
          <span>{d.etiqueta}</span>
          <i style={{ width: `${(d.total / max) * 100}%` }} />
          <b>{d.total}</b>
        </li>
      ))}
    </ul>
  );
}

function Dashboard() {
  const [d, setD] = useState(null);
  const [err, setErr] = useState('');
  useEffect(() => { api.dashboard().then(setD).catch((e) => setErr(e.message)); }, []);
  if (err) return <p className="error">{err}</p>;
  if (!d) return <p>Cargando indicadores…</p>;
  return (
    <section>
      <div className="kpis">
        <div><b>{d.abiertos}</b>Abiertos</div>
        <div><b>{d.cerrados}</b>Cerrados</div>
        <div className="crit"><b>{d.criticos}</b>Críticos activos</div>
      </div>
      <div className="dos">
        <div><h3>Por categoría</h3><Barras datos={d.porCategoria} /></div>
        <div><h3>Por técnico</h3><Barras datos={d.porTecnico} /></div>
      </div>
    </section>
  );
}

function Nuevo({ onCreado }) {
  const [f, setF] = useState({ titulo: '', descripcion: '', categoria: 'SOFTWARE', prioridad: 'MEDIA', usuario: '' });
  const [err, setErr] = useState('');
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const enviar = async () => {
    try { setErr(''); await api.crear(f); onCreado(); } catch (e) { setErr(e.message); }
  };
  return (
    <section className="panel">
      <h3>Reportar incidente</h3>
      <label>Título<input value={f.titulo} onChange={set('titulo')} /></label>
      <label>Descripción<textarea rows="4" value={f.descripcion} onChange={set('descripcion')} /></label>
      <div className="fila">
        <label>Categoría<select value={f.categoria} onChange={set('categoria')}>{CATEGORIAS.map((c) => <option key={c}>{c}</option>)}</select></label>
        <label>Prioridad<select value={f.prioridad} onChange={set('prioridad')}>{PRIORIDADES.map((c) => <option key={c}>{c}</option>)}</select></label>
        <label>Usuario<input value={f.usuario} onChange={set('usuario')} /></label>
      </div>
      {err && <p className="error">{err}</p>}
      <button onClick={enviar}>Crear incidente</button>
    </section>
  );
}

function Detalle({ id, tecnicos, onCambio }) {
  const [inc, setInc] = useState(null);
  const [texto, setTexto] = useState('');
  const [err, setErr] = useState('');
  const cargar = useCallback(() => api.detalle(id).then(setInc).catch((e) => setErr(e.message)), [id]);
  useEffect(() => { cargar(); }, [cargar]);
  const run = (fn) => async () => { try { setErr(''); await fn(); await cargar(); onCambio(); } catch (e) { setErr(e.message); } };
  if (!inc) return <aside className="panel">{err || 'Cargando…'}</aside>;
  return (
    <aside className="panel">
      <h3>#{inc.id} {inc.titulo}</h3>
      <p>{inc.descripcion}</p>
      <p className="meta">{inc.categoria} · {inc.prioridad} · {inc.usuario} · {fmt(inc.creado_en)}</p>
      <div className="fila">
        <label>Técnico
          <select value={inc.tecnico_id || ''} onChange={(e) => run(() => api.asignar(id, { tecnico_id: Number(e.target.value), autor: 'operador' }))()}>
            <option value="" disabled>Sin asignar</option>
            {tecnicos.map((t) => <option key={t.id} value={t.id}>{t.nombre}</option>)}
          </select>
        </label>
        <div className="acciones">
          <span className={`estado e-${inc.estado}`}>{inc.estado}</span>
          {SIGUIENTE[inc.estado].map((s) => (
            <button key={s} className="sec" onClick={run(() => api.estado(id, { estado: s, autor: 'operador' }))}>Pasar a {s}</button>
          ))}
        </div>
      </div>
      {err && <p className="error">{err}</p>}
      <h4>Bitácora</h4>
      <ul className="bitacora">
        {inc.comentarios.map((c) => <li key={c.id}><b>{c.autor}</b> <time>{fmt(c.creado_en)}</time><br />{c.texto}</li>)}
      </ul>
      <div className="fila">
        <input placeholder="Agregar comentario" value={texto} onChange={(e) => setTexto(e.target.value)} />
        <button onClick={run(async () => { await api.comentar(id, { autor: 'operador', texto }); setTexto(''); })}>Comentar</button>
      </div>
    </aside>
  );
}

function Lista({ tecnicos, refresco, onCambio }) {
  const [f, setF] = useState({ estado: '', prioridad: '', categoria: '', tecnico_id: '' });
  const [items, setItems] = useState([]);
  const [sel, setSel] = useState(null);
  const [err, setErr] = useState('');
  useEffect(() => { api.listar(f).then(setItems).catch((e) => setErr(e.message)); }, [f, refresco]);
  const sel8 = (k, opts) => (
    <select value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })}>
      <option value="">{k.replace('_id', '')}: todos</option>
      {opts.map((o) => <option key={o.v ?? o} value={o.v ?? o}>{o.t ?? o}</option>)}
    </select>
  );
  return (
    <div className="split">
      <section>
        <div className="filtros">
          {sel8('estado', ESTADOS)}{sel8('prioridad', PRIORIDADES)}{sel8('categoria', CATEGORIAS)}
          {sel8('tecnico_id', tecnicos.map((t) => ({ v: t.id, t: t.nombre })))}
        </div>
        {err && <p className="error">{err}</p>}
        {items.length === 0 && <p>No hay incidentes con estos filtros. Cambie los filtros o reporte uno nuevo.</p>}
        <table>
          <thead><tr><th>#</th><th>Título</th><th>Prioridad</th><th>Estado</th><th>Técnico</th></tr></thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.id} className={sel === i.id ? 'activa' : ''} onClick={() => setSel(i.id)}>
                <td>{i.id}</td><td>{i.titulo}</td>
                <td><span className={`p p-${i.prioridad}`}>{i.prioridad}</span></td>
                <td><span className={`estado e-${i.estado}`}>{i.estado}</span></td>
                <td>{i.tecnico || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      {sel && <Detalle id={sel} tecnicos={tecnicos} onCambio={onCambio} />}
    </div>
  );
}

export default function App() {
  const [vista, setVista] = useState('lista');
  const [tecnicos, setTecnicos] = useState([]);
  const [refresco, setRefresco] = useState(0);
  useEffect(() => { api.tecnicos().then(setTecnicos).catch(() => {}); }, []);
  const refrescar = () => setRefresco((n) => n + 1);
  return (
    <>
      <header>
        <h1>IT Incident Hub</h1>
        <nav>
          {[['lista', 'Incidentes'], ['nuevo', 'Reportar'], ['dash', 'Indicadores']].map(([k, t]) => (
            <button key={k} className={vista === k ? 'on' : ''} onClick={() => setVista(k)}>{t}</button>
          ))}
        </nav>
      </header>
      <main>
        {vista === 'lista' && <Lista tecnicos={tecnicos} refresco={refresco} onCambio={refrescar} />}
        {vista === 'nuevo' && <Nuevo onCreado={() => { refrescar(); setVista('lista'); }} />}
        {vista === 'dash' && <Dashboard />}
      </main>
    </>
  );
}
