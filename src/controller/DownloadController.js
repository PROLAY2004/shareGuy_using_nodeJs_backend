import archiver from 'archiver';
import fs from 'fs';
import path from 'path';

import SendEmailService from '../services/SendEmailService.js';
import fileUpload from '../models/fileModel.js';
import isValidEmail from '../utils/checkValidEmail.js';

const emailService = new SendEmailService();

export default class DownloadController {
  fileExport = async (req, res, next) => {
    try {
      const fileIds = req.fileIds;

      if (fileIds.length === 1) {
        const file = await fileUpload.findById(fileIds[0]);

        if (!file) {
          res.status(404);
          throw new Error('File not found');
        }

        const filePath = path.resolve(file.fileUrl);

        if (!fs.existsSync(filePath)) {
          res.status(404);
          throw new Error('File missing on server');
        }

        res.setHeader(
          'Content-Disposition',
          `attachment; filename="${file.fileName}"`
        );
        res.setHeader('Content-Type', file.contentType);

        const readStream = fs.createReadStream(filePath);
        readStream.pipe(res);
      } else {
        const zipName = `${req.code}.zip`;

        res.setHeader(
          'Content-Disposition',
          `attachment; filename="${zipName}"`
        );
        res.setHeader('Content-Type', 'application/zip');

        const archive = archiver('zip', { zlib: { level: 9 } });
        archive.pipe(res);

        for (const id of fileIds) {
          const file = await fileUpload.findById(id);
          if (!file) continue;

          const filePath = path.resolve(file.fileUrl);

          if (fs.existsSync(filePath)) {
            archive.file(filePath, { name: file.fileName });
          }
        }

        await archive.finalize();
      }
    } catch (err) {
      next(err);
    }
  };

  emailFile = async (req, res, next) => {
    try {
      const email = req.body.email;

      if (!isValidEmail(email)) {
        res.status(401);

        throw new Error('Please Enter a Valid Email');
      }

      const fileIds = req.fileIds;
      const files = await fileUpload.find({ _id: { $in: fileIds } });

      const formattedFiles = files.map((file) => ({
        fileName: file.fileName,
        fileUrl: file.fileUrl, // your URL (Telegram / storage / etc.)
      }));

      const emailResponse = await emailService.fileMailer(
        email,
        formattedFiles
      );

      res.status(200).json({
        success: true,
        message: 'File sent to email.',
        emailResponse,
      });
    } catch (err) {
      next(err);
    }
  };
}
