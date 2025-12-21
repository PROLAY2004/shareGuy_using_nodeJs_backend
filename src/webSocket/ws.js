import { io } from '../server.js';

export default function initSocket() {
  io.on('connection', (socket) => {
    console.log('User Connected : ', socket.id);

    socket.on('send-file', ({ roomId, shareCodeId }) => {
      socket.to(roomId).emit('receive-file', shareCodeId);
    });
  });
}
