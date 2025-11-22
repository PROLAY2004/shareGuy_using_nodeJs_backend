import express from 'express';
import configuration from './config/config.js';

const app = express();
const port = configuration.PORT;

app.listen(port, () => {
  console.log(`ShareGuy listening on port ${port}`);
});
