function hash(s: string) {
  let value = 0;

  for (const c of s) {
    const code = c.charCodeAt(0);
    value += code;
    value *= 17;
    value %= 256;
  }

  return value;
}

function part1(steps: string[]) {
  return steps.map(hash).reduce((a, b) => a + b);
}

function part2(stepStrings: string[]) {
  const lensesMap: Map<number, { label: string; lens: number }[]> = new Map();

  const steps = stepStrings.map((s) => {
    let label;
    let operation;

    if (s.includes("=")) {
      const split = s.split("=");
      label = split[0];
      operation = { type: "add", lens: Number(split[1]) };
    } else {
      label = s.replace("-", "");
      operation = { type: "remove" };
    }

    return { label, operation, box: hash(label) };
  });

  for (const { label, operation, box } of steps) {
    const lenses = lensesMap.get(box);
    if (operation.type === "add") {
      const { lens } = operation;

      if (!lens) {
        throw new Error("No lens found on add operation");
      }

      if (!lenses) {
        lensesMap.set(box, [{ label, lens }]);
        continue;
      }

      const oldLens = lenses.find((l) => l.label === label);

      if (oldLens) {
        oldLens.lens = lens;
      } else {
        lenses.push({ label, lens });
      }
    } else if (operation.type === "remove") {
      if (lenses) {
        lensesMap.set(
          box,
          lenses.filter((l) => l.label !== label)
        );
      }
    } else {
      throw new Error(`Invalid Operation ${operation}`);
    }
  }

  let total = 0;
  for (const [box, lenses] of lensesMap.entries()) {
    total += lenses.map(({lens}, index) => (box + 1) * (index + 1) * lens).reduce((a, b) => a + b, 0)
  }
  return total;
}

export function solve() {
  const steps = Deno.readTextFileSync("inputs/day15.txt")
    .replace("\n", "")
    .split(",");

  return `Part 1: ${part1(steps)}\nPart 2: ${part2(steps)}`;
}
