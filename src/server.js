import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';

import { createServer } from 'http';
import configuration from './config/config.js';
import uploadRoutes from './routes/uploadRoutes.js';
import downloadRoutes from './routes/downloadRoutes.js';
import errorHandler from './error/errorHandler.js';
import loggerMiddleware from './validations/middleware/loggerMiddleware.js';
import connectDB from './config/dbConfig.js';
import initSocket from './webSocket/ws.js';

await connectDB();

const app = express();
const server = createServer(app);
export const io = new Server(server, {
  cors: configuration.CORS,
});

app.use(cors(configuration.CORS));

app.use(express.json());
app.use(loggerMiddleware);

app.use('/upload', uploadRoutes);
app.use('/download', downloadRoutes);

app.use(errorHandler);

initSocket();

server.listen(configuration.PORT, () => {
  console.log(`ShareGuy listening on port ${configuration.PORT}`);
});