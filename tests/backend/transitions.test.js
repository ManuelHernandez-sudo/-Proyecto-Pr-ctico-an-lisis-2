const { puedeTransicionar } = require('../../backend/src/transitions');
const { validarIncidente } = require('../../backend/src/validate');

describe('transiciones de estado', () => {
  test.each([
    ['NUEVO', 'ASIGNADO', true],
    ['ASIGNADO', 'EN_PROCESO', true],
    ['EN_PROCESO', 'RESUELTO', true],
    ['RESUELTO', 'CERRADO', true],
    ['NUEVO', 'CERRADO', false],
    ['CERRADO', 'NUEVO', false],
  ])('%s -> %s = %s', (a, b, esperado) => {
    expect(puedeTransicionar(a, b)).toBe(esperado);
  });
});

describe('validación de incidentes', () => {
  const ok = { titulo: 'VPN caída', descripcion: 'No conecta desde casa', categoria: 'RED', prioridad: 'ALTA', usuario: 'jperez' };
  test('acepta un incidente válido', () => expect(validarIncidente(ok)).toEqual([]));
  test('rechaza categoría inválida', () => expect(validarIncidente({ ...ok, categoria: 'X' })).toHaveLength(1));
  test('rechaza body vacío', () => expect(validarIncidente({}).length).toBeGreaterThan(3));
});
