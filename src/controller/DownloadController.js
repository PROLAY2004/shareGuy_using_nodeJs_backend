import axios from 'axios';
import archiver from 'archiver';

import uniqueCode from '../models/codeModel.js';
import fileUpload from '../models/fileModel.js';

export default class DownloadController {
  fileExport = async (req, res, next) => {
    try {
      const code = req.params.code;

      if(!code){
        res.status(401)

        throw new ErrorEvent('Code is required')
      }
      
      const fileData = await uniqueCode.findOne({ code });

      if (!fileData) {
        res.status(401);

        throw new Error('Invalid Code');
      }
      else if(!fileData.isActive){
        res.status(401)

        throw new Error('Transfer session has ended.');
      }

      const fileIds = fileData.fileIds;

      if (fileIds.length === 1) {
        const file = await fileUpload.findById(fileIds[0]);
        const fileUrl = file.fileUrl;

        const response = await axios.get(fileUrl, { responseType: 'stream' });

        res.setHeader(
          'Content-Disposition',
          `attachment; filename="${file.fileName}"`
        );
        res.setHeader('Content-Type', response.headers['content-type']);

        response.data.pipe(res);
      } else {
        res.setHeader(
          'Content-Disposition',
          `attachment; filename="${code}.zip"`
        );
        res.setHeader('Content-Type', 'application/zip');

        const archive = archiver('zip', { zlib: { level: 9 } });
        archive.pipe(res);

        for (let id of fileIds) {
          const file = await fileUpload.findById(id);
          const fileUrl = file.fileUrl;

          const response = await axios.get(fileUrl, { responseType: 'stream' });

          archive.append(response.data, { name: file.fileName });
        }

        archive.finalize();
      }
    } catch (err) {
      next(err);
    }
  };
}
