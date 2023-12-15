const cycle = ["north", "west", "south", "east"] as const;
type Direction = (typeof cycle)[number];

const columnsToGrid = (columns: string[]) => {
  const grid: string[][] = [];

  columns.forEach((column) => {
    Array.from(column).forEach((c, i) => {
      if (grid[i]) {
        grid[i].push(c);
      } else {
        grid[i] = [c];
      }
    });
  });

  return grid;
};

const getColumns = (grid: string[][]) => {
  const columns: string[] = [];

  grid.forEach((row) => {
    row.forEach((c, i) => {
      columns[i] = (columns[i] ?? "") + c;
    });
  });

  return columns;
};

const getRows = (grid: string[][]) => grid.map((row) => row.join(""));
const rowsToGrid = (rows: string[]) => rows.map((row) => Array.from(row));

const tiltMap = new Map();

const tilt = (grid: string[][], direction: Direction) => {
  if (direction === "north" || direction === "south") {
    const columns = getColumns(grid).map((column) => {
      const key = `${direction}${column}`;

      if (tiltMap.has(key)) {
        return tiltMap.get(key);
      }

      const parts = column.split("#");
      const tilted = parts
        .map((part) => {
          const length = part.length;
          const stones = part.replaceAll(".", "");
          if (direction === "north") {
            return stones.padEnd(length, ".");
          } else {
            return stones.padStart(length, ".");
          }
        })
        .join("#");

      tiltMap.set(key, tilted);
      return tilted;
    });

    return columnsToGrid(columns);
  }

  const rows = getRows(grid).map((row) => {
    const key = `${direction}${row}`;

    if (tiltMap.has(key)) {
      return tiltMap.get(key);
    }

    const parts = row.split("#");
    const tilted = parts
      .map((part) => {
        const length = part.length;
        const stones = part.replaceAll(".", "");
        if (direction === "west") {
          return stones.padEnd(length, ".");
        } else {
          return stones.padStart(length, ".");
        }
      })
      .join("#");

    tiltMap.set(key, tilted);
    return tilted;
  });

  return rowsToGrid(rows);
};

function part1(grid: string[][]) {
  const tilted = tilt(grid, "north");
  const columns = getColumns(tilted);

  return columns
    .flatMap((column) =>
      Array.from(column).map((c, i) => (c !== "O" ? 0 : column.length - i))
    )
    .reduce((a, b) => a + b);
}

function part2(grid: string[][]) {
  let tilted = grid;

  const start = performance.now()
  for (let step = 0; step < 1_000_000_000; step++) {
    for (const direction of cycle) {
      tilted = tilt(tilted, direction);
    }
    console.log({ step, time: performance.now() - start });
    
  }

  const columns = getColumns(tilted);

  return columns
    .flatMap((column) =>
      Array.from(column).map((c, i) => (c !== "O" ? 0 : column.length - i))
    )
    .reduce((a, b) => a + b);
}

export function solve() {
  const grid: string[][] = Deno.readTextFileSync("inputs/day14.txt")
    .split("\n")
    .filter(Boolean)
    .map((line) => Array.from(line));

  return `Part 1: ${part1(grid)}\nPart 2: ${part2(grid)}`;
}
