import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
const NoDataFound = ({
  backgroundColor = "#fff",
  backgroundImage = "",
  fontSize = "16px",
  color = "black",
  TextToDisplay = "No Data Found",
  width = "100%",
  height = "50vh",
  Loading = false,
}) => {
  return (
    <>
      {Loading ? (
        <div
          style={{
            width: width,
            height: height,
            backgroundColor: backgroundColor,
            backgroundImage: backgroundImage,
            // fontSize: fontSize,
            // fontWeight: "bold",
            // color: color,
            // display: "flex",
            // justifyContent: "center",
            // alignItems: "center",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          <Skeleton baseColor="#f5f5f5" highlightColor="#fff" count={15} height="24px" width="100%" />
        </div>
      ) : (
        <div
          style={{
            width: width,
            height: height,
            backgroundColor: backgroundColor,
            backgroundImage: backgroundImage,
            fontSize: fontSize,
            fontWeight: "bold",
            color: color,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {TextToDisplay}
        </div>
      )}
    </>
  );
};

export default NoDataFound;
