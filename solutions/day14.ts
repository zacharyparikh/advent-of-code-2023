const tiltColumnNorth = (column: string) => {
  const parts = column.split("#");
  return parts
    .map((part) => {
      const length = part.length;
      const stones = part.replaceAll(".", "");
      return stones.padEnd(length, ".");
    })
    .join("#");
};

function part1(columns: string[]) {
  const tilted = columns.map(tiltColumnNorth);

  return tilted
    .flatMap((column) =>
      Array.from(column).map((c, i) => (c !== "O" ? 0 : column.length - i))
    )
    .reduce((a, b) => a + b);
}

function part2() {}

export function solve() {
  const lines = Deno.readTextFileSync("inputs/day14.txt")
    .split("\n")
    .filter(Boolean);

  const columns: string[] = [];

  lines.forEach((line) => {
    Array.from(line).forEach((c, i) => {
      columns[i] = (columns[i] ?? "") + c;
    });
  });

  return `Part 1: ${part1(columns)}\nPart 2: ${part2()}`;
}
