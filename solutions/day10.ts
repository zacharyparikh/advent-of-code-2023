type Direction = "north" | "east" | "south" | "west";

const pipeTypes: Record<string, [Direction, Direction]> = {
  "|": ["north", "south"],
  "-": ["east", "west"],
  L: ["north", "east"],
  J: ["north", "west"],
  "7": ["south", "west"],
  F: ["south", "east"],
};

type Position = { rowIndex: number; columnIndex: number };

function calculateNextPosition(
  position: Position,
  direction: Direction
): Position {
  if (direction === "north") {
    return { ...position, rowIndex: position.rowIndex - 1 };
  }

  if (direction === "south") {
    return { ...position, rowIndex: position.rowIndex + 1 };
  }

  if (direction === "west") {
    return { ...position, columnIndex: position.columnIndex - 1 };
  }

  if (direction === "east") {
    return { ...position, columnIndex: position.columnIndex + 1 };
  }

  throw new Error(`Direction ${direction} invalid`);
}

function oppositeDirection(direction: Direction): Direction {
  if (direction === "north") {
    return "south";
  }

  if (direction === "south") {
    return "north";
  }

  if (direction === "west") {
    return "east";
  }

  if (direction === "east") {
    return "west";
  }

  throw new Error(`Direction ${direction} invalid`);
}

const getFindConnection = (grid: string[][]) => (position: Position, direction: Direction) => {
  const nextPosition = calculateNextPosition(position, direction);
  const cell = grid[nextPosition.rowIndex][nextPosition.columnIndex];
  const directions = pipeTypes[cell];

  if (!directions) {
    return null;
  }

  const toDirection = oppositeDirection(direction);

  if (!directions.includes(toDirection)) {
    return null;
  }

  const nextDirection = directions.find((d) => d !== toDirection);

  if (!nextDirection) {
    throw new Error("Could not calculate next direction");
  }

  return { position: nextPosition, direction: nextDirection };
};

function part1(grid: string[][], startPosition: Position) {

  const findConnection = getFindConnection(grid);
  const directions: Direction[] = ["north", "south", "east", "west"];
  const connections = directions
    .map((direction) => findConnection(startPosition, direction))
    .filter(Boolean);

  if (!connections[0] || !connections[1]) {
    throw new Error("Did not find two connections at start");
  }

  let [cell1, cell2] = connections;
  let step = 1;

  while (
    cell1.position.rowIndex !== cell2.position.rowIndex ||
    cell1.position.columnIndex !== cell2.position.columnIndex
  ) {
    const next1 = findConnection(cell1.position, cell1.direction);
    const next2 = findConnection(cell2.position, cell2.direction);

    if (!next1 || !next2) {
      throw new Error(`Could not find connections for ${JSON.stringify(cell1)}, ${JSON.stringify(cell2)}`);
    }

    cell1 = next1;
    cell2 = next2;

    step += 1;
  }

  return step;
}

function part2(grid: string[][], startPosition: Position) {
  const getLoop = () => {
    const findConnection = getFindConnection(grid);
    const loop = [startPosition]
    const directions: Direction[] = ["north", "south", "east", "west"];
    const connections = directions
      .map((direction) => findConnection(startPosition, direction))
      .filter(Boolean);
  
    let current = connections[0];
  
    while (current) {
      loop.push(current.position);
      current = findConnection(current.position, current.direction);
    }

    return loop;
  }

  const enclosed = new Set();
  const loop = getLoop();

  loop.forEach((position) => {
    
  })
}

export function solve() {
  let startPosition: { rowIndex: number; columnIndex: number } | null = null;

  const grid = Deno.readTextFileSync("inputs/day10.test.txt")
    .split("\n")
    .filter(Boolean)
    .map((row, rowIndex) => {
      const cells = Array.from(row);
      const columnIndex = cells.findIndex((c) => c === "S");

      if (columnIndex >= 0) {
        startPosition = { rowIndex, columnIndex };
      }

      return cells;
    });

  if (!startPosition) {
    throw new Error("No Start Position Found");
  }

  return `Part 1: ${part1(grid, startPosition)}\nPart 2: ${part2(grid, startPosition)}`;
}
