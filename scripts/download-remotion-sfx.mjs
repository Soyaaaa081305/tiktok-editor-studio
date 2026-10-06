import {mkdir, stat, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import * as remotionSfx from '@remotion/sfx';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const destination = path.join(projectRoot, 'public', 'sfx', 'remotion');
await mkdir(destination, {recursive: true});

const assets = Object.entries(remotionSfx)
  .filter(([, url]) => typeof url === 'string' && url.startsWith('https://remotion.media/'))
  .map(([name, url]) => ({
    name,
    url,
    file: `${name}.wav`,
    licensePage: `https://www.remotion.dev/docs/sfx/${name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`,
  }));

const manifestAssets = [];
for (const asset of assets) {
  const filePath = path.join(destination, asset.file);
  let existingBytes = 0;
  try {
    existingBytes = (await stat(filePath)).size;
  } catch {
    // A missing file is fetched below.
  }

  let downloaded = false;
  if (existingBytes === 0) {
    const response = await fetch(asset.url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${asset.name}: HTTP ${response.status}`);
    }
    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.length === 0) {
      throw new Error(`Downloaded an empty file for ${asset.name}`);
    }
    await writeFile(filePath, bytes);
    existingBytes = bytes.length;
    downloaded = true;
  }

  console.log(`${downloaded ? 'Downloaded' : 'Already present'} ${asset.file} (${existingBytes} bytes)`);
  manifestAssets.push({
    ...asset,
    bytes: existingBytes,
    downloadedNow: downloaded,
    licenseReviewRequired: true,
    note: 'Check the linked Remotion detail page for this sound’s attribution/license before publishing it.',
  });
}

const manifest = {
  generatedAt: new Date().toISOString(),
  source: '@remotion/sfx 4.0.533',
  localDirectory: destination,
  assets: manifestAssets,
};
await writeFile(
  path.join(destination, 'manifest.json'),
  `${JSON.stringify(manifest, null, 2)}\n`,
  'utf8',
);
console.log(`\nCached ${manifestAssets.length} Remotion SFX files in ${destination}`);
