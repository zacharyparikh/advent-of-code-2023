import { solve } from "./solutions/day5.ts";

Deno.bench("Solve", () => {
  solve();
});

console.log(solve());
