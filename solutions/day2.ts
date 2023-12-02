type Color = "red" | "green" | "blue";
const isColor = (maybeColor: string): maybeColor is Color =>
  maybeColor === "red" || maybeColor === "green" || maybeColor === "blue";

type Game = { number: number; counts: Record<Color, number>[] };

function part1(games: Game[]) {
  const hiddenCubes: Record<Color, number> = { red: 12, green: 13, blue: 14 };
  const gamePossible = (game: Game) =>
    game.counts.every((count) =>
      Object.entries(count).every(
        ([color, count]) => isColor(color) && hiddenCubes[color] >= count
      )
    );
  const possibleGames = games.filter(gamePossible).map((g) => g.number);

  return possibleGames.reduce((a, b) => a + b);
}

function part2(games: Game[]) {
  const minimumCubeSets = games.map((game) => {
    const initialValue: Record<Color, number> = {
      red: 0,
      green: 0,
      blue: 0,
    };

    return game.counts.reduce((acc, count) => {
      Object.entries(count).forEach(([color, count]) => {
        if (isColor(color) && acc[color] < count) {
          acc[color] = count;
        }
      });

      return acc;
    }, initialValue);
  });

  const powers = minimumCubeSets.map((set) =>
    Object.values(set).reduce((a, b) => a * b)
  );

  return powers.reduce((a, b) => a + b);
}

export function solve() {
  const games = Deno.readTextFileSync("inputs/day2.txt")
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [gameNumberString, cubeSetsString] = line.split(": ");
      const gameNumber = Number(gameNumberString.replace("Game ", ""));
      const colorCounts = cubeSetsString.split("; ").map((cubeSet) => {
        const initialValue: Record<Color, number> = {
          red: 0,
          green: 0,
          blue: 0,
        };

        return cubeSet.split(", ").reduce((acc, colorCount) => {
          const [count, color] = colorCount.split(" ");
          if (color === "red" || color === "green" || color === "blue") {
            acc[color] = Number(count);
          }
          return acc;
        }, initialValue);
      });

      return { number: gameNumber, counts: colorCounts };
    });

  return `Part 1: ${part1(games)}\nPart 2: ${part2(games)}`;
}
