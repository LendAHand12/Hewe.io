const initialState = {
  currentCandle: null,
  walletBuyPool: null,
  walletSellPool: null,
  usdtPool: null,
  hewePool: null,
};

export const chartActions = {
  UPDATE_CURRENT_CANDLE: "UPDATE_CURRENT_CANDLE",
  UPDATE_WALLET_POOL: "UPDATE_WALLET_POOL",
  UPDATE_POOLS: "UPDATE_POOLS",
};

export const chartReducer = (state = initialState, action) => {
  switch (action.type) {
    case chartActions.UPDATE_CURRENT_CANDLE:
      return { ...state, currentCandle: action.payload };

    case chartActions.UPDATE_WALLET_POOL:
      return {
        ...state,
        walletBuyPool: action.payload.walletBuy,
        walletSellPool: action.payload.walletSell,
      };

    case chartActions.UPDATE_POOLS:
      return {
        ...state,
        usdtPool: action.payload.poolUsdt,
        hewePool: action.payload.poolHewe,
      };

    default:
      return state;
  }
};
