import { expect } from '@playwright/test';

const clone = (value) => JSON.parse(JSON.stringify(value));

export const seedIncidents = [
  {
    id: 1,
    titulo: 'ERP caído',
    descripcion: 'El módulo de ventas no responde',
    categoria: 'SOFTWARE',
    prioridad: 'CRITICA',
    usuario: 'cgomez',
    estado: 'NUEVO',
    tecnico_id: null,
    tecnico: null,
    creado_en: '2026-10-29T12:00:00.000Z',
  },
  {
    id: 2,
    titulo: 'Mouse dañado',
    descripcion: 'El mouse no responde en la estación 4',
    categoria: 'HARDWARE',
    prioridad: 'BAJA',
    usuario: 'mlopez',
    estado: 'ASIGNADO',
    tecnico_id: 2,
    tecnico: 'Ana Ruiz',
    creado_en: '2026-10-28T12:00:00.000Z',
  },
];

export async function mockIncidentApi(page) {
  const incidents = clone(seedIncidents);
  const comments = {
    1: [{ id: 1, autor: 'sistema', texto: 'Incidente creado', creado_en: '2026-10-29T12:00:00.000Z' }],
    2: [],
  };
  let nextId = 3;
  let nextCommentId = 3;

  await page.route('**/api/**', async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const { pathname, searchParams } = url;
    const method = request.method();
    let response;
    let status = 200;

    if (method === 'GET' && pathname === '/api/tecnicos') {
      response = [
        { id: 1, nombre: 'Luis Pérez', email: 'luis@example.test' },
        { id: 2, nombre: 'Ana Ruiz', email: 'ana@example.test' },
      ];
    } else if (method === 'GET' && pathname === '/api/dashboard') {
      response = {
        abiertos: 2,
        cerrados: 1,
        criticos: 1,
        porCategoria: [{ etiqueta: 'SOFTWARE', total: 2 }, { etiqueta: 'HARDWARE', total: 1 }],
        porTecnico: [{ etiqueta: 'Ana Ruiz', total: 2 }, { etiqueta: 'Sin asignar', total: 1 }],
      };
    } else if (method === 'GET' && pathname === '/api/incidentes') {
      response = incidents.filter((incident) =>
        ['estado', 'prioridad', 'categoria', 'tecnico_id'].every((key) =>
          !searchParams.get(key) || String(incident[key] ?? '') === searchParams.get(key)));
    } else if (method === 'POST' && pathname === '/api/incidentes') {
      const body = request.postDataJSON();
      const incident = {
        ...body,
        id: nextId++,
        estado: 'NUEVO',
        tecnico_id: null,
        tecnico: null,
        creado_en: '2026-10-29T12:00:00.000Z',
      };
      incidents.unshift(incident);
      comments[incident.id] = [{
        id: nextCommentId++,
        autor: 'sistema',
        texto: 'Incidente creado',
        creado_en: incident.creado_en,
      }];
      status = 201;
      response = incident;
    } else {
      const detailMatch = pathname.match(/^\/api\/incidentes\/(\d+)$/);
      const assignMatch = pathname.match(/^\/api\/incidentes\/(\d+)\/asignar$/);
      const stateMatch = pathname.match(/^\/api\/incidentes\/(\d+)\/estado$/);
      const commentMatch = pathname.match(/^\/api\/incidentes\/(\d+)\/comentarios$/);

      if (method === 'GET' && detailMatch) {
        const incident = incidents.find(({ id }) => id === Number(detailMatch[1]));
        status = incident ? 200 : 404;
        response = incident ? { ...incident, comentarios: comments[incident.id] } : { error: 'Incidente no encontrado' };
      } else if (method === 'PATCH' && (assignMatch || stateMatch)) {
        const match = assignMatch || stateMatch;
        const incident = incidents.find(({ id }) => id === Number(match[1]));
        if (!incident) {
          status = 404;
          response = { error: 'Incidente no encontrado' };
        } else {
          const body = request.postDataJSON();
          const previousState = incident.estado;
          if (assignMatch) {
            incident.tecnico_id = body.tecnico_id;
            incident.tecnico = body.tecnico_id === 2 ? 'Ana Ruiz' : 'Luis Pérez';
            if (incident.estado === 'NUEVO') incident.estado = 'ASIGNADO';
            comments[incident.id].push({
              id: nextCommentId++,
              autor: body.autor,
              texto: `Asignado al técnico #${body.tecnico_id}`,
              creado_en: '2026-10-29T12:05:00.000Z',
            });
          } else {
            incident.estado = body.estado;
            comments[incident.id].push({
              id: nextCommentId++,
              autor: body.autor,
              texto: `Estado: ${previousState} -> ${body.estado}`,
              creado_en: '2026-10-29T12:05:00.000Z',
            });
          }
          response = incident;
        }
      } else if (method === 'POST' && commentMatch) {
        const incident = incidents.find(({ id }) => id === Number(commentMatch[1]));
        if (!incident) {
          status = 404;
          response = { error: 'Incidente no encontrado' };
        } else {
          const body = request.postDataJSON();
          const comment = {
            id: nextCommentId++,
            autor: body.autor,
            texto: body.texto,
            creado_en: '2026-10-29T12:05:00.000Z',
          };
          comments[incident.id].push(comment);
          status = 201;
          response = comment;
        }
      } else {
        status = 404;
        response = { error: `Ruta simulada no encontrada: ${method} ${pathname}` };
      }
    }

    await route.fulfill({ status, json: response });
  });
}

export async function openIncidentList(page) {
  await mockIncidentApi(page);
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'IT Incident Hub' })).toBeVisible();
}
