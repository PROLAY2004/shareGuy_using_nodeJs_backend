import uniqueCode from '../../models/codeModel.js';

const validateCode = async (req, res, next) => {
  try {
    const code = req.params.code || req.body.code;
    const fileData = await uniqueCode.findOne({ code });

    if (!fileData) {
      res.status(401);

      throw new Error('Invalid Code Entered');
    }

    if (!fileData.isActive) {
      res.status(401);

      throw new Error('The code has expired.');
    }

    req.fileIds = fileData.fileIds;
    next();
  } catch (error) {
    next(error);
  }
};

export default validateCode;
