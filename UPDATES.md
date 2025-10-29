Actualización sobre la tarea 4:

Problema numero 1: PHP en el backend devuelve errores como `{"error": "mensaje"}`, pero el frontend en `apiFactory.js` no los lee y muestra un mensaje genérico, por lo que actualizé `apiFactory.js` para leer el JSON de error y usar el mensaje de PHP (Aplica a: `fetchAll()`, `fetchPaginated()`, `sendJSON()` (POST, PUT, DELETE).).

Por estética, cree un modal, que esta inicialmente fuera de la vista del usuario, por propiedades de "display", pero se maneja desde el controller, actualizando la propiedad para que pueda visualizarse el error comodamente en el modal en todas las operaciones (crear, actualizar, borrar, cargar).
