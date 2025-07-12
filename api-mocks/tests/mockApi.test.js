// tests/mockApi.test.js
const request = require('supertest');
const app = require('../app'); // Asegúrate que exportas app en app.js

describe('API Mocks', () => {
  let mockId;

  // Crear mock para usarlo en pruebas posteriores
  test('POST /configure-mock - Crear mock válido', async () => {
    const response = await request(app)
      .post('/configure-mock')
      .send({
        path: '/api/saludo',
        method: 'GET',
        status: 200,
        contentType: 'application/json',
        response: '{"msg":"Hola {{usuario}}"}',
        conditions: [
          { param: 'usuario', value: 'admin', response: '{"msg":"Hola Admin"}' }
        ]
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    mockId = response.body.id;
  });

  // Consultar todos los mocks
  test('GET /configure-mock - Obtener mocks', async () => {
    const response = await request(app).get('/configure-mock');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // Ejecutar mock con condición admin
  test('GET /api/saludo?usuario=admin - Ejecutar mock con condición', async () => {
    const response = await request(app).get('/api/saludo?usuario=admin');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ msg: 'Hola Admin' });
  });

  // Ejecutar mock con usuario genérico
  test('GET /api/saludo?usuario=juan - Ejecutar mock genérico', async () => {
    const response = await request(app).get('/api/saludo?usuario=juan');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ msg: 'Hola juan' });
  });

  // Actualizar mock
  test('PUT /configure-mock/:id - Actualizar mock', async () => {
    const response = await request(app)
      .put(`/configure-mock/${mockId}`)
      .send({
        path: '/api/saludo',
        method: 'GET',
        status: 200,
        contentType: 'application/json',
        response: '{"msg":"Hola actualizado {{usuario}}"}'
      });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id', mockId);
  });

  // Ejecutar mock actualizado
  test('GET /api/saludo?usuario=juan - Ejecutar mock actualizado', async () => {
    const response = await request(app).get('/api/saludo?usuario=juan');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ msg: 'Hola actualizado juan' });
  });

  // Eliminar mock
  test('DELETE /configure-mock/:id - Eliminar mock', async () => {
    const response = await request(app).delete(`/configure-mock/${mockId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: 'Mock eliminado' });
  });

  // Ejecutar mock eliminado (debe fallar)
  test('GET /api/saludo - Mock eliminado da 404', async () => {
    const response = await request(app).get('/api/saludo');
    expect(response.statusCode).toBe(404);
  });
});
