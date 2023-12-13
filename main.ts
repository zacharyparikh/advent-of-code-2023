import { solve } from "./solutions/day13.ts";

Deno.bench("Solve", () => {
  solve();
});

console.log(solve());
