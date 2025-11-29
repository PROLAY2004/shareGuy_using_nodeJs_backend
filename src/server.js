import express from 'express';
import cors from 'cors';

import configuration from './config/config.js';
import uploadRoutes from './routes/uploadRoutes.js';
import downloadRoutes from './routes/downloadRoutes.js';
import errorHandler from './error/errorHandler.js';
import loggerMiddleware from './middleware/loggerMiddleware.js';
import connectDB from './config/dbConfig.js';

connectDB();
const app = express();
const port = configuration.PORT;

app.use(
  cors({
    origin: `${configuration.FRONTEND_URL}`,
    methods: ['POST', 'GET'],
  })
);

app.use(express.json());
// app.use(loggerMiddleware);

app.use('/upload', uploadRoutes);
app.use('/download', downloadRoutes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`ShareGuy listening on port ${port}`);
});
