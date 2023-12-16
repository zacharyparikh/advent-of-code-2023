import { solve } from "./solutions/day16.ts";

Deno.bench("Solve", () => {
  solve();
});

console.log(solve());
