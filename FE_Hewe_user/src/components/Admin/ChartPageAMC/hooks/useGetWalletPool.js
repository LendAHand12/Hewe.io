import { useDispatch } from "react-redux";
import { axiosService } from "../../../../util/service";
import { useEffect } from "react";
import { chartActions } from "../../../../redux/reducers/chartReducer";

export const useGetWalletPool = () => {
  const dispatch = useDispatch();

  const handleGetWalletPool = async () => {
    try {
      const res = await axiosService.get("v2/getWalletPoolAddress");

      dispatch({
        type: chartActions.UPDATE_WALLET_POOL,
        payload: res.data.data,
      });
    } catch (error) {}
  };

  useEffect(() => {
    handleGetWalletPool();
  }, []);
};
