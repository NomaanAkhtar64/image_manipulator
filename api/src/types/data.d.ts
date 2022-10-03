export interface ImageData {
  id: string;
  url: string;
  client: string;
  w: number;
  h: number;
}

export interface ImageUploadRequest {
  image: File;
  client: string;
}

export type Dict<T> = {
  [key: string]: T;
};

export interface ResizeReq {
  id: string;
  ext: string;
  width: number;
  height: number;
}

export interface CropReq {
  id: string;
  ext: string;
  width: number;
  height: number;
  left: number;
  top: number;
}

export interface SliceReq {
  id: string;
  ext: string;
  top: number;
  left: number;
  width: number;
  height: number;
  rows: number;
  columns: number;
}

export interface ColorReq {
  id: string;
  ext: string;
  greyscale: boolean;
  saturation: number;
  brightness: number;
  contrast: number;
  hue: number;
}
