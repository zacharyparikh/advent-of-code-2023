export const zip = <T, U>(arr1: T[], arr2: U[]): [T, U][] =>
  arr1.flatMap((x, index) => (arr2[index] ? [[x, arr2[index]]] : []));
