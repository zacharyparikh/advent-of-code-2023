import { gcd } from "./gcm.ts";

  export const lcm = (ns: number[]) => ns.reduce((a, b) => (a * b) / gcd(b, a));
