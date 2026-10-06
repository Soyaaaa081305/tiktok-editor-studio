import {spawnSync} from 'node:child_process';
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {getFfmpegPath} from './runtime-paths.mjs';
const ffmpegPath = getFfmpegPath();

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = path.join(projectRoot, 'outputs');
const workDir = path.join(projectRoot, 'work-render');
const edit = JSON.parse(readFileSync(path.join(projectRoot, 'src/edit-data-v2.json'), 'utf8'));
const design = JSON.parse(readFileSync(path.join(projectRoot, 'src/sound-design-v3.json'), 'utf8'));
export const mixedTrack = path.join(projectRoot, 'public', 'sound-track-v3-sfx.m4a');
export const finalSfxVideo = path.join(outputDir, 'atc-fish-oil-tiktok-v3-sfx.mp4');
const seconds = (frames) => (frames / edit.fps).toFixed(6);

const run = (args) => {
  if (!ffmpegPath) throw new Error('FFmpeg is unavailable.');
  const result = spawnSync(ffmpegPath, ['-hide_banner', '-loglevel', 'error', '-y', ...args], {
    cwd: projectRoot, stdio: 'inherit',
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`Audio processing failed with exit ${result.status}.`);
};

const writeOriginalChime = () => {
  const sampleRate = 48000;
  const duration = 0.54;
  const count = Math.round(sampleRate * duration);
  const samples = new Float64Array(count);
  let peak = 0;
  for (let i = 0; i < count; i++) {
    const t = i / sampleRate;
    let value = 0;
    for (const [start, hz, weight] of [[0, 1318.51, 0.8], [0.08, 1760, 0.64]]) {
      const age = t - start;
      if (age < 0) continue;
      const attack = Math.min(1, age / 0.005);
      const end = Math.min(1, (duration - t) / 0.06);
      value += weight * attack * end * Math.exp(-age / 0.115) *
        (Math.sin(2 * Math.PI * hz * age) + 0.16 * Math.sin(4 * Math.PI * hz * age));
    }
    samples[i] = value;
    peak = Math.max(peak, Math.abs(value));
  }
  const wav = Buffer.alloc(44 + count * 4);
  wav.write('RIFF', 0); wav.writeUInt32LE(wav.length - 8, 4); wav.write('WAVE', 8);
  wav.write('fmt ', 12); wav.writeUInt32LE(16, 16); wav.writeUInt16LE(1, 20);
  wav.writeUInt16LE(2, 22); wav.writeUInt32LE(sampleRate, 24);
  wav.writeUInt32LE(sampleRate * 4, 28); wav.writeUInt16LE(4, 32);
  wav.writeUInt16LE(16, 34); wav.write('data', 36); wav.writeUInt32LE(count * 4, 40);
  const scale = (10 ** (-4 / 20)) / peak;
  for (let i = 0; i < count; i++) {
    const value = Math.round(samples[i] * scale * 32767);
    wav.writeInt16LE(value, 44 + i * 4);
    wav.writeInt16LE(value, 46 + i * 4);
  }
  writeFileSync(path.join(projectRoot, 'public/sfx/production-chime.wav'), wav);
};

export const prepareV3Sfx = () => {
  mkdirSync(workDir, {recursive: true});
  for (const [source, destination, gainDb] of [
    ['soft-impact.wav', 'production-hit.wav', 18.2],
    ['soft-tick.wav', 'production-pop.wav', 20.4],
    ['soft-tick.wav', 'production-tick.wav', 19.4],
  ]) {
    run(['-i', path.join(projectRoot, 'public/sfx', source),
      '-af', `volume=${gainDb}dB`, '-ar', '48000', '-ac', '2', '-c:a', 'pcm_s16le',
      path.join(projectRoot, 'public/sfx', destination)]);
  }
  writeOriginalChime();
};

export const mixV3Audio = () => {
  prepareV3Sfx();
  const voice = path.join(projectRoot, 'public/voice-track-v3.m4a');
  if (!existsSync(voice)) throw new Error('Prepare the cut voice with render-v3.mjs first.');
  const sourceNames = [...new Set(design.cues.map((cue) => cue.src))];
  const inputs = ['-i', voice];
  for (const source of sourceNames) {
    const absolute = path.join(projectRoot, 'public', source);
    if (!existsSync(absolute)) throw new Error(`Sound asset is missing: ${source}`);
    inputs.push('-i', absolute);
  }
  const duration = seconds(edit.durationInFrames);
  const filters = [`[0:a]aresample=48000,aformat=channel_layouts=stereo,` +
    `atrim=duration=${duration},asetpts=PTS-STARTPTS,volume=${design.voiceVolume}[voice]`];
  const labels = [];
  for (const [index, cue] of design.cues.entries()) {
    if (!Number.isInteger(cue.frame) || cue.frame < 0 ||
      !Number.isInteger(cue.durationInFrames) || cue.durationInFrames < 1 ||
      cue.frame + cue.durationInFrames > edit.durationInFrames ||
      !Number.isFinite(cue.volume) || cue.volume <= 0) {
      throw new Error(`Invalid sound cue: ${cue.id}`);
    }
    const inputIndex = sourceNames.indexOf(cue.src) + 1;
    const clipLength = seconds(cue.durationInFrames);
    const chain = [
      'aresample=48000', 'aformat=channel_layouts=stereo',
      `atrim=start=${seconds(cue.trimBefore ?? 0)}:duration=${clipLength}`,
      'asetpts=PTS-STARTPTS', `apad=whole_dur=${clipLength}`,
      `atrim=duration=${clipLength}`, `volume=${cue.volume}`,
    ];
    if (cue.fadeInFrames) chain.push(`afade=t=in:st=0:d=${seconds(cue.fadeInFrames)}`);
    if (cue.fadeOutFrames) chain.push(`afade=t=out:st=${seconds(cue.durationInFrames - cue.fadeOutFrames)}:d=${seconds(cue.fadeOutFrames)}`);
    const samples = Math.round(cue.frame * 48000 / edit.fps);
    chain.push(`adelay=${samples}S:all=1`);
    const label = `cue${index}`;
    filters.push(`[${inputIndex}:a]${chain.join(',')}[${label}]`);
    labels.push(`[${label}]`);
  }
  filters.push(`${labels.join('')}amix=inputs=${labels.length}:normalize=0:duration=longest,` +
    `apad=whole_dur=${duration},atrim=duration=${duration},asplit=2[sfx][sfxproof]`);
  const limit = (10 ** (design.peakLimitDb / 20)).toFixed(8);
  filters.push(`[voice][sfx]amix=inputs=2:normalize=0:duration=first,` +
    `volume=${design.masterGain},alimiter=limit=${limit}:level=false:latency=true,` +
    `atrim=duration=${duration},asetpts=PTS-STARTPTS[mix]`);
  run([...inputs, '-filter_complex', filters.join(';'),
    '-map', '[mix]', '-ar', '48000', '-ac', '2', '-c:a', 'aac', '-b:a', '192k', mixedTrack,
    '-map', '[sfxproof]', '-ar', '48000', '-ac', '2', '-c:a', 'pcm_s16le',
    path.join(workDir, 'sfx-stem-v3.wav')]);
  console.log(`Prepared ${design.cues.length} synchronized SFX cues in the Studio/export soundtrack.`);
};

export const muxV3Audio = (picture, output = finalSfxVideo) => {
  if (!existsSync(picture) || !existsSync(mixedTrack)) throw new Error('Picture or finished soundtrack is missing.');
  mkdirSync(outputDir, {recursive: true});
  run(['-i', picture, '-i', mixedTrack, '-map', '0:v:0', '-map', '1:a:0',
    '-c:v', 'copy', '-c:a', 'copy', '-t', seconds(edit.durationInFrames),
    '-movflags', '+faststart', output]);
  console.log(`Exported video with SFX: ${output}`);
};

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  mixV3Audio();
  if (process.argv.includes('--mix-existing')) {
    muxV3Audio(path.join(outputDir, 'atc-fish-oil-tiktok-v3.mp4'));
  }
}
