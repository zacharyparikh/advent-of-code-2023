import { solve } from "./solutions/day12.ts";

Deno.bench("Solve", () => {
  solve();
});

console.log(solve());
