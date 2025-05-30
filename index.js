const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { checkApiKey } = require("./middleware/auth");
const v1Router = require("./api/v1/router/general");
const db = require('./api/v1/model/sequelize');
const { sequelize } = db;

const app = express();
const PORT = process.env.PORT || 3001;

// ==========================
// Configuración de CORS
// ==========================
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://viajaconmia.com',
    'http://localhost:3000',
    'https://miaadmin.vercel.app',
    "https://mia-prueba.vercel.app/",
    "https://mia-prueba.vercel.app"
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key', "cache-control", "pragma", "Expires"],
};

app.use(cors(corsOptions));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Evita el almacenamiento en caché
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

// ==========================
// Rutas
// ==========================
app.use("/v1", checkApiKey, (req, res, next) => {
  res.setHeader("Cache-Control", "no-cache");
  next();
}, v1Router);

app.get('/', (req, res) => res.json({
  mensaje: 'Bienvenido a la API. Por favor, autentícate para acceder a más datos.'
}));

// ==========================
// Middleware de errores
// ==========================
app.use((err, req, res, next) => {
  const errorData = err.response?.data;
  console.error(errorData);

  res.status(500).json({
    error: true,
    mensaje: err.message || 'Ocurrió un error interno en el servidor',
    data: errorData || null
  });
});

// ==========================
// Inicializar Sequelize y levantar el servidor
// ==========================
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida con Sequelize.');

    // Opcional: sincronizar modelos
    // await sequelize.sync({ alter: true });

    app.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
    process.exit(1);
  }
}

startServer();
