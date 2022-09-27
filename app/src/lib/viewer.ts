interface GetViwerSizeParams {
  width: number;
  height: number;
  max: Size;
  imageWidth: number;
  imageHeight: number;
}

export function getViewerSize({
  width,
  height,
  max,
  imageWidth,
  imageHeight,
}: GetViwerSizeParams): Size {
  const wpercent = width / imageWidth;
  const hpercent = height / imageHeight;

  return {
    width: max.width * wpercent,
    height: max.height * hpercent,
  };
}
