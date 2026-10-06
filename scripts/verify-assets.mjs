import {manifest, checkEntries} from './assets-lib.mjs';

const archives = process.argv.includes('--media-only')
  ? manifest.archives.filter(a => a.kind === 'media')
  : process.argv.includes('--exports-only')
    ? manifest.archives.filter(a => a.kind === 'exports')
    : manifest.archives;
const result = await checkEntries(archives, {quick: process.argv.includes('--quick')});
if (result.failures.length) {
  for (const item of result.failures) console.error(`${item.path}: ${item.reason}`);
  console.error('Run pnpm assets:restore. Use --force only to replace files you intentionally changed.');
  process.exitCode = 1;
} else {
  console.log(`Verified ${result.count} assets (${process.argv.includes('--quick') ? 'size check' : 'SHA-256'}).`);
}
