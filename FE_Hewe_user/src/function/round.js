export const roundDisplay = (value) => {
  if (Number.isInteger(value)) {
    return Number(value).toLocaleString("en-US").replaceAll(",", " ");
  } else
    return Number(value)
      .toLocaleString("en-US", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      })
      .replaceAll(",", " ");
};
