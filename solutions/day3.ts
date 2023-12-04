const getAdjacentCoordinates = (x: number, y: number) => [
  { x: x - 1, y },
  { x: x - 1, y: y - 1 },
  { x, y: y - 1 },
  { x: x + 1, y: y - 1 },
  { x: x + 1, y },
  { x: x + 1, y: y + 1 },
  { x, y: y + 1 },
  { x: x - 1, y: y + 1 },
];

const getNumberCoordinates = (number: { n: string; x: number; y: number }) => {
  const coords = [];

  for (let index = 0; index < number.n.length; index++) {
    coords.push({ x: number.x + index, y: number.y });
  }

  return coords;
};

const isNumberAdjacentToSymbol =
  (symbols: Map<string, string>) =>
  (number: { n: string; x: number; y: number }) => {
    const isCoordinateAdjacentToSymbol = ({ x, y }: { x: number; y: number }) =>
      getAdjacentCoordinates(x, y).some((c) => symbols.has(`${c.x},${c.y}`));

    return getNumberCoordinates(number).some(isCoordinateAdjacentToSymbol);
  };

function part1(
  symbols: Map<string, string>,
  numbers: Array<{ n: string; x: number; y: number }>
) {
  const engineParts = numbers
    .filter(isNumberAdjacentToSymbol(symbols))
    .map((number) => Number(number.n));

  return engineParts.reduce((a, b) => a + b);
}

function part2(
  symbols: Map<string, string>,
  numbers: Array<{ n: string; x: number; y: number }>
) {
  const gearSymbols = new Map(
    Array.from(symbols.entries()).filter(([, symbol]) => symbol === "*")
  );

  const coordinateToNumber = new Map();

  numbers.forEach((number) => {
    const coordinates = getNumberCoordinates(number);
    const startingCoordinate = coordinates[0];
    const start = `${startingCoordinate.x},${startingCoordinate.y}`;
    coordinates.forEach((c) => {
      coordinateToNumber.set(`${c.x},${c.y}`, {
        number: Number(number.n),
        start,
      });
    });
  });

  let gearRatio = 0;

  Array.from(gearSymbols.keys()).forEach((coord) => {
    const [x, y] = coord.split(",");
    const adjacentCoordinates = getAdjacentCoordinates(Number(x), Number(y));
    const adjacentNumbers = new Map(
      adjacentCoordinates
        .map((c) => coordinateToNumber.get(`${c.x},${c.y}`))
        .filter(Boolean)
        .map((n) => [n.start, n.number])
    );

    if (adjacentNumbers.size === 2) {
      gearRatio += Array.from(adjacentNumbers.values()).reduce((a, b) => a * b);
    }
  });

  return gearRatio;
}

const symbolRegExp = /[^\.\d]/g;

export function solve() {
  const lines = Deno.readTextFileSync("inputs/day3.txt").split("\n");

  const symbols = new Map();
  const numbers: { n: string; x: number; y: number }[] = [];

  lines.forEach((line, verticalIndex) => {
    const lineSymbols = Array.from(line.matchAll(symbolRegExp));

    lineSymbols.forEach((match) => {
      symbols.set(`${match.index},${verticalIndex}`, match[0]);
    });

    const lineNumbers = Array.from(line.matchAll(/\d+/g)).map((n) => ({
      n: n[0],
      x: n.index ?? Number.NaN,
      y: verticalIndex,
    }));
    numbers.push(...lineNumbers);
  });

  return `Part 1: ${part1(symbols, numbers)}\nPart 2: ${part2(
    symbols,
    numbers
  )}`;
}
