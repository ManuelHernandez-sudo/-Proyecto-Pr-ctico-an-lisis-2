const BASE = import.meta.env.VITE_API_URL || '/api';

async function req(path, options = {}) {
  const res = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || (data.errores || []).join('; ') || 'Error de red');
  return data;
}

export const api = {
  dashboard: () => req('/dashboard'),
  tecnicos: () => req('/tecnicos'),
  listar: (filtros) => req('/incidentes?' + new URLSearchParams(Object.entries(filtros).filter(([, v]) => v))),
  detalle: (id) => req(`/incidentes/${id}`),
  crear: (body) => req('/incidentes', { method: 'POST', body }),
  asignar: (id, body) => req(`/incidentes/${id}/asignar`, { method: 'PATCH', body }),
  estado: (id, body) => req(`/incidentes/${id}/estado`, { method: 'PATCH', body }),
  comentar: (id, body) => req(`/incidentes/${id}/comentarios`, { method: 'POST', body }),
};
