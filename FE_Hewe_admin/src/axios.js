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

// Set Authorization header with token from localStorage
const token = localStorage.getItem("token");
if (token) {
  instance.defaults.headers.common["Authorization"] = token;
}

instance.interceptors.request.use(
  async (config) => {
    const JWT_token = localStorage.getItem("token");
    if (JWT_token) {
      config.headers.Authorization = JWT_token;
    }
    return config;
  },
  (error) => {
    toast.error(`${error.response.data.message}`, {
      position: toast.POSITION.TOP_RIGHT,
    });
    if (error.response.status === 401 || error.response.status === 500) {
      alert("New login detected, Login Again!");
      localStorage.removeItem("token");
      localStorage.removeItem("email");
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
