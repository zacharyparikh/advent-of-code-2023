import { range } from "../util/range.ts";

type Card = { key: number; winningNumbers: number[]; hadNumbers: number[] };

const countWinningNumbersHad = (card: Card) => {
  const winningSet = new Set(card.winningNumbers);
  return card.hadNumbers.filter((n) => winningSet.has(n)).length;
};

function part1(cards: Card[]) {
  const calculatePoints = (card: Card) => {
    const numWinning = countWinningNumbersHad(card);
    return numWinning ? 2 ** (numWinning - 1) : 0;
  };

  const points = cards.map(calculatePoints);
  return points.reduce((a, b) => a + b);
}

function part2(cards: Card[]) {
  const copies = new Map();

  const addCopies = (card: Card) => {
    const numWinning = countWinningNumbersHad(card);

    if (numWinning === 0) {
      return;
    }

    const numCopies = (copies.get(card.key) ?? 0) + 1;

    range(card.key + 1, card.key + 1 + numWinning).forEach((key) => {
      const currentCopies = copies.get(key);
      copies.set(key, (currentCopies ?? 0) + numCopies);
    });
  };

  cards.forEach(addCopies);

  return Array.from(copies.values()).reduce((a, b) => a + b) + cards.length;
}

export function solve() {
  const lines = Deno.readTextFileSync("inputs/day4.txt")
    .split("\n")
    .filter(Boolean);
  const cards = lines.map((line) => {
    const [cardString, numbersString] = line.split(": ");
    const key = Number(cardString.replace("Card ", ""));
    const [winningNumbersString, hadNumbersString] =
      numbersString.split(/\s+\|\s+/);

    return {
      key,
      winningNumbers: winningNumbersString.split(/\s+/).map(Number),
      hadNumbers: hadNumbersString.split(/\s+/).map(Number),
    };
  });

  return `Part 1: ${part1(cards)}\nPart 2: ${part2(cards)}`;
}
