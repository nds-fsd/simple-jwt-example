# JWT server

Servidor web que contiene dos rutas: una para generar un JWT y otra para validarlo. Creado con Node y las librerías Express y jsonwebtoken.

## Funcionamiento

Si no lo has hecho antes, instala las dependencias primero con:

```bash
npm install
```

Luego, asigna un valor a la variable secreta `JWT_KEY` que encontrarás en el archivo `.env`.

Finalmente, ejecuta en la terminal este comando para levantar el servidor en el puerto 3000 y poder hacerle peticiones:

```bash
npm start
```

Ya puedes hacer peticiones POST a `/login` para obtener un JWT, y a `/protected` para validar el JWT que envíes en el header `Authorization` bajo el formato `Bearer <token>`, sustituyendo `<token>` por el JWT obtenido con la llamada POST a `/login`.