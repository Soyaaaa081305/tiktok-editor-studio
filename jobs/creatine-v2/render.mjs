import {spawnSync} from 'node:child_process';
import {mkdir, readFile, unlink} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {getFfmpegPath} from '../../scripts/runtime-paths.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const edit = JSON.parse(await readFile(new URL('./edit-plan.json', import.meta.url), 'utf8'));
const sfxData = JSON.parse(await readFile(new URL('./sfx-cues.json', import.meta.url), 'utf8'));
const outputDir = path.join(root, 'outputs');
const tempDir = path.join(root, 'work', 'creatine-v2-render');
const outputName = process.argv[2] ?? 'creatine-tiktok-v2.mp4';
if (path.basename(outputName) !== outputName || !/^creatine-tiktok-v[0-9]+\.mp4$/.test(outputName)) throw new Error('Pass a safe Creatine output filename such as creatine-tiktok-v3.mp4.');
const videoOnly = path.join(tempDir, `${path.parse(outputName).name}-video-only.mp4`);
const finalVideo = path.join(outputDir, outputName);
await mkdir(outputDir, {recursive: true});
await mkdir(tempDir, {recursive: true});

const run = (command, args, options = {}) => {
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: 'inherit',
    windowsHide: true,
    ...options,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} exited with ${result.status}`);
};

const packageManager = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
run(packageManager, [
  'exec', 'remotion', 'render', 'src/index-v2.jsx', 'CreatineMythsV2', videoOnly,
  '--codec=h264', '--crf=20', '--concurrency=4', '--timeout=120000', '--muted', '--overwrite',
], {shell: process.platform === 'win32'});

const sampleRate = 48000;
const ffmpeg = getFfmpegPath();
const filter = ['[1:a]anull[voice]'];
const inputs = ['-i', videoOnly, '-i', path.join(root, 'public', 'creatine', 'voice-edit-v2.wav')];
for (const [index, cue] of sfxData.cues.entries()) {
  const samples = Math.round(cue.frame * sampleRate / edit.fps);
  const channelDelays = `${samples}S|${samples}S|${samples}S`;
  inputs.push('-i', path.join(root, 'public', cue.file));
  filter.push(`[${index + 2}:a]aresample=${sampleRate},aformat=channel_layouts=stereo,volume=${cue.volume},adelay=${channelDelays},acopy[sfx${index}]`);
}
const tracks = ['[voice]', ...sfxData.cues.map((_, index) => `[sfx${index}]`)].join('');
filter.push(`${tracks}amix=inputs=${sfxData.cues.length + 1}:duration=first:dropout_transition=0:normalize=0[aout]`);

run(ffmpeg, [
  '-hide_banner', '-y', ...inputs, '-filter_complex', filter.join(';'),
  '-map', '0:v:0', '-map', '[aout]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k',
  '-ar', String(sampleRate), '-ac', '2', '-movflags', '+faststart', '-shortest', finalVideo,
]);
await unlink(videoOnly);
console.log(`Wrote the Creatine V2 picture, original-speed voice, and timed SFX: ${finalVideo}`);
