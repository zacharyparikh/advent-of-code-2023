import { solve } from "./solutions/day17.ts";

Deno.bench("Solve", () => {
  solve();
});

console.log(solve());
