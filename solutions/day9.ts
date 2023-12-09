import { pairs } from "../util/pairs.ts";


function part1(histories: number[][]) {

  const extrapolateValue = (values: number[]): number => {

    if (values.every((v) => v === 0)) {
      return 0;
    }

    const lastValue = values.at(-1);

    if (lastValue === undefined || values.length < 2) {
      throw new Error("No values found to extrapolate from");
    }

    const differences = pairs(values).map(([v1, v2]) => v2 - v1);
    return lastValue + extrapolateValue(differences)
  }

  const nextValues = histories.map(extrapolateValue);
  return nextValues.reduce((a, b) => a + b);
}

function part2(histories: number[][]) {

  const extrapolateValue = (values: number[]): number => {

    if (values.every((v) => v === 0)) {
      return 0;
    }

    const firstValue = values.at(0);
    
    if (firstValue === undefined || values.length < 2) {
      throw new Error("No values found to extrapolate from");
    }

    const differences = pairs(values).map(([v1, v2]) => v2 - v1);
    return firstValue - extrapolateValue(differences)
  }

  const nextValues = histories.map(extrapolateValue);

  return nextValues.reduce((a, b) => a + b);
}

export function solve() {
  const histories = Deno.readTextFileSync("inputs/day9.txt").split("\n").filter(Boolean).map((line) => line.split(" ").map(Number))

  return `Part 1: ${part1(histories)}\nPart 2: ${part2(histories)}`;
  
}
