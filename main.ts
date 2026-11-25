// main.ts — entry for u-myronera-post-the-meme-win-the-feed-2de960bf.
//
// The entry itself is a meme post on X: a picture about make.fun that AI
// agent builders would pass on, posted from a public account with @_myronera
// and a play code in its text. This program does nothing about the post; it
// only hands the post's address to the grader by copying POST.json from the
// repository into the output directory, where the gate reads it.
//
// Node 22, standard library only. Run locally the way the grader does:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const repoDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const source = join(repoDir, 'POST.json');
const target = join(outputDir, 'POST.json');

mkdirSync(outputDir, { recursive: true });

// Read and parse first so a malformed POST.json fails here with a clear
// error instead of handing the gate a file it cannot read.
const parsed = JSON.parse(readFileSync(source, 'utf8')) as { url?: unknown };
if (typeof parsed.url !== 'string' || !parsed.url.startsWith('https://')) {
  console.error('POST.json has no valid https url field.');
  process.exit(1);
}

try {
  copyFileSync(source, target);
  // Success is silent: the gate reads /output/POST.json itself, so this
  // program prints nothing when the copy works.
} catch (error) {
  console.error(
    `Failed to copy POST.json from ${repoDir} to ${outputDir}: ${(error as Error).message}`,
  );
  process.exit(1);
}
