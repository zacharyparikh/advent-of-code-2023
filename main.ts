import { solve } from "./solutions/day10.ts";

Deno.bench("Solve", () => {
  solve();
});

console.log(solve());
