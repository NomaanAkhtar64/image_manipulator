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

type Dict<T> = {
  [key: string]: T;
};

