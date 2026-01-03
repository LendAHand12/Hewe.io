export const formatVND = (price, isShowToken = true) => {
  try {
    return price.toLocaleString("en-US") + (isShowToken ? " đ" : "");
  } catch {
    return 0;
  }
};
