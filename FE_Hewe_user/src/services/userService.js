import { axiosService } from "../util/service";

export const getProfileAPI = () => {
  return axiosService.get("getProfile");
};

export const requestUpdateWalletAddressAPI = ({ address }) => {
  return axiosService.post("updateWalletAddressUser", { address });
};
