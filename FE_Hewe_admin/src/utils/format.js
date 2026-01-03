export const formatHewe = (n) => {
  return Number(n).toLocaleString("en-EN");
};

export const convertTimeCreateAt = (input) => {
  const date = new Date(input);
  return date.toLocaleString("vi-VN");
};
