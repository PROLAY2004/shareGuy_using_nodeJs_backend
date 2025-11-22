import axios from 'axios';
import FormData from 'form-data';

import configuration from '../config/config.js';

export default class UploadController {
  fileImport = async (req, res, next) => {
    try {
      const files = req.files;

      console.log(files);
      
      // check is there any file or not
      if (files.length == 0) {
        res.status(404);
        throw new Error('No Files Found');
      }

      // check file exceed limit or not
      for (let i = 0; i < files.length; i++) {
        if (files[i].size > 20971520) {
          res.status(400);
          throw new Error('File should be less than 20MB');
        }
      }

      // operations section
      for (let i = 0; i < files.length; i++) {
        // upload file in telegram server

        const tgForm = new FormData();

        tgForm.append('chat_id', configuration.CHAT_ID);
        tgForm.append('document', files[i].buffer, {
          filename: files[i].originalname,
          contentType: files[i].mimetype,
        });

        const sendResponse = await axios.post(
          `https://api.telegram.org/bot${configuration.BOT_TOKEN}/sendDocument`,
          tgForm,
          { headers: tgForm.getHeaders() }
        );

        // get file path from server
        
        const fileId = sendResponse.data.result.document.file_id;
        const getFileResp = await axios.get(
          `https://api.telegram.org/bot${configuration.BOT_TOKEN}/getFile`,
          { params: { file_id: fileId } }
        );

        const filePath = getFileResp.data.result.file_path;
        const fileUrl = `https://api.telegram.org/file/bot${configuration.BOT_TOKEN}/${filePath}`;

        console.log(fileUrl);
      }

      res.status(200).json({
        success: true,
        message: 'All files recived',
      });
    } catch (err) {
      next(err);
    }
  };
}
