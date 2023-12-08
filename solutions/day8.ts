import { lcm } from "../util/lcm.ts";

type Connection = { left: string; right: string };
type Network = Map<string, Connection>;

function part1(getLeftOrRight: (step: number) => string, network: Network) {
  let step = 0;
  let current = "AAA";

  while (current !== "ZZZ") {
    const instruction = getLeftOrRight(step);
    const connection = network.get(current);

    if (!connection) {
      throw new Error(`Node ${current} not found`);
    }

    if (instruction === "L") {
      current = connection.left;
    } else {
      current = connection.right;
    }

    step += 1;
  }

  return step;
}

function part2(getLeftOrRight: (step: number) => string, network: Network) {
  const findStartingNodes = () =>
    Array.from(network.keys()).filter((node) => node.endsWith("A"));

  const startingNodes = findStartingNodes();

  const stepsUntilEnd = startingNodes.map((node) => {
    let current = node;
    let step = 0;

    while (!current.endsWith("Z")) {
      const instruction = getLeftOrRight(step);
      const connection = network.get(current);
      if (!connection) {
        throw new Error(`Node ${current} not found`);
      }

      if (instruction === "L") {
        current = connection.left;
      } else {
        current = connection.right;
      }

      step += 1;
    }

    return step;
  });

  return lcm(stepsUntilEnd);
}

export function solve() {
  const [leftRightText, networkText] =
    Deno.readTextFileSync("inputs/day8.txt").split("\n\n");
  const getLeftOrRight = (step: number): string => {
    const index = step % leftRightText.length;

    if (leftRightText[index]) {
      return leftRightText[index];
    }

    throw new Error(`No Instruction Found at Step ${step}, Index ${index}`);
  };
  const network = new Map(
    networkText
      .split("\n")
      .filter(Boolean)
      .map((nodeText) => {
        const [node, connectionsText] = nodeText.split(" = ");
        const [left, right] = connectionsText.replace(/\(|\)/g, "").split(", ");
        return [node, { left, right }];
      })
  );

  return `Part 1: ${part1(getLeftOrRight, network)}\nPart 2: ${part2(
    getLeftOrRight,
    network
  )}`;
}
