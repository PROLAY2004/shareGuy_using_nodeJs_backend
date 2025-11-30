import axios from 'axios';
import archiver from 'archiver';

import SendEmailService from '../services/SendEmailService.js';
import uniqueCode from '../models/codeModel.js';
import fileUpload from '../models/fileModel.js';

const emailService = new SendEmailService();

export default class DownloadController {
  fileExport = async (req, res, next) => {
    try {
      const code = req.params.code;
      const fileData = await uniqueCode.findOne({ code });

      if (!fileData) {
        res.status(401);

        throw new Error('Invalid Code Entered');
      } else if (!fileData.isActive) {
        res.status(401);

        throw new Error('The code has expired.');
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

  emailFile = async (req, res, next) => {
    try {
      const email = req.body.email;
      const code = req.body.code;

      const fileData = await uniqueCode.findOne({ code });

      if (!fileData) {
        res.status(401);

        throw new Error('Invalid Code Entered');
      } else if (!fileData.isActive) {
        res.status(401);

        throw new Error('The code has expired.');
      }

      console.log(fileData);
      

      res.status(200).json({
        success: true,
        message: 'File sent to email.',
      });
    } catch (err) {
      next(err);
    }
  };
}
