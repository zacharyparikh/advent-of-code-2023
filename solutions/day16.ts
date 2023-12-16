type Beam = { row: number; col: number; dir: "up" | "right" | "down" | "left" };

const getEnergizedKey = (beam: Beam) => `${beam.row},${beam.col}`;
const getBeamKey = (beam: Beam) => JSON.stringify(beam);

const getMove = (grid: string[][]) => {
  const maxCol = grid[0].length - 1;
  const maxRow = grid.length - 1;

  return (beam: Beam): Beam[] => {
    const cell = grid[beam.row][beam.col];
    if (!cell) {
      throw new Error(`Beam ${beam} Invalid`);
    }

    if (cell === "-" && (beam.dir === "up" || beam.dir === "down")) {
      return [
        { ...beam, dir: "left" },
        { ...beam, dir: "right" },
      ];
    }

    if (cell === "|" && (beam.dir === "right" || beam.dir === "left")) {
      return [
        { ...beam, dir: "up" },
        { ...beam, dir: "down" },
      ];
    }

    if (beam.dir === "up") {
      if (cell === "." || cell === "|") {
        return [{ ...beam, row: Math.max(beam.row - 1, 0) }];
      } else if (cell === "\\") {
        return [{ ...beam, dir: "left", col: Math.max(beam.col - 1, 0) }];
      } else if (cell === "/") {
        return [{ ...beam, dir: "right", col: Math.min(beam.col + 1, maxCol) }];
      }
    }

    if (beam.dir === "right") {
      if (cell === "." || cell === "-") {
        return [{ ...beam, col: Math.min(beam.col + 1, maxCol) }];
      } else if (cell === "\\") {
        return [{ ...beam, dir: "down", row: Math.min(beam.row + 1, maxRow) }];
      } else if (cell === "/") {
        return [{ ...beam, dir: "up", row: Math.max(beam.row - 1, 0) }];
      }
    }

    if (beam.dir === "down") {
      if (cell === "." || cell === "|") {
        return [{ ...beam, row: Math.min(beam.row + 1, maxRow) }];
      } else if (cell === "\\") {
        return [{ ...beam, dir: "right", col: Math.min(beam.col + 1, maxCol) }];
      } else if (cell === "/") {
        return [{ ...beam, dir: "left", col: Math.max(beam.col - 1, 0) }];
      }
    }

    if (beam.dir === "left") {
      if (cell === "." || cell === "-") {
        return [{ ...beam, col: Math.max(beam.col - 1, 0) }];
      } else if (cell === "\\") {
        return [{ ...beam, dir: "up", row: Math.max(beam.row - 1, 0) }];
      } else if (cell === "/") {
        return [{ ...beam, dir: "down", row: Math.min(beam.row + 1, maxRow) }];
      }
    }

    throw new Error(`Beam ${beam}, Cell ${cell} Invalid`);
  };
};

function energize(start: Beam, grid: string[][]) {
  const energized: Map<string, Set<string>> = new Map();
  let activeBeams: Map<string, Beam> = new Map();
  energized.set(getEnergizedKey(start), new Set([start.dir]));
  activeBeams.set(getBeamKey(start), start);
  const move = getMove(grid);

  while (activeBeams.size > 0) {
    const nextActiveBeams: Map<string, Beam> = new Map();
    for (const [key, beam] of activeBeams) {
      const nextBeams = move(beam);

      for (const nextBeam of nextBeams) {
        const nextKey = getBeamKey(nextBeam);

        if (key === nextKey) {
          continue;
        }

        const energizedKey = getEnergizedKey(nextBeam);
        const energizedEntry = energized.get(energizedKey);

        if (!energizedEntry || !energizedEntry.has(nextBeam.dir)) {
          nextActiveBeams.set(nextKey, nextBeam);
        }

        energized.set(
          energizedKey,
          energizedEntry?.add(nextBeam.dir) ?? new Set([nextBeam.dir])
        );
      }
    }

    activeBeams = nextActiveBeams;
  }

  return energized.size;
}

function part1(grid: string[][]) {
  const start: Beam = { row: 0, col: 0, dir: "right" };
  return energize(start, grid);
}

function part2(grid: string[][]) {
  const numRows = grid.length;
  const numCols = grid[0].length;

  const starts: Beam[] = [];

  for (let i = 0; i < numRows; i++) {
    starts.push(
      { row: i, col: 0, dir: "right" },
      { row: i, col: numCols - 1, dir: "left" }
    );
  }

  for (let i = 0; i < numCols; i++) {
    starts.push(
      { col: i, row: 0, dir: "down" },
      { col: i, row: numRows - 1, dir: "up" }
    );
  }

  return Math.max(...starts.map((beam) => energize(beam, grid)))
  
}

export function solve() {
  const grid = Deno.readTextFileSync("inputs/day16.txt")
    .split("\n")
    .filter(Boolean)
    .map((row) => row.split(""));

  return `Part 1: ${part1(grid)}\nPart 2: ${part2(grid)}`;
}
