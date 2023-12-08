import { solve } from "./solutions/day8.ts";

Deno.bench("Solve", () => {
  solve();
});

console.log(solve());
