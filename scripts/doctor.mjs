import {readFile, access} from 'node:fs/promises';
import {createRequire} from 'node:module';
import path from 'node:path';
import {root} from './assets-lib.mjs';
import {getFfmpegPath} from './runtime-paths.mjs';

const require = createRequire(import.meta.url);
const pkg = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
const installed = require('remotion/package.json').version;
if (installed !== pkg.dependencies.remotion) {
  throw new Error(`Remotion differs: ${installed} installed; ${pkg.dependencies.remotion} required.`);
}

// Verify core media & SFX for UnifiedSplitEditor
for (const file of ['source.mp4', 'poster-source.jpg', 'product-hero.jpg']) {
  await access(path.join(root, 'public', file));
}
for (const sfx of ['soft-whoosh.wav', 'production-pop.wav', 'production-chime.wav', 'production-tick.wav']) {
  await access(path.join(root, 'public', 'sfx', sfx));
}

// Verify streamlined prompts
for (const name of ['ALWAYS-ON.md', 'TIKTOK-EDITOR.md', 'SCRIPT-GENERATOR.md', 'house-style.json']) {
  await access(path.join(root, 'prompts', name));
}

// Verify Remotion engine entry points
await access(path.join(root, 'src', 'UnifiedSplitEditor.jsx'));
await access(path.join(root, 'src', 'index-v2.jsx'));

console.log(JSON.stringify({
  status: 'ready',
  architecture: 'News Daddy 55/45 split + Smartfit style',
  platform: process.platform,
  node: process.version,
  remotion: installed,
  ffmpeg: getFfmpegPath(),
  entry: 'src/index-v2.jsx',
  studio: 'http://localhost:3000/UnifiedSplitEditor'
}, null, 2));
console.log('Streamlined News Daddy 55/45 Remotion studio is ready.');
