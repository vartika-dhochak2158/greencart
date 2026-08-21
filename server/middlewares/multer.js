import multer from 'multer';

// Keep files in memory (RAM buffer) instead of saving to the server disk
const storage = multer.memoryStorage();

const upload = multer({ storage });

export default upload;