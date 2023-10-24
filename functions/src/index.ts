import express from 'express';
import 'dotenv/config';
import { db } from './config/db/db.connection';
import middleWares from './middlewares';
import errorHandler from './middlewares/errorHandler';
import * as functions from 'firebase-functions';
import mainRoutes from './routes/mainRoutes';
import routes from './routes/index'
import corsMiddleware from './middlewares/corsMiddleware';

const app = express();
const server_port = process.env.SERVER_PORT || 3000;

db()
app.use(express.json());
middleWares(app)
app.use(mainRoutes)
corsMiddleware(app)
app.use(routes);
app.use(errorHandler);

app.listen(server_port, () => {
  console.log(`server listening at http://localhost:${server_port}`);
});

export const milestone3_rpb = functions.https.onRequest(app);
