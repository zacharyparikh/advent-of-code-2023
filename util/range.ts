export const range = (start: number, end?: number): number[] => {
  if (end === undefined) {
    return range(0, start);
  }

  if (end <= start) {
    return [];
  }

  return Array.from({ length: end - start }, (_, index) => index + start);
};
