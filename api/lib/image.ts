import sharp from "sharp";
import { zip } from "zip-a-folder";
import path from "path";
import { mkdirSync, existsSync, rmSync } from "fs";

export async function resize({ base64, width, height }: ResizeReq) {
  const [prefix, base64Data] = base64.split(";");
  const imgBuffer = Buffer.from(base64Data, "base64");

  const processedImageBuffer = await sharp(imgBuffer)
    .resize(width, height, {
      fit: "fill",
    })
    .toBuffer();

  const processedBase64 =
    prefix + ";" + processedImageBuffer.toString("base64");
  return processedBase64;
}

export async function crop({ base64, top, left, width, height }: CropReq) {
  const [prefix, base64Data] = base64.split(";");
  const imgBuffer = Buffer.from(base64Data, "base64");

  const processedImageBuffer = await sharp(imgBuffer)
    .extract({
      width,
      height,
      left,
      top,
    })
    .toBuffer();

  const processedBase64 =
    prefix + ";" + processedImageBuffer.toString("base64");
  return processedBase64;
}

export async function slice({
  base64,
  top,
  left,
  width,
  height,
  rows,
  columns,
}: SliceReq) {
  // const zipPath = `images/download/${id}_slice.zip`;
  // const folderPath = path.join(
  //   __dirname,
  //   "..",
  //   "..",
  //   "media",
  //   "images",
  //   "download",
  //   "slice"
  //   // id
  // );

  const BufferArray: Buffer[] = [];

  // if (!existsSync(folderPath)) mkdirSync(folderPath);

  const sliceWidth = Math.floor(width / columns);
  const sliceHeight = Math.floor(height / rows);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const [prefix, base64Data] = base64.split(";");
      const imgBuffer = Buffer.from(base64Data, "base64");

      const processedBuffer = await sharp(imgBuffer)
        .extract({
          width: sliceWidth,
          height: sliceHeight,
          left: left + r * sliceWidth,
          top: top + c * sliceHeight,
        })
        .resize({ width: sliceWidth, height: sliceHeight })
        .toBuffer();
      // processedBuffer.
    }
  }

  // await zip(folderPath, path.join("media", zipPath));
  // rmSync(folderPath, { recursive: true, force: true });

  // return zipPath;
}

export async function color({
  base64,
  brightness,
  greyscale,
  hue,
  contrast,
  saturation,
}: ColorReq) {
  const [prefix, base64Data] = base64.split(";");
  const imgBuffer = Buffer.from(base64Data, "base64");

  const processedImageBuffer = await sharp(imgBuffer)
    .greyscale(greyscale)
    .linear(contrast, -(128 * contrast) + 128)
    .modulate({ brightness, saturation, hue })
    .toBuffer();

  const processedBase64 =
    prefix + ";" + processedImageBuffer.toString("base64");
  return processedBase64;
}
