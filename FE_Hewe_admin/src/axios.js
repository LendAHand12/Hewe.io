import axios from "axios";
import { API_URL } from "./constants/Statics";

// import { compose } from "redux";
import { toast } from "react-toastify";

const instance = axios.create({
  baseURL: API_URL,
});

// customer and admin secure
instance.defaults.headers.common["language"] =
  window.localStorage.getItem("rcml-lang") || "en";
instance.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
if (localStorage.accessToken) {
  const JWT_token = localStorage.accessToken;
  instance.defaults.headers.common["access_token"] = JWT_token;
}

instance.interceptors.request.use(
  async (config) => {
    const JWT_token = localStorage.accessToken;
    config.headers.common["access_token"] = JWT_token;

    return config;
  },
  (error) => {
    toast.error(`${error.response.data.message}`, {
      position: toast.POSITION.TOP_RIGHT,
    });
    if (error.response.status === 401 || error.response.status === 500) {
      alert("New login detected, Login Again!");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userData");
      window.location.pathname = "/adminPanel";
    }
    return Promise.reject(error);
  }
);
// instance.interceptors.response.use(
//   function (response) {
//     return response;
//   },
//   function (error) {
//     // const superAccess = Cookies.get("access");
//     if (error.response?.status === 401) {
//       alert(
//         "Your account is currently logged into another device. Please Login Again"
//       );
//       localStorage.removeItem("accessToken");
//       localStorage.removeItem("userData");
//       window.location.pathname = "/";
//       // Cookies.remove("admin_access_token");
//       // Cookies.remove("userType");
//       // Cookies.remove("username");
//       // Cookies.remove("profileImage");
//       // this.props.history.push("//login");
//     } else {
//       // alert(`Error:${error.response.data.message}`);
//       // Cookies.remove("admin_access_token");
//       // window.location.href = "//login";
//     }
//     return Promise.reject(error);
//   }
// );
export default instance;
