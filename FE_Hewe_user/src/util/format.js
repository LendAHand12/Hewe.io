export const formatDecimal = (number, unit = "") =>
  `${Number(number).toLocaleString(["ban", "id"])}${unit ? " " + unit : ""}`;

export const formatBalanceWallet = (number) => {
  try {
    return Number(number).toFixed(2);
  } catch {
    return 0;
  }
};

export const formatCash = (n) => {
  if (n < 1e3) return n;
  if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + "K";
  if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + "M";
  if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + "B";
  if (n >= 1e12) return +(n / 1e12).toFixed(1) + "T";
};

export const format4DecimalsNumber = (n, showLog = false) => {
  try {
    showLog && console.log("RUN");
    showLog && console.log("f1", n);
    const value = Number(n);
    showLog && console.log("f1 after:", value);

    showLog && console.log("f2:", value);

    if (Number.isInteger(value)) {
      return value;
    }

    return Math.floor(10000 * value) / 10000;
  } catch (error) {
    showLog && console.log("RUN ERROR");
    showLog && console.log("e", error);
    return 0;
  }
};

export const formatBCF = (number) => {
  try {
    const parseNum = Number(number);

    if (Number.isInteger(parseNum)) {
      return parseNum;
    }

    return Math.floor(100 * parseNum) / 100;
  } catch (error) {
    return number;
  }
};

export const formatHewe = (number) => {
  try {
    const parseNum = Number(number);

    if (Number.isInteger(parseNum)) {
      return parseNum;
    }

    return Math.floor(100 * parseNum) / 100;
  } catch (error) {
    return number;
  }
};
