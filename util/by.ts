import { range } from './range.ts';

export const by = <T>(n: number, arr: T[]): T[][] => {
  const entries = [];
  const iter = arr.values();

  let entry = range(n).map(() => iter.next());
  while (entry.every((e) => !e.done)) {
    entries.push(entry.map((e) => e.value));
    entry = range(n).map(() => iter.next());
  }

  return entries;
};
