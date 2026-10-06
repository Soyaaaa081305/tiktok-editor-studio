import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {getFfmpegPath} from './runtime-paths.mjs';
import {path as ffprobe} from 'ffprobe-static';

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ffmpeg = getFfmpegPath();
const pub = path.join(project, 'public');
const edit = JSON.parse(fs.readFileSync(path.join(project, 'src/ashwagandha/edit-v2-gapless.json'), 'utf8'));
const sourceSound = JSON.parse(fs.readFileSync(path.join(project, 'src/ashwagandha/sound-design.json'), 'utf8'));
const voicePath = path.join(pub, edit.audio.sourceTrack);
const ambientPath = path.join(pub, 'ashwagandha/original-ambient.wav');
const outputPath = path.join(pub, edit.audio.outputTrack);
const jobs = path.join(project, 'jobs/ashwagandha-v2-gapless');
const work = path.join(project, 'work-render/ashwagandha-v2-gapless');
const fps = edit.fps;
const duration = edit.durationInFrames / fps;
const rate = 48000;
fs.mkdirSync(jobs, {recursive: true});
fs.mkdirSync(work, {recursive: true});

const run = (command, args, capture = false) => {
  const result = spawnSync(command, args, {
    cwd: project,
    encoding: 'utf8',
    stdio: capture ? 'pipe' : 'inherit',
    windowsHide: true,
    maxBuffer: 32 * 1024 * 1024,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${path.basename(command)} failed (${result.status}): ${result.stderr || ''}`);
  return result;
};

const ensureOriginalVoiceAssets = () => {
  if (fs.existsSync(voicePath) && fs.existsSync(ambientPath)) return;
  console.log('Restoring the original V2 voice and ambient audio from the source recording...');
  run(process.execPath, [path.join(project, 'scripts/render-ashwagandha.mjs'), '--audio-only']);
  if (!fs.existsSync(voicePath) || !fs.existsSync(ambientPath)) {
    throw new Error('The V2 voice track or ambient bed could not be prepared.');
  }
};

const parseLoudness = (stderr) => {
  const match = stderr.match(/\{\s*"input_i"[\s\S]*?\}/);
  if (!match) throw new Error('FFmpeg did not return loudness measurements.');
  return JSON.parse(match[0]);
};

const measureLoudness = (file, target) => parseLoudness(run(ffmpeg, [
  '-hide_banner', '-i', file,
  '-af', `loudnorm=I=${target.integrated}:TP=${target.truePeak}:LRA=9:print_format=json`,
  '-f', 'null', '-',
], true).stderr);

ensureOriginalVoiceAssets();

const voiceSegments = [];
const voiceFilters = [];
for (const [index, segment] of edit.audio.segments.entries()) {
  const label = `v${index}`;
  if (Number.isFinite(segment.silenceDurationMs)) {
    const seconds = (segment.silenceDurationMs / 1000).toFixed(8);
    voiceFilters.push(`anullsrc=r=${rate}:cl=stereo,atrim=duration=${seconds},asetpts=PTS-STARTPTS[${label}]`);
  } else {
    const start = segment.sourceStartMs / 1000;
    const segmentDuration = (segment.sourceEndMs - segment.sourceStartMs) / 1000;
    if (segmentDuration <= 0) throw new Error(`Invalid audio segment duration: ${segment.id}`);
    voiceFilters.push(`[0:a]atrim=start=${start.toFixed(8)}:duration=${segmentDuration.toFixed(8)},asetpts=PTS-STARTPTS,afade=t=in:st=0:d=0.008,afade=t=out:st=${Math.max(0, segmentDuration - 0.008).toFixed(8)}:d=0.008[${label}]`);
  }
  voiceSegments.push(`[${label}]`);
}
voiceFilters.push(`${voiceSegments.join('')}concat=n=${voiceSegments.length}:v=0:a=1,highpass=f=85,lowpass=f=14500,afftdn=nr=7:nf=-35,equalizer=f=320:t=q:w=1:g=-1.5,equalizer=f=2700:t=q:w=1:g=1.0,acompressor=threshold=0.125:ratio=2:attack=12:release=120:makeup=1[voice]`);

const rawVoice = path.join(work, 'voice-gapless-unmastered.wav');
run(ffmpeg, [
  '-hide_banner', '-loglevel', 'error', '-y', '-i', voicePath,
  '-filter_complex', voiceFilters.join(';'), '-map', '[voice]',
  '-ar', String(rate), '-ac', '2', '-c:a', 'pcm_s24le', rawVoice,
]);

const voiceStats = measureLoudness(rawVoice, {integrated: -15, truePeak: -2.4});
const voiceNormalization = `loudnorm=I=-15:TP=-2.4:LRA=9:measured_I=${voiceStats.input_i}:measured_TP=${voiceStats.input_tp}:measured_LRA=${voiceStats.input_lra}:measured_thresh=${voiceStats.input_thresh}:offset=${voiceStats.target_offset}:linear=true:print_format=json`;
const normalizedVoice = path.join(work, 'voice-gapless-normalized.wav');
run(ffmpeg, [
  '-hide_banner', '-loglevel', 'error', '-y', '-i', rawVoice,
  '-af', voiceNormalization, '-ar', String(rate), '-ac', '2', '-c:a', 'pcm_s24le', normalizedVoice,
]);

const cueFrames = edit.cueFrameOverrides;
const missingCueMaps = sourceSound.cues.filter((cue) => !Number.isInteger(cueFrames[cue.id])).map((cue) => cue.id);
if (missingCueMaps.length) throw new Error(`Missing remapped sound cues: ${missingCueMaps.join(', ')}`);

const cueSources = [...new Set(sourceSound.cues.map((cue) => cue.src))];
const audioInputs = ['-i', normalizedVoice, '-i', ambientPath];
for (const source of cueSources) {
  const file = path.join(pub, source);
  if (!fs.existsSync(file)) throw new Error(`Missing sound effect: ${file}`);
  audioInputs.push('-i', file);
}

const mixFilters = [
  `[0:a]aresample=${rate},aformat=channel_layouts=stereo,apad=whole_dur=${duration.toFixed(8)},atrim=duration=${duration.toFixed(8)}[voice]`,
  `[1:a]aresample=${rate},aformat=channel_layouts=stereo,atrim=duration=${duration.toFixed(8)},volume=${sourceSound.ambientGain ?? 0.72}[bed]`,
];
const cueLabels = [];
const remappedCues = sourceSound.cues.map((cue, index) => {
  const frame = cueFrames[cue.id];
  const cueDuration = cue.durationInFrames;
  if (frame < 0 || frame + cueDuration > edit.durationInFrames) {
    throw new Error(`Remapped cue exceeds the composition: ${cue.id} at frame ${frame}`);
  }
  const inputIndex = cueSources.indexOf(cue.src) + 2;
  const seconds = (cueDuration / fps).toFixed(8);
  const delay = Math.round(frame * rate / fps);
  mixFilters.push(`[${inputIndex}:a]aresample=${rate},aformat=channel_layouts=stereo,atrim=start=${((cue.trimBefore ?? 0) / fps).toFixed(8)}:duration=${seconds},asetpts=PTS-STARTPTS,apad=whole_dur=${seconds},atrim=duration=${seconds},volume=${cue.volume},afade=t=in:st=0:d=0.02,afade=t=out:st=${Math.max(0, cueDuration / fps - 0.05).toFixed(8)}:d=0.05,adelay=${delay}S:all=1[s${index}]`);
  cueLabels.push(`[s${index}]`);
  return {...cue, frame};
});

mixFilters.push(`${cueLabels.join('')}amix=inputs=${cueLabels.length}:normalize=0:duration=longest,apad=whole_dur=${duration.toFixed(8)},atrim=duration=${duration.toFixed(8)}[sfx]`);
mixFilters.push(`[voice][bed][sfx]amix=inputs=3:normalize=0:duration=first,alimiter=limit=0.79:level=false:latency=true,atrim=duration=${duration.toFixed(8)},asetpts=PTS-STARTPTS[mix]`);

const premaster = path.join(work, 'mix-gapless-premaster.wav');
run(ffmpeg, [
  '-hide_banner', '-loglevel', 'error', '-y', ...audioInputs,
  '-filter_complex', mixFilters.join(';'), '-map', '[mix]',
  '-ar', String(rate), '-ac', '2', '-c:a', 'pcm_s24le', premaster,
]);

const finalStats = measureLoudness(premaster, {integrated: edit.audio.targetLufs, truePeak: edit.audio.peakLimitDbTp});
const masterFilter = `loudnorm=I=${edit.audio.targetLufs}:TP=${edit.audio.peakLimitDbTp}:LRA=9:measured_I=${finalStats.input_i}:measured_TP=${finalStats.input_tp}:measured_LRA=${finalStats.input_lra}:measured_thresh=${finalStats.input_thresh}:offset=${finalStats.target_offset}:linear=true:print_format=json`;
run(ffmpeg, [
  '-hide_banner', '-loglevel', 'error', '-y', '-i', premaster,
  '-af', masterFilter, '-ar', String(rate), '-ac', '2', '-c:a', 'aac', '-b:a', '256k',
  '-movflags', '+faststart', outputPath,
]);

const deliveredStats = measureLoudness(outputPath, {integrated: edit.audio.targetLufs, truePeak: edit.audio.peakLimitDbTp});
const silenceOutput = run(ffmpeg, [
  '-hide_banner', '-i', normalizedVoice,
  '-af', `silencedetect=noise=${edit.audio.silenceThresholdDb}dB:d=${edit.audio.maximumUnplannedGapSeconds}`,
  '-f', 'null', '-',
], true).stderr;
const silenceEvents = [...silenceOutput.matchAll(/silence_(start|end):\s*([\d.]+)/g)].map((match) => ({type: match[1], seconds: Number(match[2])}));
const silenceRanges = [];
let silenceStart = null;
for (const event of silenceEvents) {
  if (event.type === 'start') silenceStart = event.seconds;
  else if (silenceStart !== null) {
    silenceRanges.push({startSeconds: silenceStart, endSeconds: event.seconds, durationSeconds: Number((event.seconds - silenceStart).toFixed(4))});
    silenceStart = null;
  }
}

const probe = run(ffprobe, [
  '-hide_banner', '-v', 'error', '-i', outputPath,
  '-show_entries', 'format=duration,size', '-of', 'json',
], true);
const media = JSON.parse(probe.stdout);
const audioDuration = Number(media.format.duration);
if (audioDuration < duration - 0.05 || audioDuration > duration + 0.15) {
  throw new Error(`Gapless soundtrack duration does not match the V2 composition: ${audioDuration}s vs ${duration}s.`);
}

fs.writeFileSync(path.join(jobs, 'audio-measurements.json'), JSON.stringify({
  durationSeconds: duration,
  deliveredDurationSeconds: audioDuration,
  deliveredBytes: Number(media.format.size),
  sourceVoice: 'public/ashwagandha/voice.wav',
  deliveredFile: path.relative(project, outputPath),
  voiceBeforeMaster: voiceStats,
  deliveredFileLoudness: deliveredStats,
  sfxCueCount: remappedCues.length,
  ambientGain: sourceSound.ambientGain ?? 0.72,
  musicEnabled: false,
  insertedSilenceFrames: 0,
  intentionallyRetainedSilence: [
    {startSeconds: 0, endSeconds: 0.1, reason: 'short cover while the opening hit plays'},
    {startSeconds: 10.33, durationSeconds: 0.1, reason: 'natural breath between Dr. and Daily'},
  ],
}, null, 2) + '\n');
fs.writeFileSync(path.join(jobs, 'silence-audit.json'), JSON.stringify({
  status: silenceRanges.length ? 'REVIEW_REQUIRED' : 'NO_UNPLANNED_GAP_OVER_0.35S_DETECTED',
  detector: {thresholdDb: edit.audio.silenceThresholdDb, minimumDurationSeconds: edit.audio.maximumUnplannedGapSeconds},
  checkedTrack: 'normalized original V2 dialogue before ambient and SFX',
  authoredSilence: [
    {startSeconds: 0, endSeconds: 0.1, reason: 'intentional real-frame cover'},
    {startSeconds: 10.33, endSeconds: 10.43, reason: 'natural breath between Dr. and Daily'},
  ],
  detectedRanges: silenceRanges,
  subjectiveListening: 'Not independently auditioned by the model; verify in Remotion Studio.',
}, null, 2) + '\n');
fs.writeFileSync(path.join(jobs, 'sound-design-v2-gapless.json'), JSON.stringify({
  ...sourceSound,
  composition: edit.composition,
  version: edit.version,
  cues: remappedCues,
}, null, 2) + '\n');

console.log(`Prepared the V2 gapless soundtrack: ${duration.toFixed(3)} seconds, ${remappedCues.length} remapped SFX cues, ${silenceRanges.length} voice-only gaps above ${edit.audio.maximumUnplannedGapSeconds}s.`);
