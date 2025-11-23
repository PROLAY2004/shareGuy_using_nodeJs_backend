import express from 'express';
import DownloadController from '../controller/downloadController.js';

const downloadFiles = new DownloadController();
const router = express.Router();

router.get('/:code', downloadFiles.fileExport);

export default router;
