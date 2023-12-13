import { range } from "../util/range.ts";

type Pattern = { rows: string[], columns: string[] }

function findReflection({rows, columns}: Pattern) {
  const find = (ps: string[]) => range(1, ps.length).find((index) => {
    let left = index - 1;
    let right = index;
    
    while (left >= 0 && right < ps.length) {
      if (ps[left] !== ps[right]) {
        return false;
      }
      left -= 1;
      right += 1;
    }

    return true;
  })

  const rowReflection = find(rows);

  if (rowReflection) {
    return 100 * rowReflection;
  }

  const columnReflection = find(columns);
  return columnReflection ?? 0;
}

function part1(patterns: Pattern[]) {
  const reflections = patterns.map(findReflection);
  console.log({reflections});
  
  return reflections.reduce((a, b) => a + b)
  
}

function part2() {}

export function solve() {
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
      return { rows, columns };
    });

  console.log({ patterns });

  return `Part 1: ${part1(patterns)}\nPart 2: ${part2()}`;
}
