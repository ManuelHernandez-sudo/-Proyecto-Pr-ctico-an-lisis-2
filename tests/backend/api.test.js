const request = require('supertest');

jest.mock('../../backend/src/db', () => ({ query: jest.fn(), connect: jest.fn() }));
const db = require('../../backend/src/db');
const app = require('../../backend/src/app');

beforeEach(() => {
  db.query.mockReset();
  db.connect.mockReset();
});

function mockTransactionClient(...results) {
  const client = { query: jest.fn(), release: jest.fn() };
  results.forEach((result) => {
    if (result instanceof Error) client.query.mockRejectedValueOnce(result);
    else client.query.mockResolvedValueOnce(result);
  });
  db.connect.mockResolvedValue(client);
  return client;
}

test('GET /api/health responde ok', async () => {
  const res = await request(app).get('/api/health');
  expect(res.status).toBe(200);
  expect(res.body.status).toBe('ok');
});

test('POST /api/incidentes rechaza datos inválidos', async () => {
  const res = await request(app).post('/api/incidentes').send({ titulo: 'x' });
  expect(res.status).toBe(400);
  expect(res.body.errores.length).toBeGreaterThan(0);
});

test('POST /api/incidentes crea un incidente', async () => {
  const client = mockTransactionClient(
    { rows: [] },
    { rows: [{ id: 1, estado: 'NUEVO' }] },
    { rows: [{ id: 1 }] },
    { rows: [] },
  );
  const res = await request(app).post('/api/incidentes').send({
    titulo: 'ERP caído', descripcion: 'Error 500 en ventas', categoria: 'SOFTWARE', prioridad: 'CRITICA', usuario: 'cgomez',
  });
  expect(res.status).toBe(201);
  expect(res.body.id).toBe(1);
  expect(client.query.mock.calls.map(([sql]) => sql)).toEqual([
    'BEGIN',
    expect.stringContaining('INSERT INTO incidentes'),
    expect.stringContaining('INSERT INTO comentarios'),
    'COMMIT',
  ]);
  expect(client.release).toHaveBeenCalledTimes(1);
});

test('POST /api/incidentes revierte si falla el comentario inicial', async () => {
  const client = mockTransactionClient(
    { rows: [] },
    { rows: [{ id: 1, estado: 'NUEVO' }] },
    new Error('falló el comentario'),
    { rows: [] },
  );
  const res = await request(app).post('/api/incidentes').send({
    titulo: 'ERP caído', descripcion: 'Error 500 en ventas', categoria: 'SOFTWARE', prioridad: 'CRITICA', usuario: 'cgomez',
  });
  expect(res.status).toBe(500);
  expect(client.query.mock.calls.map(([sql]) => sql)).toEqual([
    'BEGIN',
    expect.stringContaining('INSERT INTO incidentes'),
    expect.stringContaining('INSERT INTO comentarios'),
    'ROLLBACK',
  ]);
  expect(client.release).toHaveBeenCalledTimes(1);
});

test('PATCH estado rechaza transición inválida', async () => {
  const client = mockTransactionClient(
    { rows: [] },
    { rows: [{ id: 1, estado: 'NUEVO', tecnico_id: null }] },
    { rows: [] },
  );
  const res = await request(app).patch('/api/incidentes/1/estado').send({ estado: 'CERRADO' });
  expect(res.status).toBe(409);
  expect(client.query.mock.calls.map(([sql]) => sql)).toEqual([
    'BEGIN',
    expect.stringContaining('SELECT id, estado, tecnico_id'),
    'COMMIT',
  ]);
  expect(client.release).toHaveBeenCalledTimes(1);
});

test('PATCH estado revierte si falla el registro en bitácora', async () => {
  const client = mockTransactionClient(
    { rows: [] },
    { rows: [{ id: 1, estado: 'EN_PROCESO', tecnico_id: 2 }] },
    { rows: [{ id: 1, estado: 'RESUELTO' }] },
    new Error('falló el comentario'),
    { rows: [] },
  );
  const res = await request(app).patch('/api/incidentes/1/estado').send({ estado: 'RESUELTO' });
  expect(res.status).toBe(500);
  expect(client.query.mock.calls.map(([sql]) => sql)).toEqual([
    'BEGIN',
    expect.stringContaining('SELECT id, estado, tecnico_id'),
    expect.stringContaining('UPDATE incidentes'),
    expect.stringContaining('INSERT INTO comentarios'),
    'ROLLBACK',
  ]);
  expect(client.release).toHaveBeenCalledTimes(1);
});

test('GET /api/incidentes/:id devuelve 404 si no existe', async () => {
  db.query.mockResolvedValueOnce({ rows: [] });
  const res = await request(app).get('/api/incidentes/99');
  expect(res.status).toBe(404);
});
