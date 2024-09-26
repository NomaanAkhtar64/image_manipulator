import axios from "axios";
import { API_URL, API_URL_FN } from "../const";
import { CLIENT_ID } from "../main";

type ImageAPIs = "resize" | "crop" | "slice" | "color";
interface ImageAPIParams {
  resize: ResizeReq;
  crop: CropReq;
  slice: SliceReq;
  color: ColorReq;
}

const ImageAPI = {
  // async upload(file: File) {
  //   const formData = new FormData();
  //   formData.append('client', CLIENT_ID);
  //   formData.append('image', file);

  //   const response = await axios.post<IMImage>(API_URL`image/upload`, formData);
  //   return response.data;
  // },
  async use<T extends ImageAPIs>(
    action: T,
    data: ImageAPIParams[T]
  ): Promise<string> {
    const res = await axios.post(API_URL_FN(`image/${action}`), data);
    console.log(res);
    return res.data;
  },
};
export { ImageAPI };
