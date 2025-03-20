import { Router } from 'express';
import { ImageController } from '../controllers/imageController';
import { upload } from '../config/multer';

const router = Router();

router.post('/convert', upload.single('image'), ImageController.convertToWebp);

export default router;
