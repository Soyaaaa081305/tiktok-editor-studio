import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {path as ffprobe} from 'ffprobe-static';
import {getFfmpegPath} from './runtime-paths.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const node = process.execPath;
const ffmpeg = getFfmpegPath();
const job = path.join(root, 'jobs/atc-fish-oil-v4');
const work = path.join(root, 'work-render/atc-fish-oil-v4');
const source = path.join(root, 'public/source.mp4');
const v4Audio = path.join(root, 'public/sound-track-v4-sfx.m4a');
const mixed = path.join(job, 'soundtrack-v4.m4a');
const rate = 48000;

const run = (command, args, cwd = root, capture = false) => {
  const result = spawnSync(command, args, {cwd, encoding: 'utf8', stdio: capture ? 'pipe' : 'inherit', windowsHide: true, maxBuffer: 48 * 1024 * 1024});
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${path.basename(command)} failed (${result.status}): ${result.stderr || ''}`);
  return result;
};
const seconds = (frames, fps) => (frames / fps).toFixed(8);
const parseLoudness = (text) => {
  const match = text.match(/\{\s*"input_i"[\s\S]*?\}/);
  if (!match) throw new Error('FFmpeg did not report integrated loudness.');
  return JSON.parse(match[0]);
};

run(node, ['scripts/prepare-fish-oil-v4.mjs']);
const edit = JSON.parse(fs.readFileSync(path.join(root, 'src/edit-data-v4.json'), 'utf8'));
const design = JSON.parse(fs.readFileSync(path.join(root, 'src/sound-design-v4.json'), 'utf8'));
fs.mkdirSync(job, {recursive: true});
fs.mkdirSync(work, {recursive: true});
if (!fs.existsSync(source)) throw new Error('Original Fish Oil recording is missing.');

if (!process.argv.includes('--skip-audio')) {
  const graph = [`anullsrc=r=${rate}:cl=stereo,atrim=duration=${seconds(edit.posterFrames, edit.fps)},asetpts=PTS-STARTPTS[cover]`];
  const labels = ['[cover]'];
  for (const [index, clip] of edit.edl.entries()) {
    const duration = seconds(clip.durationInFrames, edit.fps);
    if (clip.sourceEndFrame - clip.sourceStartFrame !== clip.durationInFrames) throw new Error(`Source/output frame mismatch in ${clip.id}.`);
    graph.push(`[0:a]atrim=start=${seconds(clip.sourceStartFrame, edit.fps)}:duration=${duration},asetpts=PTS-STARTPTS,afade=t=in:st=0:d=0.015,afade=t=out:st=${Math.max(0, clip.durationInFrames / edit.fps - 0.018).toFixed(8)}:d=0.018[v${index}]`);
    labels.push(`[v${index}]`);
  }
  graph.push(`${labels.join('')}concat=n=${labels.length}:v=0:a=1,highpass=f=75,lowpass=f=15500,afftdn=nr=5:nf=-38,equalizer=f=300:t=q:w=1:g=-1,equalizer=f=2800:t=q:w=1:g=.8,acompressor=threshold=.14:ratio=2:attack=12:release=120:makeup=1[voice]`);
  const rawVoice = path.join(work, 'voice-cut-raw.wav');
  const voice = path.join(work, 'voice-cut-normalized.wav');
  run(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', '-i', source, '-filter_complex', graph.join(';'), '-map', '[voice]', '-ar', String(rate), '-ac', '2', '-c:a', 'pcm_s24le', rawVoice]);
  const voiceStats = parseLoudness(run(ffmpeg, ['-hide_banner', '-i', rawVoice, '-af', 'loudnorm=I=-15:TP=-2.4:LRA=9:print_format=json', '-f', 'null', '-'], root, true).stderr);
  const normalizeVoice = `loudnorm=I=-15:TP=-2.4:LRA=9:measured_I=${voiceStats.input_i}:measured_TP=${voiceStats.input_tp}:measured_LRA=${voiceStats.input_lra}:measured_thresh=${voiceStats.input_thresh}:offset=${voiceStats.target_offset}:linear=true:print_format=json`;
  run(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', '-i', rawVoice, '-af', normalizeVoice, '-ar', String(rate), '-ac', '2', '-c:a', 'pcm_s24le', voice]);

  const sfxFiles = [...new Set(design.cues.map((cue) => cue.src))];
  const inputs = ['-i', voice];
  for (const file of sfxFiles) {
    const absolute = path.join(root, 'public', file);
    if (!fs.existsSync(absolute)) throw new Error(`Selected sound effect is missing: ${file}`);
    inputs.push('-i', absolute);
  }
  const mix = ['[0:a]aresample=48000,aformat=channel_layouts=stereo[voice]'];
  const cueLabels = [];
  for (const [index, cue] of design.cues.entries()) {
    const duration = seconds(cue.durationInFrames, edit.fps);
    const delay = Math.round(cue.frame * rate / edit.fps);
    const sourceIndex = sfxFiles.indexOf(cue.src) + 1;
    mix.push(`[${sourceIndex}:a]aresample=48000,aformat=channel_layouts=stereo,atrim=start=${seconds(cue.trimBefore ?? 0, edit.fps)}:duration=${duration},asetpts=PTS-STARTPTS,apad=whole_dur=${duration},atrim=duration=${duration},volume=${cue.volume},afade=t=in:st=0:d=0.012,afade=t=out:st=${Math.max(0, cue.durationInFrames / edit.fps - 0.025).toFixed(8)}:d=0.025,adelay=${delay}S:all=1[s${index}]`);
    cueLabels.push(`[s${index}]`);
  }
  const fullDuration = seconds(edit.durationInFrames, edit.fps);
  mix.push(`${cueLabels.join('')}amix=inputs=${cueLabels.length}:normalize=0:duration=longest,apad=whole_dur=${fullDuration},atrim=duration=${fullDuration},asplit=2[sfxForMix][sfxProof]`);
  mix.push(`[voice][sfxForMix]amix=inputs=2:normalize=0:duration=first,alimiter=limit=.92:level=false:latency=true,atrim=duration=${fullDuration},asetpts=PTS-STARTPTS[mix]`);
  const preMaster = path.join(work, 'mix-pre-master.wav');
  const sfxStem = path.join(job, 'sfx-stem.wav');
  run(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', ...inputs, '-filter_complex', mix.join(';'), '-map', '[mix]', '-ar', String(rate), '-ac', '2', '-c:a', 'pcm_s24le', preMaster, '-map', '[sfxProof]', '-ar', String(rate), '-ac', '2', '-c:a', 'pcm_s24le', sfxStem]);
  const beforeMaster = parseLoudness(run(ffmpeg, ['-hide_banner', '-i', preMaster, '-af', 'loudnorm=I=-14.5:TP=-1.8:LRA=9:print_format=json', '-f', 'null', '-'], root, true).stderr);
  const mastering = `loudnorm=I=-14.5:TP=-1.8:LRA=9:measured_I=${beforeMaster.input_i}:measured_TP=${beforeMaster.input_tp}:measured_LRA=${beforeMaster.input_lra}:measured_thresh=${beforeMaster.input_thresh}:offset=${beforeMaster.target_offset}:linear=true:print_format=json`;
  run(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', '-i', preMaster, '-af', mastering, '-ar', String(rate), '-ac', '2', '-c:a', 'aac', '-b:a', '256k', '-movflags', '+faststart', mixed]);
  fs.copyFileSync(mixed, v4Audio);

  const deliveredAudio = parseLoudness(run(ffmpeg, ['-hide_banner', '-i', mixed, '-af', 'loudnorm=I=-14.5:TP=-1.8:LRA=9:print_format=json', '-f', 'null', '-'], root, true).stderr);
  const silenceLog = run(ffmpeg, ['-hide_banner', '-i', voice, '-af', 'silencedetect=noise=-42dB:d=0.35', '-f', 'null', '-'], root, true).stderr;
  const events = [...silenceLog.matchAll(/silence_(start|end):\s*([\d.]+)/g)].map((match) => ({type: match[1], seconds: Number(match[2])}));
  const ranges = [];
  let start = null;
  for (const event of events) {
    if (event.type === 'start') start = event.seconds;
    else if (start !== null) { ranges.push({startSeconds: start, endSeconds: event.seconds, durationSeconds: Number((event.seconds - start).toFixed(4))}); start = null; }
  }
  const silenceAudit = {
    status: ranges.length ? 'REVIEW_REQUIRED' : 'NO_UNPLANNED_GAP_OVER_0.35S_DETECTED',
    detector: {thresholdDb: -42, minimumDurationSeconds: 0.35},
    checkedTrack: 'normalized edited original dialogue before SFX',
    intentionalSilence: [{startSeconds: 0, endSeconds: edit.posterFrames / edit.fps, reason: 'genuine cover hold'}],
    detectedRanges: ranges,
    subjectiveListening: 'UNVERIFIED: the render environment can analyze audio but cannot listen to it subjectively.',
  };
  fs.writeFileSync(path.join(job, 'silence-audit.json'), JSON.stringify(silenceAudit, null, 2) + '\n');
  fs.writeFileSync(path.join(job, 'audio-measurements.json'), JSON.stringify({durationSeconds: edit.durationInFrames / edit.fps, format: 'AAC stereo 48 kHz, 256 kbit/s', voiceBeforeMaster: voiceStats, deliveredAudio, sfxCueCount: design.cues.length, music: false, authoredSilentCoverFrames: edit.posterFrames, detectedSilenceRanges: ranges}, null, 2) + '\n');
  console.log(`Prepared the finished speech and ${design.cues.length} SFX cues. Delivered mix: ${deliveredAudio.input_i} LUFS integrated, ${deliveredAudio.input_tp} dBTP true peak.`);
}

if (process.argv.includes('--audio-only')) process.exit(0);
if (!fs.existsSync(v4Audio)) throw new Error('Final audio is missing; prepare the mix before rendering.');

const cli = path.join(root, 'node_modules/@remotion/cli/remotion-cli.js');
const silent4k = path.join(work, 'atc-fish-oil-v4-4k-silent.mp4');
const duration = seconds(edit.durationInFrames, edit.fps);
run(node, [cli, 'render', 'ATCFishOilV4', silent4k, '--muted', '--codec=h264', '--crf=16', '--x264-preset=medium', '--pixel-format=yuv420p', '--color-space=bt709', '--scale=2', '--concurrency=4', '--overwrite']);

const master = path.join(job, 'atc-fish-oil-v4-4k-master.mp4');
run(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', '-i', silent4k, '-i', v4Audio, '-map', '0:v:0', '-map', '1:a:0', '-c:v', 'copy', '-c:a', 'copy', '-t', duration, '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', '-movflags', '+faststart', master]);
const upload = path.join(job, 'atc-fish-oil-v4-1080p-upload.mp4');
run(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', '-i', master, '-vf', 'scale=1080:1920:flags=lanczos', '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-maxrate', '20M', '-bufsize', '40M', '-pix_fmt', 'yuv420p', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', '-r', '60', '-fps_mode', 'cfr', '-c:a', 'aac', '-b:a', '256k', '-ar', String(rate), '-movflags', '+faststart', upload]);
for (const file of [master, upload]) {
  run(ffmpeg, ['-hide_banner', '-v', 'error', '-i', file, '-f', 'null', '-']);
  const info = JSON.parse(run(ffprobe, ['-v', 'error', '-show_entries', 'stream=codec_name,width,height,r_frame_rate,pix_fmt,color_space,color_transfer,color_primaries,sample_rate,channels', '-show_entries', 'format=duration,size', '-of', 'json', file], root, true).stdout);
  const video = info.streams.find((stream) => stream.codec_name === 'h264');
  const audio = info.streams.find((stream) => stream.codec_name === 'aac');
  if (!video || !audio || video.pix_fmt !== 'yuv420p' || video.r_frame_rate !== '60/1') throw new Error(`Unexpected export streams or format: ${file}`);
  if (Number(info.format.duration) < edit.durationInFrames / edit.fps - .05 || Number(info.format.duration) > edit.durationInFrames / edit.fps + .15) throw new Error(`Unexpected duration in ${file}`);
  if (file === master && (video.width !== 2160 || video.height !== 3840)) throw new Error('4K master does not have the planned 2160×3840 vertical dimensions.');
  if (file === upload && (video.width !== 1080 || video.height !== 1920)) throw new Error('TikTok upload does not have the planned 1080×1920 dimensions.');
  fs.writeFileSync(file + '.metadata.json', JSON.stringify(info, null, 2) + '\n');
}
const cover = path.join(job, 'atc-fish-oil-v4-cover.png');
run(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', '-i', master, '-frames:v', '1', '-update', '1', cover]);
console.log(`Decoded and verified the 4K60 master and 1080p60 TikTok Studio file in ${job}.`);
