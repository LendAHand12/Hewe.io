export const convertTZtoTimeString = (inputTime) => {
  if (inputTime.toString().includes("T") && inputTime.toString().includes("Z")) {
    let d = new Date(inputTime);

    let x1 = d.getDate();
    let x2 = d.getMonth() + 1;
    let x3 = d.getFullYear();
    let x4 = d.getHours();
    let x5 = d.getMinutes();
    let x6 = d.getSeconds();

    return `${x1}/${x2}/${x3} ${x4}:${x5}:${x6}`;
  } else {
    return inputTime;
  }
};
