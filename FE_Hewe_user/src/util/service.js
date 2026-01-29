import axios from "axios";

export const DOMAIN = process.env.REACT_APP_API_URL;
export const DOMAIN3 = process.env.REACT_APP_DOMAIN3;
export const DOMAIN2 = process.env.REACT_APP_DOMAIN2;

export const axiosService = axios.create({
  baseURL: DOMAIN,
  timeout: 10000,
});

const refreshToken = async () => {
  const refreshToken = JSON.parse(localStorage.getItem("user")).refreshToken;

  try {
    let response = await axios.post(DOMAIN + "api/user/refreshToken", {
      refreshToken,
    });

    const newToken = response.data.data.token;
    const newExpiresIn = response.data.data.expiresIn;

    localStorage.setItem("token", newToken);

    const user = JSON.parse(localStorage.getItem("user"));
    user.token = newToken;
    user.expiresIn = newExpiresIn;
    localStorage.setItem("user", JSON.stringify(user));

    return newToken;
  } catch (error) {
    console.log(error);

    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.reload();
  }
};

axiosService.interceptors.request.use(
  async (config) => {
    config.headers = {
      ...config.headers,
      ["Authorization"]: "Bearer " + localStorage.getItem("token"),
    };
    return config;
  },
  (errors) => {
    return Promise.reject(errors);
  }
);

axiosService.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 401 token hết hạn
    if (error?.response?.status === 401) {
      // try {
      //   const res = await getRefreshToken(
      //     localStorage.getItem(LOCAL_STORAGE.refreshToken)
      //   )

      //   localStorage.setItem(LOCAL_STORAGE.token, res.token)
      //   originalRequest.headers.Authorization = `Bearer ${res.token}`
      //   return instance(originalRequest)
      // } catch (error) {
      //   // Xử lý lỗi nếu không thể cập nhật token mới
      //   localStorage.removeItem(LOCAL_STORAGE.token)
      //   localStorage.removeItem(LOCAL_STORAGE.refreshToken)
      //   window.location.href = `${window.location.origin}/${PATHS.LOGIN}`
      // }
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    if (
      error?.response?.status === 500 &&
      error?.reponse?.message === "jwt expired"
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    // Nếu lỗi không phải là 401 hoặc 403, trả về lỗi ban đầu
    return Promise.reject(error);
  }
);
