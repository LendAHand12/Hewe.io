import { BN } from "bn.js";

export function convertBN(value) {
  return Number(new BN(value));
}
