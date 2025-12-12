import axios from 'axios';
import archiver from 'archiver';

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
        const fileUrl = file.fileUrl;

        const response = await axios.get(fileUrl, { responseType: 'stream' });

        res.setHeader(
          'Content-Disposition',
          `attachment; filename="${file.fileName}"`
        );
        res.setHeader('Content-Type', response.headers['content-type']);

        response.data.pipe(res);
      } else {
        const customFileName = req.code + ".zip"
        res.setHeader(
          'Content-Disposition',
          `attachment; filename=${customFileName}`
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

      if(!isValidEmail(email)){
        res.status(401)

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
