import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ noServer: true });

export default function initWebsocketServer() {
  wss.on('connection', (ws, request) => {
    const params = new URLSearchParams(request.url.replace('/?', ''));
    const mode = params.get('mode'); // host or client
    const publicCode = params.get('public');
    const privateCode = params.get('private');

    const room = connections.get(publicCode);
    if (!room) return ws.close();

    if (mode === 'host') {
      room.hostSocket = ws;
      console.log('Host connected:', publicCode);
    }

    if (mode === 'client') {
      if (room.privateCode !== privateCode) {
        ws.close();
        return;
      }
      room.clientSocket = ws;
      console.log('Client connected:', publicCode);
    }

    ws.on('message', (msg) => {
      if (mode === 'client' && room.hostSocket) room.hostSocket.send(msg);

      if (mode === 'host' && room.clientSocket) room.clientSocket.send(msg);
    });

    ws.on('close', () => console.log('Socket closed'));
  });
}
