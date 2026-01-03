import React from 'react'

const Nodata = ({ backgroundColor = "#fff",
backgroundImage = "",
fontSize = "16px",
color = "black",
TextToDisplay = "No Data Found",
width = "100%",
height = "50vh",
Loading = false,}) => {
  return (
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
  )
}

export default Nodata