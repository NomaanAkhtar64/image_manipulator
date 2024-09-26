/// <reference types="vite/client" />

interface IMImage {
  name: string;
  base64: string;
  size: number;
  w: number;
  h: number;
}

type Dict<T> = {
  [key: string]: T;
};
