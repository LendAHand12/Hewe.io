import { useRef, useState } from "react";
import { useSearchDebounce } from "./useSearchDebounce";

export const useSearch = ({ initialValue = "", delay = 500, callbackFn }) => {
  const isSearchMode = useRef(false);
  const [inputValue, setInputValue] = useState(initialValue);
  const debounceValue = useSearchDebounce(
    inputValue,
    isSearchMode,
    callbackFn,
    delay
  );

  const handleSearch = (e) => {
    setInputValue(e.target.value);
    isSearchMode.current = true;
  };

  return { inputValue, debounceValue, handleSearch };
};
