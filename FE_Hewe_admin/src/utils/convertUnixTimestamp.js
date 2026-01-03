import dayjs from "dayjs";

export const convertUnitTimestamp = (timestamp) => {
  const unixTimestamp = Number(timestamp);
  const date = dayjs.unix(unixTimestamp);
  const formattedDate = date.format("HH:mm:ss DD/MM/YYYY");

  return formattedDate;
};
