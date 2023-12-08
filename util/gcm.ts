export const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
