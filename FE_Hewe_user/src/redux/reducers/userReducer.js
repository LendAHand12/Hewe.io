const defaultState = {
  user: JSON.parse(localStorage.getItem("user")),
  profile: null,
  listPackage: [],
};

export const userReducer = (state = defaultState, action) => {
  switch (action.type) {
    case "USER_LOGIN": {
      return {
        ...state,
        user: action.payload,
      };
    }

    case "USER_LOGOUT": {
      return {
        ...state,
        user: {},
      };
    }

    case "SET_PROFILE": {
      return {
        ...state,
        profile: action.payload.userData,
        listPackage: action.payload.listPackage,
      };
    }

    default:
      return state;
  }
};
