import { useLocation } from "react-router-dom";

export const useSearchParams = () => {
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  return searchParams.get("e") || "";
};
