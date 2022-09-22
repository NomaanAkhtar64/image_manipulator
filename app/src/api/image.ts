import axios from 'axios';
import { API_URL } from '../const';
import { CLIENT_ID } from '../main';

const ImageAPI = {
  async upload(file: File) {
    const formData = new FormData();
    formData.append('client', CLIENT_ID);
    formData.append('image', file);

    const response = await axios.post<IMImage>(API_URL`image/upload`, formData);
    return response.data;
  },
  async resize(data: ResizeReq) {
    const res = await axios.post(API_URL`image/resize`, data);
    return res.data;
  },
};
export { ImageAPI };
