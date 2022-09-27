import express from 'express';
import bodyParser from 'body-parser';
import { imageUploader } from '../file';
import { ERROR } from '../errors';
import * as imglib from '../lib/image';
const ImageRouter = express.Router();

ImageRouter.post(
  '/upload',
  bodyParser.urlencoded({ extended: false }),
  imageUploader.single('image'),
  async (req, res) => {
    let errors: string[] = [];
    if (!req.body.client) errors.push(ERROR.UPLOAD.CLIENT);
    if (!req.file) errors.push(ERROR.UPLOAD.IMAGE);

    if (!req.file || !req.body.client) {
      res.json(errors);
      return;
    }

    const image = req.file as Express.Multer.File;
    const { client } = req.body;

    const [id, ext] = image.filename.split('.');

    try {
      const metadata = await imglib.getMetaData(id, ext);
      if (!metadata.width || !metadata.height) {
        return res.json('Image is corrupt!');
      }
      return res.json({
        id,
        client,
        url: `http://${req.hostname}:4000/images/upload/${image.filename}`,
        w: metadata.width,
        h: metadata.height,
        ext,
      });
    } catch (err) {
      res.json('SERVER: sharp malfunction!');
      return;
    }
  }
);

interface ResizeReq {
  id: string;
  ext: string;
  width: number;
  height: number;
}

ImageRouter.post('/resize', express.json(), async (req, res) => {
  const { id, ext, width, height } = req.body as ResizeReq;
  const relPath = await imglib.resize(id, ext, width, height);
  const url = `http://${req.hostname}:4000/${relPath}`;
  res.send(url);
});

interface CropReq {
  id: string;
  ext: string;
  width: number;
  height: number;
  left: number;
  top: number;
}

ImageRouter.post('/crop', express.json(), async (req, res) => {
  const { id, ext, width, height, left, top } = req.body as CropReq;
  const relPath = await imglib.crop(id, ext, width, height, left, top);
  const url = `http://${req.hostname}:4000/${relPath}`;
  res.send(url);
});

export { ImageRouter };
