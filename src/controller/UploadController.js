import tgObj from '../utils/tgObject.js';
import getUrl from '../utils/getFilePath.js';
import fileUpload from '../models/fileModel.js';
import generateCode from '../utils/genCode.js';
import genQR from '../utils/genQrCode.js';
import uniqueCode from '../models/codeModel.js';

export default class UploadController {
  fileImport = async (req, res, next) => {
    try {
      const files = req.files;

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
      const uniCode = await generateCode();

      const data = `${req.protocol}://${req.get('host')}/download/${uniCode}`;
      const qrPath = await genQR(data, uniCode);

      for (let i = 0; i < files.length; i++) {
        const tgForm = tgObj(files[i].buffer, {
          filename: files[i].originalname,
          contentType: files[i].mimetype,
        });

        const fileUrl = await getUrl(tgForm);

        const fileData = {
          fileName: files[i].originalname,
          fileSize: files[i].size,
          contentType: files[i].mimetype,
          fileUrl,
          uniqueCode: uniCode,
          qrPath,
        };

        const newFile = new fileUpload(fileData);

        await newFile.save();
      }

      const fileData = await fileUpload.find({ uniqueCode: uniCode });
      const fileIds = [];

      for (let i = 0; i < fileData.length; i++) {
        fileIds.push(fileData[i]._id);
      }

      const newCode = new uniqueCode({ code: uniCode, fileIds, qrPath });
      const fileSession = await newCode.save();

      res.status(200).json({
        success: true,
        message: 'All files Uploaded',
        session: fileSession,
      });
    } catch (err) {
      next(err);
    }
  };

  endTransfer = async (req, res, next) => {
    try {
      const code = req.params.id;

      console.log(code);

      const fileData = await uniqueCode.findOne({ code });

      if (!fileData) {
        res.status(401);

        throw new Error('Invalid Code');
      } else if (!fileData.isActive) {
        res.status(400);

        throw new Error('The transfer has already ended.');
      }

      const endFileSession = await uniqueCode.findOneAndUpdate(
        { code },
        {
          isActive: false,
        }
      );

      res.status(200).json({
        success: true,
        message: 'Transfer Ended',
        session: endFileSession,
      });

    } catch (err) {
      next(err);
    }
  };
}
