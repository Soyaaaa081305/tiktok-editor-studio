import {readFile, access} from 'node:fs/promises';
import {createRequire} from 'node:module';
import path from 'node:path';
import {root, manifest, checkEntries} from './assets-lib.mjs';
import {getFfmpegPath} from './runtime-paths.mjs';

const require = createRequire(import.meta.url);
const pkg = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
const installed = require('remotion/package.json').version;
if (installed !== pkg.dependencies.remotion) throw new Error(`Remotion differs: ${installed} installed; ${pkg.dependencies.remotion} required.`);
const media = await checkEntries(manifest.archives.filter(a => a.kind === 'media'));
if (media.failures.length) throw new Error(`Media is incomplete or changed. Run pnpm assets:restore. ${JSON.stringify(media.failures.slice(0, 5))}`);
let cueCount = 0;
for (const name of ['src/sound-design-v3.json', 'src/sound-design-v4.json', 'src/ashwagandha/sound-design.json', 'src/ashwagandha/sound-design-clean.json', 'src/ashwagandha/sound-design-gapless-v4.json']) {
  const design = JSON.parse(await readFile(path.join(root, name), 'utf8'));
  for (const cue of design.cues) await access(path.join(root, 'public', cue.src));
  cueCount += design.cues.length;
}
for (const name of ['ALWAYS-ON-PROMPT.md', '03-topic-to-script-prompt.md', '04-master-production-system-prompt.md', '07-approved-editorial-reference.md', 'creator-operations-context.md', 'gemini-spark-start-here.md', 'gemini-spark-nightly-packet.md', 'house-style.json']) await access(path.join(root, 'prompts', name));
console.log(JSON.stringify({status: 'ready', platform: process.platform, architecture: process.arch, node: process.version, remotion: installed, ffmpeg: getFfmpegPath(), verifiedMediaFiles: media.count, mappedSoundCues: cueCount, entry: 'src/index-v2.jsx', studio: 'http://localhost:3000/AshwagandhaEditorialV2'}, null, 2));
console.log('Assets and tools are ready. Inspect a rendered file before calling a new export reviewed.');
