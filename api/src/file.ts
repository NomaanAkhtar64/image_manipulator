import multer from 'multer';
import { createUUID } from './utils/uuid';

const storage = multer.diskStorage({
  destination: 'media/images/upload',
  filename(req, file, callback) {
    const ext = file.originalname.split('.').pop();

    const id = createUUID();

    callback(null, `${id}.${ext}`);
  },
});

export const imageUploader = multer({ storage });
