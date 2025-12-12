import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';

import initWebsocketServer from './ws.js';
import configuration from './config/config.js';
import uploadRoutes from './routes/uploadRoutes.js';
import downloadRoutes from './routes/downloadRoutes.js';
import socketRoutes from './routes/socketRoutes.js';
import errorHandler from './error/errorHandler.js';
import loggerMiddleware from './validations/middleware/loggerMiddleware.js';
import connectDB from './config/dbConfig.js';

connectDB();
const app = express();
const port = configuration.PORT;
const wss = new WebSocketServer({ noServer: true });

app.use(
  cors({
    origin: `${configuration.FRONTEND_URL}`,
    methods: ['POST', 'GET'],
  })
);

app.use(express.json());
app.use(loggerMiddleware);

app.use('/upload', uploadRoutes);
app.use('/download', downloadRoutes);
app.use('/connect', socketRoutes);

app.use(errorHandler);

initWebsocketServer();

const server = app.listen(port, () => {
  console.log(`ShareGuy listening on port ${port}`);
});

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});