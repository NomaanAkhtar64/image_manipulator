import sharp from 'sharp';
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
