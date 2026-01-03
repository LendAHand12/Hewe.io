function numberToHex(number) {
  return "0x" + number.toString(16).padStart(2, "0");
}

export const amcCustomChain = {
  id: numberToHex(999999), // '0x89'
  name: "AmChain",
  nativeCurrency: { name: "AMC", symbol: "AMC", decimals: 18 },
  rpcUrls: ["https://node1.amchain.net"],
  blockExplorerUrls: ["https://explorer.amchain.net/"],
};
