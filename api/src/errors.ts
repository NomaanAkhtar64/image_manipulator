import { NextFunction, Request, Response } from 'express';

export const ERROR = {
  UPLOAD: {
    CLIENT: "Client ID 'client' is required!",
    IMAGE: "Image File 'image' is required!",
  },
};
