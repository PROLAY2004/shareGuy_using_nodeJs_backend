import express from 'express';
import multer from 'multer';

import UploadController from '../controller/UploadController.js';

const files = multer({
  storage: multer.memoryStorage(), // <-- file stored in RAM only
});

const router = express.Router();
const upload = new UploadController();

router.post('/', files.array('selectFiles[]'), upload.fileImport);
router.post('/end/:id', upload.endTransfer);

export default router;
