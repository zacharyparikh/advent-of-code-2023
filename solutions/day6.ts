import { zip } from "../util/zip.ts";

type Race = { time: number; distance: number };

const findMinHoldDuration = ({ time, distance }: Race) => {
  for (let hold = 1; hold++; hold < time) {
    const timeLeft = time - hold;
    const speed = hold;

    if (speed * timeLeft > distance) {
      return hold;
    }
  }
};

const findMaxHoldDuration = ({ time, distance }: Race) => {
  for (let hold = time - 1; hold--; hold > 0) {
    const timeLeft = time - hold;
    const speed = hold;

    if (speed * timeLeft > distance) {
      return hold;
    }
  }
};

const countWinningHoldDurations = (race: Race) => {
  const min = findMinHoldDuration(race);
  const max = findMaxHoldDuration(race);

  if (!min || !max) {
    return 0;
  }

  return 1 + max - min;
};

function part1(races: Race[]) {
  return races.map(countWinningHoldDurations).reduce((a, b) => a * b);
}

function part2(races: Race[]) {
  const raceTime = Number(races.map((r) => r.time).join(""));
  const raceDistance = Number(races.map((r) => r.distance).join(""));

  return countWinningHoldDurations({ time: raceTime, distance: raceDistance });
}

export function solve() {
  const [timeString, distanceString] =
    Deno.readTextFileSync("inputs/day6.txt").split("\n");
  const times = timeString
    .replace("Time:", "")
    .trimStart()
    .split(/\s+/)
    .map(Number);

  const distances = distanceString
    .replace("Distance:", "")
    .trimStart()
    .split(/\s+/)
    .map(Number);

  const races = zip(times, distances).map(([time, distance]) => ({
    time,
    distance,
  }));

  console.log({ races });
  return `Part 1: ${part1(races)}\nPart 2: ${part2(races)}`;
}
