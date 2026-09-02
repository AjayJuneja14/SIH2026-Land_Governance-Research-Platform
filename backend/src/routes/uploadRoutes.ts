import { Router } from 'express';
import { uploadImage } from '../controllers/uploadController';
import { upload } from '../middlewares/uploadMiddleware';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', authenticate, upload.single('image'), uploadImage);

export default router;
