import { solve } from "./solutions/day6.ts";

Deno.bench("Solve", () => {
  solve();
});

console.log(solve());
