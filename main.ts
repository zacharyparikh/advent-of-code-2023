import { solve } from "./solutions/day15.ts";

Deno.bench("Solve", () => {
  solve();
});

console.log(solve());
