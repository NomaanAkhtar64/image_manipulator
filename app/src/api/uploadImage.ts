import { encodeImageFile } from '../utils';
import axios from 'axios';
import { API_URL } from '../const';
import { CLIENT_ID } from '../main';

export async function uploadImage(file: File) {
  const image = await encodeImageFile(file);

  const response = await axios.post<ImageData>(API_URL`image/upload`, {
    client: CLIENT_ID,
    image,
    ext: file.name.split('.').pop() || 'jpg',
  } as ImageUploadRequest);
  return response.data;
}
