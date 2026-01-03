export const configStyle = (currentStyle) => {
  const newStyle = {
    ...currentStyle,
    grid: {
      ...currentStyle.grid,
      horizontal: {
        ...currentStyle.grid.horizontal,
        color: "#ffffff10",
        style: "solid",
      },
      vertical: {
        ...currentStyle.grid.vertical,
        color: "#ffffff10",
        style: "solid",
      },
    },
    bar: {
      ...currentStyle.bar,
      upColor: "#2ebd85",
      upBorderColor: "#2ebd85",
      upWickColor: "#2ebd85",
      downColor: "#f6465d",
      downBorderColor: "#f6465d",
      downWickColor: "#f6465d",
    },
    xAxis: {
      ...currentStyle.xAxis,
      axisLine: {
        ...currentStyle.xAxis.axisLine,
        color: "#494949",
      },
      tickLine: {
        ...currentStyle.xAxis.tickLine,
        color: "#494949",
      },
      tickText: {
        ...currentStyle.xAxis.tickText,
        color: "#aaaaaa",
      },
    },
    yAxis: {
      ...currentStyle.yAxis,
      axisLine: {
        ...currentStyle.yAxis.axisLine,
        color: "#494949",
      },
      tickLine: {
        ...currentStyle.yAxis.tickLine,
        color: "#494949",
      },
      tickText: {
        ...currentStyle.yAxis.tickText,
        color: "#aaaaaa",
      },
    },
    candle: {
      ...currentStyle.candle,
      tooltip: {
        ...currentStyle.candle.tooltip,
        text: {
          ...currentStyle.candle.tooltip.text,
          color: "#aaaaaa",
        },
      },
    },
  };

  return newStyle;
};
