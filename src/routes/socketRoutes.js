import express from 'express';

import SocketController from '../controller/SocketController.js';

const socket = new SocketController();
const router = express.Router();

router.get('/host', socket.connectHost);
router.post('/client', socket.connectClient);

export default router;
