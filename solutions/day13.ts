import { range } from "../util/range.ts";

type Pattern = { rows: number[]; columns: number[] };

const countBitDifference = (n1: number, n2: number) => {
  let xor = n1 ^ n2;
  let count = 0;
  while (xor) {
    count += xor & 1;
    xor >>= 1;
  }
  return count;
};

const findReflection =
  (numSmudges: number) =>
  ({ rows, columns }: Pattern) => {
    const find = (ps: number[]) =>
      range(1, ps.length).find((index) => {
        let left = index - 1;
        let right = index;
        let bitDifference = 0;

        while (left >= 0 && right < ps.length && bitDifference <= numSmudges) {
          bitDifference += countBitDifference(ps[left], ps[right]);
          left -= 1;
          right += 1;
        }

        return bitDifference === numSmudges;
      });

    const rowReflection = find(rows);

    if (rowReflection) {
      return 100 * rowReflection;
    }

    const columnReflection = find(columns);
    return columnReflection ?? 0;
  };

function part1(patterns: Pattern[]) {
  const reflections = patterns.map(findReflection(0));
  return reflections.reduce((a, b) => a + b);
}

function part2(patterns: Pattern[]) {
  const reflections = patterns.map(findReflection(1));
  return reflections.reduce((a, b) => a + b);
}

export function solve() {
  const patternToNumber = (p: string) =>
    parseInt(Array.from(p, (x) => (x === "#" ? "1" : "0")).join(""), 2);
  const patterns = Deno.readTextFileSync("inputs/day13.txt")
    .split("\n\n")
    .map((pattern) => {
      const columns: string[] = [];
      const rows = pattern.split("\n").filter(Boolean);
      rows.forEach((line) =>
        Array.from(line).forEach((x, i) => {
          columns[i] = (columns[i] ?? "") + x;
        })
      );

      const rowValues = rows.map(patternToNumber);
      const columnValues = columns.map(patternToNumber);

      return { rows: rowValues, columns: columnValues };
    });

  return `Part 1: ${part1(patterns)}\nPart 2: ${part2(patterns)}`;
}
