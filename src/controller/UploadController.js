import fileUpload from '../models/fileModel.js';
import generateCode from '../utils/genCode.js';
import uniqueCode from '../models/codeModel.js';

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
      const uniCode = await generateCode();

      for (let i = 0; i < files.length; i++) {
        const fileData = {
          fileName: files[i].originalname,
          fileSize: files[i].size,
          contentType: files[i].mimetype,
          fileUrl: files[i].path,
          uniqueCode: uniCode,
        };

        const newFile = new fileUpload(fileData);

        await newFile.save();
      }

      // collect all file ids and save in uniqueCode collection
      const fileData = await fileUpload.find({ uniqueCode: uniCode });
      const fileIds = [];

      for (let i = 0; i < fileData.length; i++) {
        fileIds.push(fileData[i]._id);
      }

      const newCode = new uniqueCode({ code: uniCode, fileIds });
      const fileSession = await newCode.save();

      res.status(200).json({
        success: true,
        message: 'All files Uploaded',
        data: fileSession,
      });
    } catch (err) {
      next(err);
    }
  };

  endTransfer = async (req, res, next) => {
    try {
      const code = req.params.id;
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
