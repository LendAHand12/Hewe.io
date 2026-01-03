const getListPackage = () => {
  return [
    {
      id: 1,
      amountUSD: 25,
      amountHEWE: 40000,
      name: "A20",
    },
    {
      id: 2,
      amountUSD: 50,
      amountHEWE: 80000,
      name: "A40",
    },
    {
      id: 3,
      amountUSD: 100,
      amountHEWE: 160000,
      name: "A100",
    },
    {
      id: 4,
      amountUSD: 500,
      amountHEWE: 800000,
      name: "A500",
      isBonus: true,
      amountBonus: 40000,
    },
    {
      id: 5,
      amountUSD: 1000,
      amountHEWE: 1600000,
      name: "A1,000",
      isBonus: true,
      amountBonus: 80000,
    },
    {
      id: 6,
      amountUSD: 10000,
      amountHEWE: 16000000,
      name: "A10,000",
      isBonus: true,
      amountBonus: 1600000,
    },
  ];
};

module.exports = { getListPackage };
