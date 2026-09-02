import { cp, mkdir, rm } from "node:fs/promises";

const outputDir = "dist";

await rm(outputDir, { force: true, recursive: true });
await mkdir(`${outputDir}/assets`, { recursive: true });

await Promise.all([
  cp("index.html", `${outputDir}/index.html`),
  cp("assets/app.js", `${outputDir}/assets/app.js`),
  cp("assets/styles.css", `${outputDir}/assets/styles.css`),
  cp("f1edbef12f2326129cf8486b952bfd0a.txt", `${outputDir}/f1edbef12f2326129cf8486b952bfd0a.txt`),
]);
