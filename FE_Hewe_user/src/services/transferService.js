import { axiosService } from "../util/service";

// export const requestWithdrawUSDTAPI = ({
//   method,
//   address,
//   amount,
//   fee,
//   gRec,
// }) => {
//   return axiosService.post("api/user/withdrawUSDT", {
//     method,
//     address,
//     amount,
//     fee,
//     gRec,
//   });
// };

export const requestWithdrawHEWEAPI = ({
  method,
  address,
  amount,
  fee,
  gRec,
  symbol,
}) => {
  return axiosService.post("withdrawHEWE", {
    method,
    address,
    amount,
    fee,
    gRec,
    symbol: `USDT.${symbol}`,
  });
};

export const requestWithdrawAMCAPI = ({
  method,
  address,
  amount,
  fee,
  gRec,
  symbol,
}) => {
  return axiosService.post("withdrawAMC", {
    method,
    address,
    amount,
    fee,
    gRec,
    symbol: `USDT.${symbol}`,
  });
};

export const requestWithdrawUSDTAPI = ({
  method,
  address,
  amount,
  fee,
  gRec,
  symbol,
}) => {
  return axiosService.post("withdrawUSDT", {
    method,
    address,
    amount,
    fee,
    gRec,
    symbol: `USDT.${symbol}`,
  });
};

// export const getHistoryWithdrawUSDTAPI = ({ limit, page, status = "" }) => {
//   return axiosService.get(
//     `api/user/getHistoryWithdrawUSDT?limit=${limit}&page=${page}&status=${status}`
//   );
// };

export const getHistoryWithdrawUSDTAPI = ({ limit, page, status = "" }) => {
  return axiosService.get(
    `getWithdrawUsdtHistory?limit=${limit}&page=${page}&status=${status}`
  );
};

export const getHistoryWithdrawHEWEAPI = ({ limit, page, status = "" }) => {
  return axiosService.get(
    `getWithdrawHeweHistory?limit=${limit}&page=${page}&status=${status}`
  );
};

export const getHistoryWithdrawAMCAPI = ({ limit, page, status = "" }) => {
  return axiosService.get(
    `getWithdrawAmcHistory?limit=${limit}&page=${page}&status=${status}`
  );
};

export const getHistoryDepositUSDTAPI = ({ limit, page }) => {
  return axiosService.get(`getDepositHistory?limit=${limit}&page=${page}`);
};

export const getHistoryDepositAMCAPI = ({ limit, page }) => {
  return axiosService.get(`getDepositAMCHistory?limit=${limit}&page=${page}`);
};

export const getHistoryDepositHEWEAPI = ({ limit, page }) => {
  return axiosService.get(`getDepositHEWEHistory?limit=${limit}&page=${page}`);
};

export const getWalletUSDTAPI = ({ token, symbol }) => {
  return axiosService.post("createWallet", {
    gRec: token,
    symbol: `USDT.${symbol}`,
  });
};

export const getWalletAMCAPI = ({ token, symbol }) => {
  return axiosService.post("createWallet", {
    gRec: token,
    symbol: `USDT.${symbol}`,
  });
};

export const getWalletHEWEAPI = () => {
  return axiosService.get("v2/getDepositHeweAddress");
};

export const getUserNameByIdAPI = ({ id }) => {
  return axiosService.get(`api/transfer/getUsernameById?id=${id}`);
};
