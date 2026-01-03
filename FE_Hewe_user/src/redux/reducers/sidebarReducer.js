let defaultState;

if (window.innerWidth < 576) {
  defaultState = {
    showSidebar: false,
    sidebarContent: [],
  };
} else {
  defaultState = {
    showSidebar: true,
    sidebarContent: [],
  };
}

export const sidebarReducer = (state = defaultState, action) => {
  switch (action.type) {
    case "TOGGLE_SIDEBAR": {
      return {
        ...state,
        showSidebar: !state.showSidebar,
      };
    }
    case "SIDEBAR_CONTENT": {
      return {
        ...state,
        sidebarContent: action.payload,
      };
    }
    default:
      return state;
  }
};
