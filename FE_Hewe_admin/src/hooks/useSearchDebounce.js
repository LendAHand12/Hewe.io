import { useEffect, useState } from "react";

export const useSearchDebounce = (
  inputValue,
  isSearchMode,
  callbackFn,
  delay = 500
) => {
  const [debounceValue, setDebounceValue] = useState(inputValue);

  useEffect(() => {
    const debounceSearch = setTimeout(() => {
      // Case change to page 1 when search
      if (isSearchMode.current) {
        if (typeof callbackFn === "function") {
          isSearchMode.current = false;
          console.log("0");
          callbackFn();
        }

        console.log("1");
        setDebounceValue(inputValue);
      }
    }, delay);

    return () => {
      clearTimeout(debounceSearch);
    };
  });

  return debounceValue;
};
