import { MAX_FILE_SIZE, SUPPORTED_IMAGE_TYPES } from '@schemas/file-upload';
import multer, { memoryStorage } from 'multer';

// Configure multer for memory storage
export const upload = multer({
    storage: memoryStorage(),
    limits: {
        fileSize: MAX_FILE_SIZE,
    },
    fileFilter: (req, file, cb) => {
        if (SUPPORTED_IMAGE_TYPES.includes(file.mimetype as any)) {
            cb(null, true);
        } else {
            cb(new Error('Unsupported file type.'));
        }
    },
});
