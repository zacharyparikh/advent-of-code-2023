function part1(text: string) {
  const calibrationValue = text
    .split("\n")
    .map((line) => line.replace(/\D/g, ""))
    .map((numbers) => Number(`${numbers.at(0)}${numbers.at(-1)}`))
    .filter((n) => !Number.isNaN(n))
    .reduce((a, b) => a + b);

  return calibrationValue;
}

function part2(text: string) {
  const digitReplacements: { [digit: string]: string } = {
    one: "1",
    two: "2",
    three: "3",
    four: "4",
    five: "5",
    six: "6",
    seven: "7",
    eight: "8",
    nine: "9",
  };

  const getNumbers = (str: string) => {
    const digitRegExp =
      /(?=(\d|one|two|three|four|five|six|seven|eight|nine))/g;
    const matches = Array.from(str.matchAll(digitRegExp), (m) => m[1]);

    if (!matches) {
      return [];
    }

    return matches.map((m) => {
      const num = Number(m);
      return Number.isNaN(num) ? digitReplacements[m] : m;
    });
  };

  const calibrationValue = text
    .split("\n")
    .map(getNumbers)
    .map((numbers) => Number(`${numbers.at(0)}${numbers.at(-1)}`))
    .filter((n) => !Number.isNaN(n))
    .reduce((a, b) => a + b);

  return calibrationValue;
}

export function solve() {
  const text = Deno.readTextFileSync("inputs/day1.txt");
  return `Part 1: ${part1(text)}\nPart 2: ${part2(text)}`;
}
