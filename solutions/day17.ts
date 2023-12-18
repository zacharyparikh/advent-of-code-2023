type Position = string;
type Direction = "up" | "down" | "left" | "right";

type Neighbors = { [D in Direction]?: Position };
type Node = { value: number; neighbors: Neighbors; row: number; col: number };

function oppositeDirection(direction: Direction) {
  if (direction === "up") {
    return "down";
  }

  if (direction === "down") {
    return "up";
  }

  if (direction === "left") {
    return "right";
  }

  if (direction === "right") {
    return "left";
  }

  throw new Error(`Invalid direction ${direction}`);
}

function turnDirections(direction: Direction) {
  if (direction === "up" || direction === "down") {
    return ["left", "right"];
  }

  if (direction === "left" || direction === "right") {
    return ["up", "down"];
  }

  throw new Error(`Invalid direction ${direction}`);
}

function getPath(previous: Record<string, string>, endNode: string) {
  const path = [];
  let currentNode = endNode;

  while (currentNode) {
    path.unshift(currentNode);
    currentNode = previous[currentNode];
  }

  return path;
}

function part1(graph: Map<string, Node>, start: string, end: string) {
  const nodes = new Set(graph.keys());
  const distances = { [start]: 0 };
  const previous = {};
  const getDistance = (node: string) =>
    distances[node] ?? Number.POSITIVE_INFINITY;

  const getClosestNode = () =>
    Array.from(nodes.values()).reduce((minNode, node) =>
      getDistance(node) < getDistance(minNode) ? node : minNode
    );

  while (nodes.size > 0) {
    const current = getClosestNode();
    nodes.delete(current);

    if (current === end) {
      return getPath(previous, end);
    }

    if (distances[current] === undefined) {
      break;
    }

    const node = graph.get(current);
    if (!node) {
      throw new Error(`Node ${current} not found`);
    }

    for (const [direction, neighbor] of Object.entries(node.neighbors)) {
    }
  }
}

function part2() {}

export function solve() {
  const lines = Deno.readTextFileSync("inputs/day17.test.txt")
    .split("\n")
    .filter(Boolean);

  const start = "0,0";
  const end = `${lines.length - 1},${lines[0].length - 1}`;
  const graph: Map<string, Node> = new Map(
    lines.flatMap((line, row) =>
      Array.from(line)
        .map(Number)
        .map((value, col) => {
          const neighbors: Neighbors = {};

          if (row > 0) {
            neighbors.up = `${row - 1},${col}`;
          }

          if (row < lines.length - 1) {
            neighbors.down = `${row + 1},${col}`;
          }

          if (col > 0) {
            neighbors.left = `${row},${col - 1}`;
          }

          if (col < line.length - 1) {
            neighbors.right = `${row},${col + 1}`;
          }

          return [`${row},${col}`, { value, neighbors, row, col }];
        })
    )
  );

  // graph.forEach((row) => {
  //   row.forEach((node) => {
  //     console.log(node);
  //   });
  // });

  return `Part 1: ${part1(graph, start, end)}\nPart 2: ${part2()}`;
}
