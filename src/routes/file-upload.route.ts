import { fileUploadController } from '@controllers/file-upload.controller';
import { upload } from '@middlewares/mutler.middleware';
import { Router } from 'express';

const router: Router = Router();

// Upload file directly to server (alternative to presigned URL)
router.post('/', upload.single('file'), fileUploadController.uploadFile);

// Delete a file
router.delete('/', fileUploadController.deleteFile);

export default router;
