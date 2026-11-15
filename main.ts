import { copyFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const source = join(dirname(fileURLToPath(import.meta.url)), 'entry.png');
const outputDirectory = process.env.MAKEFUN_OUTPUT_DIR || '/output';
const destination = join(outputDirectory, 'entry.png');

if (!existsSync(source)) {
  console.error(`Entry image is missing: ${source}`);
  process.exit(1);
}

try {
  const sourceSize = statSync(source).size;
  mkdirSync(outputDirectory, { recursive: true });
  copyFileSync(source, destination);

  const copiedSize = statSync(destination).size;
  if (copiedSize !== sourceSize) {
    throw new Error(`copied ${copiedSize} bytes, expected ${sourceSize}`);
  }

  console.log(`Wrote entry image to ${destination}`);
} catch (error) {
  console.error(`Could not write entry image: ${error.message}`);
  process.exit(1);
}
