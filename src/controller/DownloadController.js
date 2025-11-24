import axios from 'axios';
import path from 'path';

import uniqueCode from '../models/codeModel.js';
import fileUpload from '../models/fileModel.js';

export default class DownloadController {
  fileExport = async (req, res, next) => {
    try {
      const code = req.params.code;
      const fileData = await uniqueCode.findOne({ code });

      if (!fileData) {
        res.status(401);

        throw new Error('Invalid Code');
      }

      const fileIds = fileData.fileIds;

      if (fileIds.length === 1) {
        const file = await fileUpload.findById(fileIds[0]);
        const fileUrl = file.fileUrl;

        const response = await axios.get(fileUrl, {
          responseType: 'stream',
        });

        res.setHeader(
          'Content-Disposition',
          `attachment; filename="${file.fileName}"`
        );
        res.setHeader('Content-Type', response.headers['content-type']);

        // stream to user
        response.data.pipe(res);
      } else {
        console.log('More than 1 file');
      }

    } catch (err) {
      next(err);
    }
  };
}
