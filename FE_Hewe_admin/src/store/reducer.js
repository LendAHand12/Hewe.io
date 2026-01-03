import {
  bankDetailsObjOne,
  loginObjOne,
  pendingApprovalObjOne,
  restaurantDetailsObjOne
} from "../components/LoginSection/Data";
import * as actionTypes from "./actions";
const data = JSON.parse(localStorage.getItem("userData"));

const reloadPassData = (data) => {
  if (!data) {
    return loginObjOne;
  } else if (!data.is_verified) {
    return loginObjOne;
  } else if (data.is_profile_completed === "0") {
    return restaurantDetailsObjOne;
  } else if (data.is_profile_completed === "1") {
    return bankDetailsObjOne;
  } else if (data.is_profile_completed === "2") {
    return pendingApprovalObjOne;
  } else {
    return loginObjOne;
  }
};

const initialState = {
  userData: JSON.parse(localStorage.getItem("userData")),
  defaultState: reloadPassData(data),
  locations: [],
  sidebar: true,
};
const reducer = (state = initialState, action) => {
  // console.log(action);
  switch (action.type) {
    case actionTypes.UPDATE_USER:
      return {
        ...state,
        userData: action.updatedUser,
      };
    case actionTypes.UPDATE_DEFAULT:
      return {
        ...state,
        defaultState: action.updateDefault,
      };
    case actionTypes.GET_LOCATIONS:
      return {
        ...state,
        locations: action.locationData,
      };
    case actionTypes.UPDATE_SIDEBAR:
      return {
        ...state,
        sidebar: action.updateSidebar,
      };

    default:
      return state;
  }
};

export default reducer;
