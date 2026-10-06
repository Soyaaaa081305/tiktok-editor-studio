import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {getFfmpegPath} from '../../scripts/runtime-paths.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const plan = JSON.parse(await readFile(new URL('./edit-plan.json', import.meta.url), 'utf8'));
const input = path.join(root, plan.source);
const output = path.join(root, plan.voiceTrack);
const ffmpeg = getFfmpegPath();
const sampleRate = 48000;
const pieces = [];
const chains = [];
for (let index = 0; index < plan.segments.length; index++) {
  const segment = plan.segments[index];
  const startSample = Math.round(segment.sourceStartFrame * sampleRate / plan.fps);
  const endSample = Math.round(segment.sourceEndFrame * sampleRate / plan.fps);
  const duration = (endSample - startSample) / sampleRate;
  const label = `voice${index}`;
  chains.push(`[0:a]atrim=start_sample=${startSample}:end_sample=${endSample},asetpts=PTS-STARTPTS,afade=t=in:st=0:d=0.008,afade=t=out:st=${Math.max(0, duration - 0.008).toFixed(6)}:d=0.008[${label}]`);
  pieces.push(`[${label}]`);
}
chains.push(`${pieces.join('')}concat=n=${pieces.length}:v=0:a=1,loudnorm=I=-16:TP=-1.5:LRA=11[voiceout]`);
const args = ['-hide_banner', '-y', '-i', input, '-filter_complex', chains.join(';'), '-map', '[voiceout]', '-ar', String(sampleRate), '-ac', '2', '-c:a', 'pcm_s24le', output];
const result = spawnSync(ffmpeg, args, {cwd: root, stdio: 'inherit', windowsHide: true});
if (result.error) throw result.error;
if (result.status !== 0) throw new Error(`FFmpeg exited with ${result.status}`);
console.log(`Wrote original-speed Taglish montage: ${output}`);
