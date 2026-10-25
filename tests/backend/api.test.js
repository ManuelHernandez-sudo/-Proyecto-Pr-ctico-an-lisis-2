const request = require('supertest');

jest.mock('../../backend/src/db', () => ({ query: jest.fn() }));
const db = require('../../backend/src/db');
const app = require('../../backend/src/app');

beforeEach(() => db.query.mockReset());

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
  db.query.mockResolvedValue({ rows: [{ id: 1, estado: 'NUEVO' }] });
  const res = await request(app).post('/api/incidentes').send({
    titulo: 'ERP caído', descripcion: 'Error 500 en ventas', categoria: 'SOFTWARE', prioridad: 'CRITICA', usuario: 'cgomez',
  });
  expect(res.status).toBe(201);
  expect(res.body.id).toBe(1);
});

test('PATCH estado rechaza transición inválida', async () => {
  db.query.mockResolvedValueOnce({ rows: [{ id: 1, estado: 'NUEVO', tecnico_id: null }] });
  const res = await request(app).patch('/api/incidentes/1/estado').send({ estado: 'CERRADO' });
  expect(res.status).toBe(409);
});

test('GET /api/incidentes/:id devuelve 404 si no existe', async () => {
  db.query.mockResolvedValueOnce({ rows: [] });
  const res = await request(app).get('/api/incidentes/99');
  expect(res.status).toBe(404);
});
