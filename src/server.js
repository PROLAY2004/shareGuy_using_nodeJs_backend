import express from 'express';
import cors from 'cors';

import configuration from './config/config.js';
import uploadRoutes from './routes/uploadRoutes.js';
import errorHandler from './error/errorHandler.js';
import loggerMiddleware from './validations/middleware/loggerMiddleware.js';

const app = express();
const port = configuration.PORT;

app.use(
  cors({
    origin: `${configuration.FRONTEND_URL}`,
    methods: ['POST', 'GET'],
  })
);

app.use(express.json());
app.use(loggerMiddleware);

app.use('/upload', uploadRoutes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`ShareGuy listening on port ${port}`);
});
