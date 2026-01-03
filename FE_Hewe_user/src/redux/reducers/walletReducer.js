let defaultState = {
  address: undefined,
};

export const walletReducer = (state = defaultState, action) => {
  switch (action.type) {
    case "ON_CONNECT": {
      return {
        ...state,
        address: action.payload,
      };
    }
    case "ON_DISCONNECT": {
      return {
        ...state,
        address: undefined,
      };
    }
    default:
      return state;
  }
};
