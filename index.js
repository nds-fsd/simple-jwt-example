require("dotenv").config(); // Para que la variable de entorno definida en el archivo .env esté disponible bajo process.env
const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const app = express();

app.use(cors()); // Para evitar el bloqueo de CORS al hacer peticiones desde navegador
app.use(express.json()); // Para que al recibir un JSON en las peticiones podamos leerlo accediendo a req.body

// ----------------------------------- Middleware de validación de JWT -----------------------------------
// Este middleware lo usaremos en las rutas que requieran un token válido
// Se encarga de recoger el token, validarlo y almacenar su payload si es válido, o devolver un 401 si no
// -------------------------------------------------------------------------------------------------------
const jwtMiddleware = (req, res, next) => {
  // Recogemos el header "Authorization". Sabemos que viene en formato "Bearer XXXXX...",
  // así que nos quedamos solo con el token y obviamos "Bearer "
  const authHeader = req.headers["authorization"];
  const token = authHeader.split(" ")[1];

  // Si no hubiera token, respondemos con un 401
  if (!token) return res.status(401).json({error: "Unauthorized"});

  let tokenPayload;

  try {
    // Si la función verify() funciona, devolverá el payload del token
    tokenPayload = jwt.verify(token, process.env.JWT_KEY);
  } catch (error) {
    // Si falla, será porque el token es inválido, por lo que devolvemo error 401
    return res.status(401).json({error: "Unauthorized"});
  }

  // Guardamos los datos del token dentro de req.jwtPayload, para que esté accesible en los próximos objetos req
  req.jwtPayload = tokenPayload;

  next();
}

// --------------------------------------------- RUTA /login ---------------------------------------------
// Crea y devuelte un JWT que contiene el ID del usuario y firmado con la clave secreta
// -------------------------------------------------------------------------------------------------------
app.post("/login", async (req, res) => {
  /*
    TODO Añadir validación de la combinación de usuario y contraseña
      - Buscar en la bdd de usuarios por email (que debe venir en el body de la petición)
      - Si se encuentra, revisar que el password entregado coincide con el de la bdd (ídem al email)
   */

  // Este user id debería venir de la bdd. Aquí lo hardcodeamos para simplificar
  const userId = "id-del-usuario-random";
  // Creamos un JWT, su payload contendrá el userId, y usamos la JWT_KEY como firma secreta
  const token = await jwt.sign({userId}, process.env.JWT_KEY);
  // Lo devolvemos en la respuesta
  res.json({token});
});

// ------------------------------------------- RUTA /protected -------------------------------------------
// Esta ruta tiene añadido el login jwtMiddleware antes de su ejecución,
// de forma que si no hay un JWT válido en la petición, se devolverá un 401
// Si es válido, se devolverá el payload del JWT extraído de req.tokenData (que fue agregado ahí por el middleware)
// -------------------------------------------------------------------------------------------------------
app.post("/protected", jwtMiddleware, (req, res) => {
  res.json({message: "Call to protected route was successful", tokenData: req.jwtPayload});
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});