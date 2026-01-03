import { useDispatch } from "react-redux";
import { getProfileAPI } from "../services/userService";

export const useProfile = () => {
  const dispatch = useDispatch();

  const handleGetProfile = async () => {
    try {
      const res = await getProfileAPI();

      dispatch({ type: "SET_PROFILE", payload: res.data.data });
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  };

  return { handleGetProfile };
};
