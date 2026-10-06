import {spawnSync} from 'node:child_process';
import {existsSync, mkdirSync, readFileSync, rmSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {mixV3Audio, muxV3Audio, finalSfxVideo} from './sound-v3.mjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const edit = JSON.parse(readFileSync(path.join(projectRoot, 'src', 'edit-data-v2.json'), 'utf8'));
const outputDir = path.join(projectRoot, 'outputs');
const tempDir = path.join(projectRoot, 'work-render');
const silentVideo = path.join(tempDir, 'atc-fish-oil-tiktok-v3-silent.mp4');
const finalVideo = finalSfxVideo;
const sourceVideo = path.join(projectRoot, 'public', 'source.mp4');
const voiceTrack = path.join(projectRoot, 'public', 'voice-track-v3.m4a');
const {getFfmpegPath} = await import('./runtime-paths.mjs');
const ffmpegPath = getFfmpegPath();

if (!ffmpegPath) throw new Error('The bundled FFmpeg executable is unavailable.');
if (!existsSync(sourceVideo)) throw new Error(`Source recording not found: ${sourceVideo}`);

mkdirSync(outputDir, {recursive: true});
mkdirSync(tempDir, {recursive: true});

const seconds = (frames) => (frames / edit.fps).toFixed(6);
const fadeSeconds = seconds(3);
const filters = [
  `anullsrc=r=48000:cl=stereo,atrim=duration=${seconds(edit.posterFrames)},asetpts=PTS-STARTPTS[silence]`,
];

for (let index = 0; index < edit.edl.length; index++) {
  const clip = edit.edl[index];
  const clipFrames = clip.sourceEndFrame - clip.sourceStartFrame;
  const clipDuration = seconds(clipFrames);
  const start = seconds(clip.sourceStartFrame);
  const fadeOutStart = seconds(Math.max(0, clipFrames - 3));
  filters.push(
    `[0:a]atrim=start=${start}:duration=${clipDuration},asetpts=PTS-STARTPTS,` +
    `afade=t=in:st=0:d=${fadeSeconds},afade=t=out:st=${fadeOutStart}:d=${fadeSeconds}[voice${index}]`,
  );
}

const concatInputs = ['[silence]', ...edit.edl.map((_, index) => `[voice${index}]`)].join('');
filters.push(`${concatInputs}concat=n=${edit.edl.length + 1}:v=0:a=1[voice]`);

if (!process.argv.includes('--skip-audio')) {
const audioRender = spawnSync(ffmpegPath, [
  '-y',
  '-i', sourceVideo,
  '-filter_complex', filters.join(';'),
  '-map', '[voice]',
  '-c:a', 'aac',
  '-b:a', '192k',
  voiceTrack,
], {cwd: projectRoot, stdio: 'inherit'});

if (audioRender.error) throw audioRender.error;
if (audioRender.status !== 0) process.exit(audioRender.status ?? 1);
mixV3Audio();
} else if (!existsSync(path.join(projectRoot, 'public/sound-track-v3-sfx.m4a'))) {
  throw new Error('Run pnpm assets:restore to restore the finished soundtrack.');
}
if (process.argv.includes('--audio-only')) {
  console.log('Prepared Studio soundtrack with the selected original voice and synchronized SFX.');
  process.exit(0);
}

const remotionCli = path.join(projectRoot, 'node_modules', '@remotion', 'cli', 'remotion-cli.js');
const render = spawnSync(process.execPath, [
  remotionCli,
  'render',
  'ATCFishOilV3',
  silentVideo,
  '--muted',
  '--codec=h264',
  '--crf=18',
  '--pixel-format=yuv420p',
  '--overwrite',
], {cwd: projectRoot, stdio: 'inherit'});

if (render.error) throw render.error;
if (render.status !== 0) process.exit(render.status ?? 1);
if (!existsSync(silentVideo)) throw new Error(`Remotion did not create the silent video: ${silentVideo}`);

muxV3Audio(silentVideo, finalVideo);

rmSync(silentVideo, {force: true});
console.log(`Rendered final video: ${finalVideo}`);
