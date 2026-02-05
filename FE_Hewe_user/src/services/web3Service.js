import { axiosService } from '../util/service';

// Web3 Deposit - Complete deposit and update balance
export const completeDepositWeb3API = ({ txHash, amount }) => {
    return axiosService.post("completeDepositWeb3", {
        txHash,
        amount,
    });
};
