# API Mock Dinámico

API REST para configurar y ejecutar mocks dinámicos basados en rutas, métodos HTTP, parámetros, encabezados y lógica condicional. Ideal para simular servicios externos durante desarrollo y pruebas.

---

## Contenido

- [Instalación](#instalación)  
- [Ejecución](#ejecución)  
- [Endpoints](#endpoints)  
- [Ejemplos de uso](#ejemplos-de-uso)  
- [Arquitectura y diseño](#arquitectura-y-diseño)  
- [Validación y manejo de errores](#validación-y-manejo-de-errores)  
- [Pruebas Unitarias](#pruebas-unitarias)  
- [Posibles mejoras](#posibles-mejoras)  
- [Uso de IA](#uso-de-ia)

---

## Instalación

1. Clonar el repositorio o descargar el código fuente.

2. Instalar dependencias (requiere Node.js >= 14):

```bash
npm install
```

3. Asegúrarse que la carpeta data existe en la raíz del proyecto y que contiene el archivo mocks.json (puede estar vacío: []).

## Ejecución 
Iniciar la API:

```bash
node app.js
```
> La API escuchará en: http://localhost:3000

## Endpoints
1. Crear Mock (configuración)
``` bash
POST /configure-mock
```
Cuerpo JSON con configuración:

    path: Ruta relativa que responderá el mock (ej. /api/saludo)

    method: Método HTTP (GET, POST, PUT, DELETE, etc.)

    status: Código HTTP que devolverá (ej. 200)

    contentType: Content-Type de la respuesta (ej. application/json)

    response: Contenido de respuesta, puede incluir plantillas con variables {{variable}}

    query (opcional): Parámetros query que deben coincidir

    body (opcional): Parámetros body que deben coincidir

    headers (opcional): Encabezados que deben coincidir (keys en minúscula)

    conditions (opcional): Array de condiciones con lógica condicional para respuestas dinámicas

2. Listar mocks configurados
``` bash
GET /configure-mock
```
Devuelve un arreglo con todos los mocks configurados.

3. Actualizar mock
``` bash
PUT /configure-mock/:id
```
Actualiza la configuración de un mock por su ID.

4. Eliminar mock
``` bash
DELETE /configure-mock/:id
```
Elimina el mock correspondiente al ID generado cuando se crea el mock.

5. Ejecución dinámica del mock
Cualquier solicitud que coincida con un mock configurado devolverá la respuesta definida, evaluando lógica condicional y plantillas.

## Ejemplos de uso
### Crear un mock básico
``` bash
curl -X POST http://localhost:3000/configure-mock \
 -H "Content-Type: application/json" \
 -d '{
   "path": "/api/saludo",
   "method": "GET",
   "status": 200,
   "contentType": "application/json",
   "response": "{\"msg\": \"Hola {{usuario}}\"}",
   "conditions": [
     {
       "param": "usuario",
       "value": "admin",
       "response": "{\"msg\": \"Hola Admin\"}"
     }
   ]
 }'
 ```
en postman: 

Método: POST

URL: http://localhost:3000/configure-mock

Headers:

Key: Content-Type

Value: application/json

Body: (selecciona raw y formato JSON)

 ``` json

{
  "path": "/api/saludo",
  "method": "GET",
  "status": 200,
  "contentType": "application/json",
  "response": "{\"msg\": \"Hola {{usuario}}\"}",
  "conditions": [
    {
      "param": "usuario",
      "value": "admin",
      "response": "{\"msg\": \"Hola Admin\"}"
    }
  ]
}
 ```

### Probar mock
``` bash

curl "http://localhost:3000/api/saludo?usuario=admin"
# Respuesta: {"msg": "Hola Admin"}

curl "http://localhost:3000/api/saludo?usuario=juan"
# Respuesta: {"msg": "Hola juan"}
```

en postman:
Método: GET

URL: http://localhost:3000/api/saludo?usuario=admin

Presionar Send y deberías ver la respuesta:

```json

{
  "msg": "Hola Admin"
}
```
Cambiar la URL a:
http://localhost:3000/api/saludo?usuario=juan

Presionar Send y la respuesta debe ser:

```json
{
  "msg": "Hola juan"
}
```
## Arquitectura y diseño
- Express.js para manejo de rutas y servidor HTTP.

- JSON en archivo local (data/mocks.json) para almacenamiento simple y persistente.

- Modularidad con capas separadas: controladores, servicios, utilidades.

- Motor de plantillas simple que reemplaza variables en {{variable}} en respuestas JSON.

- Lógica condicional para variar respuestas según parámetros.

- Validación estricta para evitar rutas inválidas o configuraciones erróneas.

- Manejo de errores con middleware para mensajes claros y HTTP adecuados.

## Validación y manejo de errores
1. La ruta debe ser relativa y comenzar con /.

2. Método HTTP debe ser uno válido (GET, POST, PUT, DELETE, etc.).

3. Código de estado HTTP válido (entre 100 y 599).

4. Campos obligatorios validados (response, contentType, etc.).

5. Errores devuelven respuestas claras con status HTTP adecuado.

## Pruebas Unitarias
Este proyecto incluye pruebas unitarias para los endpoints principales usando Jest y supertest.

1. Ejecutar pruebas
Instalar dependencias de desarrollo:

``` bash

npm install --save-dev jest supertest
```

2. Ejecutar las pruebas:
``` bash
npm test
```

3. Cobertura de pruebas
    1. Crear mocks

    2. Listar mocks

    3. Actualizar mocks

    4. Eliminar mocks

    5. Ejecutar mocks con y sin condiciones

## Posibles mejoras
Soporte para plantillas más avanzadas (if, loops).

Almacenamiento en base de datos (MongoDB, etc.).

Interfaz gráfica para administrar mocks.

Autenticación y autorización para control de acceso.

Tests unitarios y de integración ampliados.

Soporte para diferentes formatos de request/response (XML, multipart).

## Uso de IA

Prompts utilizados:

1. Brindame 3 Ejemplos de mocks que contengan lo siguiente: Ruta: URL para acceder al mock (ej. /api/v1/productos)
Método HTTP: GET, POST, PUT, DELETE, etc.
Parámetros en URL: (ej. fechaInicial=2021-01-29 13:01:00&fechaFinal=2021-01-29 13:06:00)
Parámetros en Body: (ej. {"telefono": "45456060"})
Encabezados: (ej. Authorization: Bearer xxxxxxxxxxxxxxx)
Código de Estado HTTP: 200, 404, 500, etc.
Contenido de la Respuesta: Datos estáticos o basados en plantillas.
Content-Type: (ej. application/json, text/xml), deben ser en formato json y deben validar diversos errores

**Respuesta**
Claro, aquí tienes varios ejemplos de configuraciones de mocks para probar distintas situaciones, incluyendo casos válidos y casos que deberían generar errores de validación.

---

# Ejemplos de mocks válidos para probar

### 1. Mock básico GET con parámetro en query y respuesta plantilla

```json
{
  "path": "/api/saludo",
  "method": "GET",
  "status": 200,
  "contentType": "application/json",
  "response": "{\"msg\": \"Hola {{usuario}}\"}",
  "conditions": [
    {
      "param": "usuario",
      "value": "admin",
      "response": "{\"msg\": \"Hola Admin\"}"
    }
  ]
}
```

### 2. Mock POST con validación por body y header

```json
{
  "path": "/api/login",
  "method": "POST",
  "status": 200,
  "contentType": "application/json",
  "response": "{\"token\": \"abc123\", \"usuario\": \"{{username}}\"}",
  "body": {
    "username": "usuario1",
    "password": "secreto"
  },
  "headers": {
    "authorization": "Bearer 123token"
  }
}
```

---

# Ejemplos para validar errores (no deberían pasar la validación)

### 1. Ruta no relativa ni empieza con '/'

```json
{
  "path": "http://mal.path.com/api",
  "method": "GET",
  "status": 200,
  "contentType": "application/json",
  "response": "{}"
}
```

> Error esperado: La ruta debe ser relativa y comenzar con "/".

### 2. Método HTTP no válido (vacío o no reconocido)

```json
{
  "path": "/api/test",
  "method": "",
  "status": 200,
  "contentType": "application/json",
  "response": "{}"
}
```

> Error esperado: Método HTTP inválido o no especificado.

### 3. Código de estado HTTP inválido (no numérico o fuera de rango)

```json
{
  "path": "/api/test",
  "method": "GET",
  "status": 9999,
  "contentType": "application/json",
  "response": "{}"
}
```

> Error esperado: Código de estado HTTP inválido.

### 4. Faltan campos obligatorios

```json
{
  "path": "/api/fail",
  "method": "POST"
}
```

> Error esperado: Falta campo 'response' o 'contentType'.

---

# Cómo probarlos en Postman

* Envía el mock válido con POST `/configure-mock` para crearlo.
* Envía los mocks con errores y verifica que recibas mensajes de error descriptivos.
* Luego ejecuta la ruta configurada para el mock válido y verifica la respuesta dinámica.

---


2. cuando ejecuto http://localhost:3000/api/saludo?usuario=juan me da como resultado {
    "msg": "Hola {{usuario}}"
}, y me debe devolver el nombre que tengo mal en mi plantilla que contiene: module.exports = (template, variables) => {
  if (typeof template !== 'string');

  return template.replace(/{{\s*([\w]+)\s*}}/g, (_, key) => {
    return variables[key] !== undefined ? variables[key] : '';
  });
};
**Respuesta**
Perfecto, eso significa que la plantilla no se está renderizando bien para reemplazar `{{usuario}}` por el valor real.

El problema está en la función del motor de plantillas que te pasé, que probablemente no detecta bien las variables con el formato `{{usuario}}` porque el regex está escapado mal.

Te dejo una versión mejorada y simple del motor de plantillas para que reemplace **correctamente** las variables `{{variable}}` en la cadena:

```js
module.exports = (template, variables) => {
  if (typeof template !== 'string') return template;

  return template.replace(/{{\s*([\w]+)\s*}}/g, (_, key) => {
    return variables[key] !== undefined ? variables[key] : '';
  });
};
```

---

### Qué hace:

* Busca `{{ usuario }}` o `{{usuario}}` con espacios opcionales.
* Sustituye con el valor que exista en `variables`.
* Si no existe, reemplaza con cadena vacía (evita mostrar la plantilla cruda).

---

### ¿Dónde está el archivo?

`utils/templateEngine.js`

Reemplaza el contenido por el código anterior, guarda y vuelve a probar tu solicitud en Postman:

```http
GET http://localhost:3000/api/saludo?usuario=juan
```

Deberías ver:

```json
{
  "msg": "Hola juan"
}
```

---

Si quieres, también puedo ayudarte a hacer que soporte reemplazos en objetos JSON (no solo string planos). ¿Quieres?
