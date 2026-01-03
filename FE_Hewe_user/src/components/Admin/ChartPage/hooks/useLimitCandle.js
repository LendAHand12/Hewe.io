import { useState } from "react";

export const useLimitCandle = (initialCandle = 1000) => {
  const [limitCandle, setLimitCandle] = useState(initialCandle);

  const handleChangeLimitCandle = (num) => {
    setLimitCandle(num);
  };

  return { limitCandle, handleChangeLimitCandle };
};
