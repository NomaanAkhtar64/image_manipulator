import sharp from "sharp";
import { zip } from "zip-a-folder";
import path from "path";
import { mkdirSync, existsSync, rmSync } from "fs";
import { ColorReq, CropReq, ResizeReq, SliceReq } from "../types/data";

export async function getMetaData(id: string, ext: string) {
  return await sharp(`media/images/upload/${id}.${ext}`).metadata();
}

export async function resize({ id, ext, width, height }: ResizeReq) {
  const relPath = `images/download/${id}_resize.${ext}`;
  await sharp(`media/images/upload/${id}.${ext}`)
    .resize(width, height, {
      fit: "fill",
    })
    .toFile(`media/${relPath}`);

  return relPath;
}

export async function crop({ id, ext, top, left, width, height }: CropReq) {
  const relPath = `images/download/${id}_crop.${ext}`;
  await sharp(`media/images/upload/${id}.${ext}`)
    .extract({
      width,
      height,
      left,
      top,
    })
    .toFile(`media/${relPath}`);

  return relPath;
}

export async function slice({
  id,
  ext,
  top,
  left,
  width,
  height,
  rows,
  columns,
}: SliceReq) {
  const zipPath = `images/download/${id}_slice.zip`;
  const folderPath = path.join(
    __dirname,
    "..",
    "..",
    "media",
    "images",
    "download",
    "slice",
    id
  );

  if (!existsSync(folderPath)) mkdirSync(folderPath);

  const sliceWidth = Math.floor(width / columns);
  const sliceHeight = Math.floor(height / rows);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const p = `${folderPath}/${r + 1}${c + 1}.${ext}`;
      await sharp(`media/images/upload/${id}.${ext}`)
        .extract({
          width: sliceWidth,
          height: sliceHeight,
          left: left + r * sliceWidth,
          top: top + c * sliceHeight,
        })
        .resize({ width: sliceWidth, height: sliceHeight })
        .toFile(p);
    }
  }

  await zip(folderPath, path.join("media", zipPath));
  rmSync(folderPath, { recursive: true, force: true });

  return zipPath;
}

export async function color({
  id,
  ext,
  brightness,
  greyscale,
  hue,
  contrast,
  saturation,
}: ColorReq) {
  const relPath = `images/download/${id}_color.${ext}`;

  await sharp(`media/images/upload/${id}.${ext}`)
    .greyscale(greyscale)
    .linear(contrast, -(128 * contrast) + 128)
    .modulate({ brightness, saturation, hue })
    .toFile(`media/${relPath}`);

  return relPath;
}
