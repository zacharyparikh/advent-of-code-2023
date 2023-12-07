const cardTypes = Object.freeze({
  FIVE_KIND: "Five Of A Kind",
  FOUR_KIND: "Four Of A Kind",
  FULL_HOUSE: "Full House",
  THREE_KIND: "Three Of A Kind",
  TWO_PAIR: "Two Pair",
  ONE_PAIR: "One Pair",
  HIGH_CARD: "High Card",
});
type Type = (typeof cardTypes)[keyof typeof cardTypes];
type Hand = { hand: string; bid: number; type: Type };

const sortHands = (hands: Hand[], cardValues: Record<string, number>) => {
  const compareHands = (hand1: Hand, hand2: Hand): number => {
    const value1 = cardValues[hand1.hand[0]];
    const value2 = cardValues[hand2.hand[0]];

    if (!value1 || !value2) {
      return 0;
    }

    if (value1 === value2) {
      return compareHands(
        { ...hand1, hand: hand1.hand.slice(1) },
        { ...hand2, hand: hand2.hand.slice(1) }
      );
    }

    return value2 - value1;
  };

  const byType = groupByType(hands);
  return Object.values(byType).flatMap((hands) => hands.toSorted(compareHands));
};

const groupByType = (hands: Hand[]) => {
  const initialValue: Record<Type, Hand[]> = {
    [cardTypes.FIVE_KIND]: [],
    [cardTypes.FOUR_KIND]: [],
    [cardTypes.FULL_HOUSE]: [],
    [cardTypes.THREE_KIND]: [],
    [cardTypes.TWO_PAIR]: [],
    [cardTypes.ONE_PAIR]: [],
    [cardTypes.HIGH_CARD]: [],
  };

  const byType = hands.reduce((acc, h) => {
    acc[h.type].push(h);
    return acc;
  }, initialValue);

  return byType;
};

function part1(handsWithoutTypes: Omit<Hand, "type">[]) {
  const getHandType = (hand: string): Type => {
    const cardMap = new Map();

    // Count card labels
    for (const card of hand) {
      cardMap.set(card, (cardMap.get(card) ?? 0) + 1);
    }

    const counts = Array.from(cardMap.values());

    if (counts.length === 1) {
      return cardTypes.FIVE_KIND;
    }

    if (counts.some((c) => c === 4)) {
      return cardTypes.FOUR_KIND;
    }

    if (counts.some((c) => c === 3)) {
      return counts.length === 2 ? cardTypes.FULL_HOUSE : cardTypes.THREE_KIND;
    }

    if (counts.some((c) => c === 2)) {
      return counts.length === 3 ? cardTypes.TWO_PAIR : cardTypes.ONE_PAIR;
    }

    return cardTypes.HIGH_CARD;
  };

  const cardValues: Record<string, number> = {
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    T: 10,
    J: 11,
    Q: 12,
    K: 13,
    A: 14,
  };

  const hands: Hand[] = handsWithoutTypes.map((h) => ({
    ...h,
    type: getHandType(h.hand),
  }));

  const sortedHands = sortHands(hands, cardValues);
  const numHands = sortedHands.length;
  const winnings = sortedHands.map(
    (hand, index) => hand.bid * (numHands - index)
  );

  return winnings.reduce((a, b) => a + b);
}

function part2(handsWithoutTypes: Omit<Hand, "type">[]) {
  const getHandType = (hand: string): Type => {
    const cardMap = new Map();

    // Count card labels
    for (const card of hand) {
      cardMap.set(card, (cardMap.get(card) ?? 0) + 1);
    }

    const jokerCount = cardMap.get("J") ?? 0;
    const counts = Array.from(cardMap.entries());

    if (
      counts.some(([label, count]) =>
        label === "J" ? count === 5 : count + jokerCount === 5
      )
    ) {
      return cardTypes.FIVE_KIND;
    }

    if (
      counts.some(([label, count]) =>
        label === "J" ? count === 4 : count + jokerCount === 4
      )
    ) {
      return cardTypes.FOUR_KIND;
    }

    if (
      counts.some(([label, count]) =>
        label === "J" ? count === 3 : count + jokerCount === 3
      )
    ) {
      if ((counts.length === 3 && !jokerCount) || counts.length === 4) {
        return cardTypes.THREE_KIND;
      }

      return cardTypes.FULL_HOUSE;
    }

    if (
      counts.some(([label, count]) =>
        label === "J" ? count === 2 : count + jokerCount === 2
      )
    ) {
      return counts.length === 3 ? cardTypes.TWO_PAIR : cardTypes.ONE_PAIR;
    }

    return cardTypes.HIGH_CARD;
  };

  const cardValues: Record<string, number> = {
    J: 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    T: 10,
    Q: 12,
    K: 13,
    A: 14,
  };

  const hands: Hand[] = handsWithoutTypes.map((h) => ({
    ...h,
    type: getHandType(h.hand),
  }));

  const sortedHands = sortHands(hands, cardValues);
  const numHands = sortedHands.length;
  const winnings = sortedHands.map(
    (hand, index) => hand.bid * (numHands - index)
  );

  return winnings.reduce((a, b) => a + b);
}

export function solve() {
  const hands = Deno.readTextFileSync("inputs/day7.txt")
    .split("\n")
    .filter(Boolean)
    .map((line) => line.split(" "))
    .map(([hand, bid]) => ({
      hand,
      bid: Number(bid),
    }));

  return `Part 1: ${part1(hands)}\nPart 2: ${part2(hands)}`;
}
