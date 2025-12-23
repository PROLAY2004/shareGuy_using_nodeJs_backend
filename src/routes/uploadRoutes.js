import express from 'express';
import multer from 'multer';
import UploadController from '../controller/UploadController.js';

const storage = multer.diskStorage({
  destination: './userUploads',

  filename: function (req, file, cb) {
    // keep original name or add timestamp if needed
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const files = multer({ storage });

const router = express.Router();
const upload = new UploadController();

router.post('/', files.array('selectFiles[]'), upload.fileImport);
router.post('/end/:id', upload.endTransfer);

export default router;
