const { CATEGORIAS, PRIORIDADES } = require('./transitions');

function validarIncidente(body = {}) {
  const errores = [];
  const { titulo, descripcion, categoria, prioridad, usuario } = body;
  if (!titulo || String(titulo).trim().length < 5) errores.push('titulo: mínimo 5 caracteres');
  if (!descripcion || String(descripcion).trim().length < 10) errores.push('descripcion: mínimo 10 caracteres');
  if (!CATEGORIAS.includes(categoria)) errores.push(`categoria: debe ser ${CATEGORIAS.join(', ')}`);
  if (!PRIORIDADES.includes(prioridad)) errores.push(`prioridad: debe ser ${PRIORIDADES.join(', ')}`);
  if (!usuario || !String(usuario).trim()) errores.push('usuario: requerido');
  return errores;
}

module.exports = { validarIncidente };
