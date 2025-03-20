import multer, { memoryStorage } from 'multer';

// Configura multer
const storage = memoryStorage();
export const upload = multer({ storage });
