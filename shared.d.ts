interface ResizeReq {
  base64: string;
  width: number;
  height: number;
}

interface CropReq {
  base64: string;
  width: number;
  height: number;
  left: number;
  top: number;
}

interface SliceReq {
  base64: string;
  top: number;
  left: number;
  width: number;
  height: number;
  rows: number;
  columns: number;
}
interface ColorReq {
  base64: string;
  greyscale: boolean;
  saturation: number;
  brightness: number;
  contrast: number;
  hue: number;
}
