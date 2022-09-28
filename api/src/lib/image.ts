import sharp from 'sharp';
import { zip } from 'zip-a-folder';
import path from 'path';
import { mkdirSync, existsSync, rmSync } from 'fs';
export async function getMetaData(id: string, ext: string) {
  return await sharp(`media/images/upload/${id}.${ext}`).metadata();
}

export async function resize(
  id: string,
  ext: string,
  width: number,
  height: number
) {
  const relPath = `images/download/${id}_resize.${ext}`;
  await sharp(`media/images/upload/${id}.${ext}`)
    .resize(width, height, {
      fit: 'fill',
    })
    .toFile(`media/${relPath}`);

  return relPath;
}

export async function crop(
  id: string,
  ext: string,
  width: number,
  height: number,
  left: number,
  top: number
) {
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

export async function slice(
  id: string,
  ext: string,
  width: number,
  height: number,
  left: number,
  top: number,
  rows: number,
  columns: number
) {
  const zipPath = `images/download/${id}_slice.zip`;
  const folderPath = path.join(
    __dirname,
    '..',
    '..',
    'media',
    'images',
    'download',
    'slice',
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
        .toFile(p);
    }
  }

  await zip(folderPath, path.join('media', zipPath));
  rmSync(folderPath, { recursive: true, force: true });

  return zipPath;
}
