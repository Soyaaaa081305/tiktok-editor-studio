import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {getFfmpegPath} from '../../scripts/runtime-paths.mjs';
import {path as ffprobe} from 'ffprobe-static';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const job = path.join(root, 'jobs/somatotypes-v2');
const work = path.join(root, 'work-render/somatotypes-v2');
const media = path.join(root, 'public/somatotypes');
const ffmpeg = getFfmpegPath();
const fps = 60;
const rate = 48000;
const edit = JSON.parse(fs.readFileSync(path.join(job, 'edit-data.json'), 'utf8'));
const duration = edit.durationInFrames / fps;
fs.mkdirSync(work, {recursive: true});
fs.mkdirSync(media, {recursive: true});

const run = (command, args, capture = false) => {
  const result = spawnSync(command, args, {cwd: root, encoding: 'utf8', stdio: capture ? 'pipe' : 'inherit', windowsHide: true, maxBuffer: 32 * 1024 * 1024});
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${path.basename(command)} failed (${result.status}): ${result.stderr || ''}`);
  return result;
};
const seconds = (frames) => (frames / fps).toFixed(8);
const source = path.join(media, 'main.mp4');
if (!fs.existsSync(source)) throw new Error(`Missing source recording: ${source}`);

function writeMusicWav(destination) {
  const samples = Math.ceil(edit.durationInFrames * rate / fps);
  const headerSize = 44;
  const buffer = Buffer.alloc(headerSize + samples * 4);
  buffer.write('RIFF', 0); buffer.writeUInt32LE(36 + samples * 4, 4); buffer.write('WAVE', 8);
  buffer.write('fmt ', 12); buffer.writeUInt32LE(16, 16); buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(2, 22); buffer.writeUInt32LE(rate, 24); buffer.writeUInt32LE(rate * 4, 28);
  buffer.writeUInt16LE(4, 32); buffer.writeUInt16LE(16, 34); buffer.write('data', 36); buffer.writeUInt32LE(samples * 4, 40);
  let seed = 0x5eeda11;
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 0xffffffff * 2 - 1; };
  const twoPiOverRate = Math.PI * 2 / rate;
  const beatSeconds = 60 / 92;
  const roots = [73.416, 58.270, 87.307, 65.406];
  const chordPhases = [0, 0, 0];
  let riserPhase = 0;
  let noiseFilter = 0;
  let bassPhase = 0;
  let leftFilter = 0;
  const writeSample = (index, val) => {
    const fade = index / rate > duration - 1.7 ? Math.max(0, (duration - index / rate) / 1.7) : 1;
    const soft = Math.tanh(val * 1.65) * 0.32 * fade;
    const int = Math.max(-32768, Math.min(32767, Math.round(soft * 32767)));
    buffer.writeInt16LE(int, headerSize + index * 4);
    buffer.writeInt16LE(int, headerSize + index * 4 + 2);
  };
  for (let i = 0; i < samples; i++) {
    const t = i / rate;
    let value = 0;
    if (t < 8) {
      const rise = t / 8;
      const freq = 55 + 52 * rise;
      riserPhase += freq * twoPiOverRate;
      const swell = 0.15 + 0.85 * rise * rise;
      value += swell * (0.065 * Math.sin(riserPhase) + 0.026 * Math.sin(riserPhase * 1.498));
      const noise = random();
      const cutoff = 0.001 + 0.11 * rise * rise;
      noiseFilter += cutoff * (noise - noiseFilter);
      value += noiseFilter * (0.008 + 0.082 * rise * rise);
      value += Math.sin(riserPhase * 0.5) * 0.022 * rise;
    } else {
      const beatPos = (t - 8) / beatSeconds;
      const beat = Math.floor(beatPos);
      const beatPhase = beatPos - beat;
      const bar = Math.floor(beat / 4) % 4;
      const inBar = beat % 4;
      const root = roots[bar];
      const bassNote = root * (inBar === 1 || inBar === 3 ? 1.5 : 1);
      bassPhase += bassNote * twoPiOverRate;
      const bassEnv = beatPhase < 0.92 ? Math.exp(-beatPhase * 5.4) : 0;
      value += (Math.sin(bassPhase) * 0.08 + Math.sin(bassPhase * 2) * 0.025) * bassEnv;

      const chord = [root * 2, root * 2 * 1.2, root * 2 * 1.5];
      for (let k = 0; k < chord.length; k++) {
        chordPhases[k] += chord[k] * twoPiOverRate;
        value += Math.sin(chordPhases[k]) * 0.009;
      }

      if (inBar === 0 || inBar === 2) {
        const x = beatPhase * beatSeconds;
        const env = Math.exp(-x * 17);
        const kickPhase = twoPiOverRate * (45 * x + 2 * (1 - Math.exp(-40 * x)));
        value += Math.sin(kickPhase) * 0.5 * env;
        value += Math.sin(twoPiOverRate * 170 * x) * 0.05 * Math.exp(-x * 50);
      }
      if (inBar === 1 || inBar === 3) {
        const x = beatPhase * beatSeconds;
        if (x < 0.19) {
          const env = Math.exp(-x * 27);
          const n = random();
          value += (n * 0.16 + Math.sin(twoPiOverRate * 188 * x) * 0.13) * env;
        }
      }
      const halfBeat = beatPos * 2;
      const hatPhase = (halfBeat - Math.floor(halfBeat)) * beatSeconds / 2;
      if (hatPhase < 0.026) {
        const env = Math.exp(-hatPhase * 205);
        const noise = random();
        leftFilter += 0.42 * (noise - leftFilter);
        value += (noise - leftFilter) * 0.06 * env;
      }
      if (inBar === 3 && beatPhase > 0.5) value += Math.sin(twoPiOverRate * 880 * t) * 0.006;
    }
    writeSample(i, value);
  }
  fs.writeFileSync(destination, buffer);
}

const music = path.join(work, 'original-riser-beat.wav');
writeMusicWav(music);

const audioGraph = [];
const audioLabels = [];
const coverLabel = 'voice0';
audioGraph.push(`anullsrc=r=${rate}:cl=stereo,atrim=duration=${seconds(edit.coverFrames)},asetpts=PTS-STARTPTS[${coverLabel}]`);
audioLabels.push(`[${coverLabel}]`);
for (const [i, segment] of edit.segments.entries()) {
  const label = `voice${i + 1}`;
  const frames = segment.sourceEndFrame - segment.sourceStartFrame;
  if (frames !== segment.durationInFrames) throw new Error(`Source/sequence frame mismatch on ${segment.id}`);
  const d = seconds(frames);
  audioGraph.push(`[0:a]atrim=start=${seconds(segment.sourceStartFrame)}:duration=${d},asetpts=PTS-STARTPTS,apad=whole_dur=${d},atrim=duration=${d},afade=t=in:st=0:d=0.006,afade=t=out:st=${Math.max(0, frames / fps - 0.006).toFixed(8)}:d=0.006[${label}]`);
  audioLabels.push(`[${label}]`);
}
audioGraph.push(`${audioLabels.join('')}concat=n=${audioLabels.length}:v=0:a=1,highpass=f=75,lowpass=f=15500,afftdn=nr=4:nf=-36,acompressor=threshold=0.17:ratio=1.6:attack=18:release=180:makeup=1[voice]`);
const voicePcm = path.join(work, 'voice-cut.wav');
run(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', '-i', source, '-filter_complex', audioGraph.join(';'), '-map', '[voice]', '-ar', String(rate), '-ac', '2', '-c:a', 'pcm_s24le', voicePcm]);

const firstMeasure = run(ffmpeg, ['-hide_banner', '-i', voicePcm, '-af', 'loudnorm=I=-15:TP=-2.2:LRA=9:print_format=json', '-f', 'null', '-'], true).stderr;
const parseLoud = (text) => {
  const match = text.match(/\{\s*"input_i"[\s\S]*?\}/);
  if (!match) throw new Error('FFmpeg loudness scan did not return measurements.');
  return JSON.parse(match[0]);
};
const voiceStats = parseLoud(firstMeasure);
const voiceFilter = `loudnorm=I=-15:TP=-2.2:LRA=9:measured_I=${voiceStats.input_i}:measured_TP=${voiceStats.input_tp}:measured_LRA=${voiceStats.input_lra}:measured_thresh=${voiceStats.input_thresh}:offset=${voiceStats.target_offset}:linear=true:print_format=json`;
const voiceNorm = path.join(work, 'voice-normalized.wav');
run(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', '-i', voicePcm, '-af', voiceFilter, '-ar', String(rate), '-ac', '2', '-c:a', 'pcm_s24le', voiceNorm]);

const cueFiles = [...new Set(edit.sfx.map((cue) => cue.file))];
const inputArgs = ['-i', voiceNorm, '-i', music];
for (const cue of cueFiles) {
  const p = path.join(root, 'public', cue);
  if (!fs.existsSync(p)) throw new Error(`Missing SFX file ${p}`);
  inputArgs.push('-i', p);
}
const graph = [
  `[0:a]aresample=${rate},aformat=channel_layouts=stereo[voice]`,
  `[1:a]aresample=${rate},aformat=channel_layouts=stereo,volume=0.16,afade=t=out:st=${Math.max(0, duration - 1.7).toFixed(8)}:d=1.7[music]`,
];
const cueLabels = [];
for (const [i, cue] of edit.sfx.entries()) {
  const input = cueFiles.indexOf(cue.file) + 2;
  const delay = Math.round(cue.frame * rate / fps);
  const label = `sfx${i}`;
  graph.push(`[${input}:a]aresample=${rate},aformat=channel_layouts=stereo,atrim=duration=${cue.durationSeconds},asetpts=PTS-STARTPTS,apad=whole_dur=${cue.durationSeconds},atrim=duration=${cue.durationSeconds},volume=${cue.gain},afade=t=in:st=0:d=0.008,afade=t=out:st=${Math.max(0, cue.durationSeconds - 0.04).toFixed(8)}:d=0.04,adelay=${delay}S:all=1[${label}]`);
  cueLabels.push(`[${label}]`);
}
graph.push(`${cueLabels.join('')}amix=inputs=${cueLabels.length}:normalize=0:duration=longest,apad=whole_dur=${duration},atrim=duration=${duration},asplit=2[sfxForMix][sfxReview]`);
graph.push(`[voice][music][sfxForMix]amix=inputs=3:normalize=0:duration=first,alimiter=limit=0.93:level=false:latency=true,atrim=duration=${duration},asetpts=PTS-STARTPTS[premaster]`);
const mix = path.join(work, 'mix-premaster.wav');
const sfxStem = path.join(job, 'sfx-review.wav');
run(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', ...inputArgs, '-filter_complex', graph.join(';'), '-map', '[premaster]', '-ar', String(rate), '-ac', '2', '-c:a', 'pcm_s24le', mix, '-map', '[sfxReview]', '-ar', String(rate), '-ac', '2', '-c:a', 'pcm_s24le', sfxStem]);

const mixStats = parseLoud(run(ffmpeg, ['-hide_banner', '-i', mix, '-af', 'loudnorm=I=-14.5:TP=-1.8:LRA=9:print_format=json', '-f', 'null', '-'], true).stderr);
const master = `loudnorm=I=-14.5:TP=-1.8:LRA=9:measured_I=${mixStats.input_i}:measured_TP=${mixStats.input_tp}:measured_LRA=${mixStats.input_lra}:measured_thresh=${mixStats.input_thresh}:offset=${mixStats.target_offset}:linear=true:print_format=json`;
const soundtrack = path.join(media, 'soundtrack-v2.m4a');
run(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', '-i', mix, '-af', master, '-ar', String(rate), '-ac', '2', '-c:a', 'aac', '-b:a', '256k', '-movflags', '+faststart', soundtrack]);
const finalStats = parseLoud(run(ffmpeg, ['-hide_banner', '-i', soundtrack, '-af', 'loudnorm=I=-14.5:TP=-1.8:LRA=9:print_format=json', '-f', 'null', '-'], true).stderr);
const silenceText = run(ffmpeg, ['-hide_banner', '-i', voiceNorm, '-af', 'silencedetect=noise=-42dB:d=0.35', '-f', 'null', '-'], true).stderr;
const events = [...silenceText.matchAll(/silence_(start|end):\s*([\d.]+)/g)].map((m) => ({type: m[1], seconds: Number(m[2])}));
const ranges = [];
let start = null;
for (const event of events) {
  if (event.type === 'start') start = event.seconds;
  else if (start !== null) { ranges.push({startSeconds: start, endSeconds: event.seconds, durationSeconds: Number((event.seconds - start).toFixed(4))}); start = null; }
}
fs.writeFileSync(path.join(job, 'silence-audit.json'), JSON.stringify({
  status: ranges.length ? 'REVIEW_REQUIRED' : 'NO_UNPLANNED_GAP_OVER_0.35S_DETECTED',
  detector: {thresholdDb: -42, minimumDurationSeconds: 0.35},
  checkedTrack: 'voice-normalized original narration before music/SFX',
  authoredSilence: [{startSeconds: 0, endSeconds: edit.coverFrames / fps, reason: 'authentic 0.1-second cover'}],
  detectedRanges: ranges,
  reviewedSourcePauses: edit.narrationCoverage.removedSourceRanges.filter((range) => range.reason.startsWith('long pause')).map((range) => ({start: range.startSeconds, end: range.endSeconds})),
  protectedQuietSpeech: edit.narrationCoverage.preservedLowSpeech,
  subjectiveListening: 'UNVERIFIED: no continuous subjective local-audio audition was available to the model.'
}, null, 2) + '\n');
fs.writeFileSync(path.join(job, 'audio-measurements.json'), JSON.stringify({
  durationSeconds: duration,
  voiceBeforeMaster: voiceStats,
  deliveredSoundtrack: finalStats,
  insertedSilenceFrames: edit.coverFrames,
  plannedMusic: {type: 'original generated synth riser into 92 BPM hip-hop/electronic beat', dropFrame: edit.musicDropFrame, requested: true, mixGain: 0.16},
  sfxCueCount: edit.sfx.length,
  musicRequestedByCreator: true,
  silenceDetector: {thresholdDb: -42, minimumDurationSeconds: 0.35},
  detectedDialogueSilences: ranges
}, null, 2) + '\n');
console.log(`Audio ready: ${duration.toFixed(3)} s, ${edit.sfx.length} SFX cues, ${finalStats.input_i} LUFS, ${finalStats.input_tp} dBTP.`);
