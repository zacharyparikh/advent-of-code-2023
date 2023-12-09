export const zip = <T, U>(arr1: T[], arr2: U[]): [T, U][] =>
  arr1.flatMap((x, index) => (index < arr2.length ? [[x, arr2[index]]] : []));
