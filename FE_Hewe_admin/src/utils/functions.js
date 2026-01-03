import Axios from "axios";
import axios from "../axios";
export const uploadImage = async (file) => {
  var formData = new FormData();
  formData.append("media", file);
  try {
    const { data } = await axios.post("/auth/uploadImage", formData);

    return data;
  } catch (error) {}
};

export const extractDate = (e) => {
  if (e) {
    let date = new Date(e).toLocaleDateString();
    return date;
  } else {
    return "";
  }
};

export async function handleImageUpload(file) {
  // const [progress, setProgress] = useState(0);
  const formData = new FormData();
  formData.append("img", file);
  console.log(file);
  const config = {
    headers: {
      // "Content-Type": "multipart/form-data",
      authorization: localStorage.getItem("token"),
    },
    onUploadProgress: (progressEvent) => {
      const progress = (progressEvent.loaded / progressEvent.total) * 50;
      // setProgress(progress);
      // console.log(progressEvent.loaded);
      // console.log(progress);
    },
    onDownloadProgress: (progressEvent) => {
      const progress = 50 + (progressEvent.loaded / progressEvent.total) * 50;
      // console.log(progress);
      // setProgress(progress);
    },
  };
  // const [progress, setProgress] = useState(0);
  // const instance = axios.create({
  //   baseURL: "http://18.221.140.83:3000",
  //   headers: {
  //     "Content-type": "application/json",
  //   },
  // });
  try {
    const res = await axios.post("/uploadImg", formData, config);
    // console.log(data);

    return res.data.data.img.path;
    //{ location: data.result.file, };
  } catch (err) {
    return err;
  }
}

export const roundDisplay = (value) => {
  if (Number.isInteger(value)) {
    return Number(value).toLocaleString("en-US").replaceAll(",", " ");
  } else
    return Number(value)
      .toLocaleString("en-US", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      })
      .replaceAll(",", " ");
};

export const round = (num) => Math.round(num * 100) / 100;
