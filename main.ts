import { solve } from "./solutions/day9.ts";

Deno.bench("Solve", () => {
  solve();
});

console.log(solve());
