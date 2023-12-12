import { range } from "../util/range.ts";

type Record = {
  conditions: string;
  damagedLengths: number[];
};

const parseConditions = (conditionsText: string) => {
  const conditions: { condition: string; length: number }[] = [];
  let current = { condition: conditionsText[0], length: 0 };

  for (const c of conditionsText) {
    if (current.condition === c) {
      current.length += 1;
    } else {
      conditions.push(current);
      current = { condition: c, length: 1 };
    }
  }

  conditions.push(current);

  return conditions;
};

const isRecordValid = (record: Record) => {
  const conditions = parseConditions(record.conditions);

  if (conditions.filter((c) => c.condition === "?").length === 0) {
    return conditions
      .filter((c) => c.condition === "#")
      .every((c, index) => c.length === record.damagedLengths[index]);
  }

  const knownDamaged = conditions.filter((c, index) => {
    if (c.condition !== "#") {
      return false;
    }

    if (
      (conditions[index - 1] && conditions[index - 1].condition === "?") ||
      (conditions[index + 1] && conditions[index + 1].condition === "?")
    ) {
      return false;
    }

    return true;
  }).map((c) => c.length);

  const lengths = Array.from(record.damagedLengths);

  for (const l of knownDamaged) {
    const index = lengths.findIndex((length) => l === length);

    if (index < 0) {
      return false;
    }

    lengths.splice(index, 1)
  }

  return true;
};

const replaceUnknown = (record: Record, unknownDamaged: number) => {
  if (unknownDamaged === 0) {
    const conditions = Array.from(record.conditions, (c) =>
      c === "?" ? "." : c
    ).join("");
    return [{ ...record, conditions }];
  }
  const unknownIndexes: number[] = [];

  Array.from(record.conditions).forEach((c, index) => {
    if (c === "?") {
      unknownIndexes.push(index);
    }
  });

  const replacements: Record[] = unknownIndexes
    .map((index) =>
      Array.from(record.conditions, (c, i) => {
        if (i === index) {
          return "#";
        } else if (i < index && c === "?") {
          return ".";
        } else {
          return c;
        }
      }).join("")
    )
    .map((conditions) => ({
      conditions,
      damagedLengths: record.damagedLengths,
    }))
    .filter(isRecordValid)
    .flatMap((record) => replaceUnknown(record, unknownDamaged - 1))
    .filter(isRecordValid);


  return replacements;
};

function part1(records: Record[]) {
  let numArrangements = 0;
  for (const record of records) {
    const knownDamaged = Array.from(record.conditions).filter(
      (c) => c === "#"
    ).length;

    const unknownDamaged =
      record.damagedLengths.reduce((a, b) => a + b) - knownDamaged;

    const arrangements = replaceUnknown(record, unknownDamaged);
    numArrangements += arrangements.length;
  }

  return numArrangements;
}

function part2(records: Record[]) {
  const expandedRecords: Record[] = records.map((r) => ({
    conditions: range(5)
      .map(() => r.conditions)
      .join("?"),
    damagedLengths: range(5).flatMap(() => r.damagedLengths),
  }));

  let numArrangements = 0;
  for (const record of expandedRecords) {
    console.log({ numArrangements });

    const knownDamaged = Array.from(record.conditions).filter(
      (c) => c === "#"
    ).length;

    const unknownDamaged =
      record.damagedLengths.reduce((a, b) => a + b) - knownDamaged;

    const arrangements = replaceUnknown(record, unknownDamaged);
    numArrangements += arrangements.length;
  }

  return numArrangements;
}

export function solve() {
  const records = Deno.readTextFileSync("inputs/day12.test.txt")
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [conditions, damagedLengthsText] = line.split(" ");
      const damagedLengths = damagedLengthsText.split(",").map(Number);
      return { conditions, damagedLengths };
    });

  return `Part 1: ${part1(records)}\nPart 2: ${part2(records)}`;
}
