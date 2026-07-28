import fs from 'node:fs/promises';
import { build } from 'esbuild';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const entry = path.join(__dirname, '_generate-css.ts');
const outfile = path.join(__dirname, '_generate-css.cjs');

try {
  await build({
    entryPoints: [entry],
    bundle: true,
    outfile,
    platform: 'node',
    format: 'cjs',
    external: ['node:fs/promises', 'node:path']
  });

  await import(pathToFileURL(outfile).href);
} catch (err) {
  console.error('Error construyendo CSS:', err);
  process.exit(1);
} finally {
  await fs.unlink(outfile).catch(() => {});
}
