function part1() {}

function part2() {}

const isSymbol = (s: string) => /[^\.\d]/.test(s);

export function solve() {
  const text = Deno.readTextFileSync("inputs/day3.txt");
  return `Part 1: ${part1()}\nPart 2: ${part2()}`;
}
