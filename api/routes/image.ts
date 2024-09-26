import express from "express";
import bodyParser from "body-parser";
import * as imglib from "../lib/image";

const ImageRouter = express.Router();

export const ERROR = {
  UPLOAD: {
    CLIENT: "Client ID 'client' is required!",
    IMAGE: "Image File 'image' is required!",
  },
};

ImageRouter.post("/resize", express.json(), function (req, res) {
  const { base64, width, height } = req.body as ResizeReq;
  imglib.resize({ base64, width, height }).then((base64) => res.send(base64));
});

ImageRouter.post("/crop", express.json(), function (req, res) {
  const { base64, width, height, left, top } = req.body as CropReq;
  imglib
    .crop({ base64, width, height, left, top })
    .then((base64) => res.send(base64));
});

ImageRouter.post("/slice", express.json(), function (req, res) {
  const { base64, width, height, left, top, rows, columns } =
    req.body as SliceReq;
  imglib
    .slice({
      base64,
      width,
      height,
      left,
      top,
      rows,
      columns,
    })
    .then((base64) => res.send(base64));
});

ImageRouter.post("/color", express.json(), async (req, res) => {
  const { base64, brightness, greyscale, hue, saturation, contrast } =
    req.body as ColorReq;
  imglib
    .color({
      base64,
      brightness,
      greyscale,
      hue,
      saturation,
      contrast,
    })
    .then((base64) => res.send(base64));
});

export { ImageRouter };
