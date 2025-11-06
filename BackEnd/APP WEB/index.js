// index.js
require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');

const DB = require('./middleware/db');
const TenantsService = require('./services/tenants.service');
const tenantsRouterFactory = require('./routes/tenants.router');

const APP_PORT = process.env.APP_PORT || 3000;

async function initServer() {
  // 1) Conexión BD (middleware)
  const dConnection = {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  };
  const db = new DB(dConnection);

  // 2) App y middlewares
  const app = express();
  app.use(cors());
  app.use(express.json()); // parsea JSON de req.body

  // 3) Instanciar servicios y rutas
  const tenantsService = new TenantsService(db);
  app.use('/tenants', tenantsRouterFactory(tenantsService));

  // 4) Ruta raíz
  app.get('/', (_req, res) => {
    res.json({ ok: true, message: 'API funcionando' });
  });

  // 5) Levantar servidor
  const server = http.createServer(app);
  server.listen(APP_PORT, () => {
    console.log(`API levantada en http://localhost:${APP_PORT}`);
  });
}

initServer();
