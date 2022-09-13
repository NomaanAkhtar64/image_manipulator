import { Router } from 'express';
import { UploadRequest } from '../types/data';

const ImageRouter = Router();

ImageRouter.post('upload', (req, res) => {
  const { image, client,  } = req.body as UploadRequest;

  console.log(image, client)
  image;
  res.json();
});

export { ImageRouter };
