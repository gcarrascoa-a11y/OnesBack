import mysql from 'mysql2/promise';
import express from 'express';
import hhtp from 'http';
import bodyParser from 'body-parser';
import DB from '../middleware/db.js';
import tenantsRouterFactory from './routes/tenats.routes.js';
dotenv.config();
const initServer = () => {
  const app = express();
  const server = http.createServer(app);
  const db = new DB();
  const dConnection = {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
}
db.setDataConnection(dConnection);
const tenantsRouter = tenantsRouterFactory(db);

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/tenants', tenantsRouter);

app.get('/', (req, res) => {
    res.status(200).json({ message: 'API REST esta funcionando correctamente' });
});

server.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
  });
}
initServer();