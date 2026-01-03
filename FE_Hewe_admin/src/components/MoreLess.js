import React, { useEffect, useState } from "react";
import { ContentDiv } from "../pages/BlogManagement/BlogElements";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  widthFull: {
    width: "600px",
  },
}));
const MoreLess = ({ desc, showmore }) => {
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    if (!showmore) {
      setShowMore(false);
    }
  }, [showmore]);

  function removeTags(str) {
    if (!str) return "";
    else str = str.toString();

    // Regular expression to identify HTML tags in
    // the input string. Replacing the identified
    // HTML tag with a null string.
    return str.replace(/(<([^>]+)>)/gi, "");
  }

  return (
    <ContentDiv>
      {showMore ? removeTags(desc) : `${removeTags(desc).substring(0, 40)}...`}{" "}
      <span
        style={{ color: "blue", cursor: "pointer", fontSize: "0.8rem" }}
        onClick={() => setShowMore(!showMore)}
      >
        {showMore ? "show less" : "show more"}
      </span>
    </ContentDiv>
  );
};

export default MoreLess;
