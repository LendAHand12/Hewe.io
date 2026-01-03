import { axiosService } from "../util/service";

export const getHistoryCommissionAPI = ({ limit, page }) => {
  return axiosService.get(`/v2/commissionV2History?limit=${limit}&page=${page}`);
};
