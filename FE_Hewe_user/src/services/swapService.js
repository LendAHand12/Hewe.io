import { axiosService } from "../util/service";

export const getMyPortAPI = () => {
  return axiosService.get("api/user/userGetMyGate");
};

export const getDetailPortAPI = () => {
  return axiosService.get("");
};

export const requestDepositUSDTToPortAPI = ({ amount, gateId, gRec }) => {
  return axiosService.post("api/user/transferUSDTToGate", {
    amount,
    gateId,
    gRec,
  });
};

export const requestWithdrawUSDTFromPortAPI = ({ amount, gateId, gRec }) => {
  return axiosService.post("api/user/withdrawUSDTFromGate", {
    amount,
    gateId,
    gRec,
  });
};

export const requestDepositBizpointToPortAPI = ({ amount, gateId, gRec }) => {
  return axiosService.post("api/user/transferPointToGate", {
    amount,
    gateId,
    gRec,
  });
};

export const requestWithdrawBizpointFromPortAPI = ({
  amount,
  gateId,
  gRec,
}) => {
  return axiosService.post("api/user/withdrawPointFromGate", {
    amount,
    gateId,
    gRec,
  });
};

export const getHistoryMyDepositAPI = ({ limit, page }) => {
  return axiosService.get(
    `api/user/getHistoryTransferUSDTToGate?limit=${limit}&page=${page}`
  );
};

export const getHistoryMyWithdrawAPI = ({ limit, page }) => {
  return axiosService.get(
    `api/user/getHistoryWithdrawUSDTfromGate?limit=${limit}&page=${page}`
  );
};

export const getHistoryMyDepositBizpointAPI = ({ limit, page }) => {
  return axiosService.get(
    `api/user/getHistoryTransferPointToGate?limit=${limit}&page=${page}`
  );
};

export const getHistoryMyWithdrawBizpointAPI = ({ limit, page }) => {
  return axiosService.get(
    `api/user/getHistoryWithdrawPointfromGate?limit=${limit}&page=${page}`
  );
};

export const requestUpdateRateAPI = async ({ rate, gateId, gRec }) => {
  return axiosService.post("api/user/setRateUser", { rate, gateId, gRec });
};

export const getListPortAPI = async ({ side }) => {
  return axiosService.get(
    `api/user/getActiveGate?${side === "buy" ? "side=buy" : ""}`
  );
};

export const getSwapRateConfigAPI = async () => {
  return axiosService.get("api/user/getSwapConfig");
};

export const requestSellBizpointSwapAPI = async ({
  gateId,
  gRec,
  amountToSell,
  useWallet = 1,
}) => {
  return axiosService.post("api/user/sellBizpoint_Swap", {
    gRec,
    gateId,
    amountToSell,
    useWallet,
  });
};

export const requestBuyBizpointSwapAPI = async ({
  gateId,
  gRec,
  amountToBuy,
}) => {
  return axiosService.post("api/user/buyBizpoint_Swap", {
    gRec,
    gateId,
    amountToBuy,
  });
};

export const requestSendOTPConfirmSellSwapAPI = async ({
  transactionId,
  code,
  gRec,
}) => {
  return axiosService.post("api/user/confirmSellBizpoint_Swap", {
    transactionId,
    code,
    gRec,
  });
};

export const requestSendOTPConfirmBuySwapAPI = async ({
  transactionId,
  code,
  gRec,
}) => {
  return axiosService.post("api/user/confirmBuyBizpoint_Swap", {
    transactionId,
    code,
    gRec,
  });
};

export const getHistoryMyAdsAPI = async ({ limit, page, side }) => {
  return axiosService.get(
    `api/user/getHistoryTransactionByGate?side=${side}&limit=${limit}&page=${page}`
  );
};

export const requestTransferUSDTToUserAPI = async ({
  receiverId,
  receiverName,
  amountUSDT,
  fee,
  content,
  gRec,
}) => {
  return axiosService.post(`api/user/transferUSDTToUser`, {
    receiverId,
    receiverName,
    amountUSDT,
    fee,
    content,
    gRec,
  });
};

export const getHistoryTransferContentAPI = ({ limit, page, type }) => {
  return axiosService.get(
    `api/user/getHistoryTransferUSDTUser?limit=${limit}&page=${page}&type=${type}`
  );
};

export const getStatisticsSwapTransactionByDay = ({ typeChart }) => {
  return axiosService.get(
    `api/user/getStatisticsSwapTransactionByDay?typeChart=${typeChart}`
  );
};

export const checkAvailableSwapAndBuyBCFAPI = () => {
  return axiosService.get("api/v2swap/getBCFConfig");
};

export const requestSwapTokenAPI = ({ from, to, amountUSDT, gRec }) => {
  return axiosService.post("swap", { from, to, amountUSDT, gRec });
};

export const getSwapHistoryAPI = ({
  page,
  limit,
  from,
  to,
  timeStart,
  timeEnd,
}) => {
  return axiosService.get(`getSwapHistory?limit=${limit}&page=${page}`);
};

export const getBuyByVNDHistoryAPI = ({
  page,
  limit,
  from,
  to,
  timeStart,
  timeEnd,
}) => {
  return axiosService.get(`getBuyHeweByVNDHistory?limit=${limit}&page=${page}`);
};

export const getSwapConfigAPI = () => {
  return axiosService.get("getSwapConfig");
};

export const getBuyByUSDTHistoryAPI = ({
  page,
  limit,
  from,
  to,
  timeStart,
  timeEnd,
}) => {
  return axiosService.get(
    `getHistoryBuyPackageHeweByUSDT?limit=${limit}&page=${page}`
  );
};
