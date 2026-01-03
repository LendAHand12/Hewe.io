import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import reduxThunk from "redux-thunk";
import { sidebarReducer } from "./reducers/sidebarReducer";
import { userReducer } from "./reducers/userReducer";
import { walletReducer } from "./reducers/walletReducer";
import { chartReducer } from "./reducers/chartReducer";

const rootReducer = combineReducers({
  sidebarReducer,
  userReducer,
  walletReducer,
  chartReducer,
});

const middleWare = applyMiddleware(reduxThunk);
const composeCustom = compose(middleWare);

const store = createStore(rootReducer, composeCustom);

export default store;
