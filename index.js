const { checkApiKey } = require("./middleware/auth")
const v1Router = require("./api/v1/router/userRouter")
const v1Stripe = require("./api/v1/router/userStripe")
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require("cors")

const corsOptions = {
  origin: ['http://localhost:5173', 'https://viajaconmia.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
};

//Manejo de req
app.use(cors(corsOptions));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Manejo de rutas
app.use("/v1/factura", checkApiKey, v1Router)
app.use("/v1/stripe", checkApiKey, v1Stripe)
app.get('/', (req, res) => res.json({ mensaje: 'Bienvenido a la API. Por favor, autentícate para acceder a más datos.' }));

// Middleware para manejar errores globales
app.use((err, req, res, next) => {
  console.error(err);
  console.error(err.stack);
  res.status(500).json({
    error: true,
    mensaje: err.message || 'Ocurrió un error interno en el servidor',
  });
});
app.listen(PORT, () => console.log(`Servidor escuchando en http://localhost:${PORT}`));