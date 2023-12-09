import { zip } from "./zip.ts";

export const pairs = <T>(list: T[]): [T, T][] => zip(list, list.slice(1))
