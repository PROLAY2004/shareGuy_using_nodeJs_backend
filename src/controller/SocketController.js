import { v4 as uuid } from 'uuid';

const connections = new Map();

export default class SocketController {
  connectHost = async (req, res, next) => {
    try {
      const publicCode = uuid().slice(0, 6);
      const privateCode = uuid().slice(0, 10);

      connections.set(publicCode, {
        privateCode,
        hostSocket: null,
        clientSocket: null,
      });

      res.status(200).json({
        success: true,
        message: 'Code Generated',
        publicCode,
        privateCode,
      });
    } catch (err) {
      next(err);
    }
  };

  connectClient = async (req, res, next) => {
    try {
      const { publicCode } = req.body;
      const room = connections.get(publicCode);

      if (!room) {
        res.status(404);
        throw new Error('Invalid Code');
      }

      res.status(200).json({
        success: true,
        message: 'Client Connected',
        privateCode: room.privateCode,
      });
    } catch (err) {
      next(err);
    }
  };
}
