/// <reference types="vite/client" />

interface IMImage {
  id: string;
  url: string;
  client: string;
  w: number;
  h: number;
  ext: string;
}

interface ImageUploadRequest {
  image: File;
  client: string;
}

interface ResizeReq {
  id: string;
  ext: string;
  width: number;
  height: number;
}
interface CropReq {
  id: string;
  ext: string;
  width: number;
  height: number;
  left: number;
  top: number;
}
type Dict<T> = {
  [key: string]: T;
};

