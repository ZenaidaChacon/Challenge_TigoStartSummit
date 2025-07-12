module.exports = (mock) => {
  const required = ['path', 'method', 'status', 'response'];
  for (const key of required) {
    if (!mock[key]) throw new Error(`Falta el campo obligatorio: ${key}`);
  }

  if (!mock.path.startsWith('/')) {
    throw new Error('El path debe comenzar con "/"');
  }

  if (mock.path.includes(':')) {
    throw new Error('No se permiten parámetros dinámicos (como /api/:id)');
  }
};
