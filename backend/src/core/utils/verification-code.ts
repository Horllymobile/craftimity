import { randomInt } from "crypto";

export function generateVerifcationCode(length: number) {
  let codes = "";
  for (let i = 1; i <= length; i++) {
    codes += randomInt(length);
  }
  return codes;
}
