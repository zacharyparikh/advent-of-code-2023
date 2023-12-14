import { solve } from "./solutions/day14.ts";

Deno.bench("Solve", () => {
  solve();
});

console.log(solve());
