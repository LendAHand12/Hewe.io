import { useEffect, useState } from "react";

export const IconCopy = ({ onCopy }) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleCopyMiddleware = () => {
    setIsClicked(true);
    onCopy();
  };

  useEffect(() => {
    if (isClicked) {
      const timeout = setTimeout(() => {
        setIsClicked(false);
      }, 4000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [isClicked]);

  return (
    <div>
      {!isClicked && (
        <div onClick={handleCopyMiddleware} style={{ cursor: "pointer" }}>
          <i className="fa-solid fa-copy"></i>
        </div>
      )}
      {isClicked && (
        <div style={{ color: "green" }}>
          <i className="fa-solid fa-check-double"></i>
        </div>
      )}
    </div>
  );
};
