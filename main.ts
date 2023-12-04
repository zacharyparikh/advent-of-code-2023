import { solve } from "./solutions/day4.ts";

Deno.bench("Solve", () => {
  solve();
});

console.log(solve());
