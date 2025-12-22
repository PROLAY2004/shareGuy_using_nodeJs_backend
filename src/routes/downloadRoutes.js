import express from 'express';

import DownloadController from '../controller/DownloadController.js';
import EmailFileValidation from '../validations/middleware/EmailFileValidation.js';
import validateCode from '../validations/middleware/validateCode.js';

const downloadFiles = new DownloadController();
const fileValidationRequest = new EmailFileValidation();

const router = express.Router();

router.get('/:code', validateCode, downloadFiles.fileExport);
router.post(
  '/send-email',
  fileValidationRequest.fileMailerRequest,
  validateCode,
  downloadFiles.emailFile
);

export default router;
