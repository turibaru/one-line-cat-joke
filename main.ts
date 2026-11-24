import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// The entry lives in its own file so the joke can change without touching this runner.
// I count what a reader sees, not bytes, so an emoji counts once.
// A joke that is too long never reaches the output folder.
// Missing output folder means there is nowhere safe to deliver the line.

// A short line lands faster than a long one.
// The runner carries the words, it does not rewrite them.
// Nothing here needs a network call, a timer, or a random number.
// If the line is too long, refusing beats shipping a cut-off ending.
const currentFile = fileURLToPath(import.meta.url);
const currentDir = dirname(currentFile);
const entryPath = join(currentDir, "entry.txt");

const outputDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outputDir) {
  console.error("MAKEFUN_OUTPUT_DIR is not set");
  process.exit(1);
}

let content: string;
try {
  content = readFileSync(entryPath, "utf-8");
} catch (error) {
  console.error(`Failed to read entry.txt: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}

if (Array.from(content).length > 200) {
  console.error(`entry.txt is ${Array.from(content).length} characters, over the 200-character limit`);
  process.exit(1);
}

mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, "entry.txt"), content, "utf-8");
process.exit(0);
