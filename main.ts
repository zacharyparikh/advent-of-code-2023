import { solve } from "./solutions/day7.ts";

Deno.bench("Solve", () => {
  solve();
});

console.log(solve());
