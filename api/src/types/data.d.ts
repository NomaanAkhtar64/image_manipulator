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
