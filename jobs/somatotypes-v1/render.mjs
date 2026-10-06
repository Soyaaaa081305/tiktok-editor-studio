import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {path as ffprobe} from 'ffprobe-static';
import {getFfmpegPath} from '../../scripts/runtime-paths.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const job = path.join(root, 'jobs/somatotypes-v1');
const outDir = path.join(root, 'outputs');
const work = path.join(root, 'work-render/somatotypes-v1');
const partsDir = path.join(work, 'parts');
const isolatedPublic = path.join(work, 'public');
const edit = JSON.parse(fs.readFileSync(path.join(job, 'edit-data.json'), 'utf8'));
const ffmpeg = getFfmpegPath();
const cli = path.join(root, 'node_modules/@remotion/cli/remotion-cli.js');
const node = process.execPath;
fs.mkdirSync(outDir, {recursive: true});
fs.mkdirSync(work, {recursive: true});
fs.mkdirSync(partsDir, {recursive: true});

const run = (command, args, capture = false) => {
  const result = spawnSync(command, args, {cwd: root, encoding: 'utf8', stdio: capture ? 'pipe' : 'inherit', windowsHide: true, maxBuffer: 64 * 1024 * 1024});
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${path.basename(command)} failed (${result.status}): ${result.stderr || ''}`);
  return result;
};
const durationSeconds = edit.durationInFrames / edit.fps;
const seconds = (frames) => (frames / edit.fps).toFixed(8);
const uploadVideoSilent = path.join(work, 'somatotypes-v1-1080-silent.mp4');
const masterVideo = path.join(outDir, 'somatotypes-tiktok-v1-4k-master.mp4');
const upload = path.join(outDir, 'somatotypes-tiktok-v1-1080p-upload.mp4');
const cover = path.join(outDir, 'somatotypes-tiktok-v1-cover.png');

if (!process.argv.includes('--skip-audio')) run(node, [path.join(job, 'build-audio.mjs')]);
if (!fs.existsSync(path.join(root, 'public/somatotypes/soundtrack.m4a'))) throw new Error('Missing locally generated narration soundtrack.');

const requiredPublicAssets = [
  'somatotypes/main.mp4',
  'somatotypes/44-dog-tuktuk.jpg',
  'somatotypes/76-a.mp4',
  'somatotypes/64.mp4',
  'somatotypes/sheldon.webp',
  'somatotypes/somatotypes.webp',
  'somatotypes/britannica-screenshot.png',
  'somatotypes/cover-source.jpg',
  'somatotypes/soundtrack.m4a',
  'ashwagandha/inter-900.woff2',
  'ashwagandha/manrope-800.woff2',
];
const renderInputs = [
  'src/SomatotypesEditorial.jsx',
  'src/index-somatotypes.jsx',
  'jobs/somatotypes-v1/edit-data.json',
  'jobs/somatotypes-v1/render.mjs',
  'package.json',
  'pnpm-lock.yaml',
  ...requiredPublicAssets.map((relativeAsset) => `public/${relativeAsset}`),
];
const fingerprintHash = crypto.createHash('sha256');
for (const relativeInput of renderInputs) {
  const inputPath = path.join(root, relativeInput);
  if (!fs.existsSync(inputPath)) throw new Error(`Missing render input: ${relativeInput}`);
  const stat = fs.statSync(inputPath);
  fingerprintHash.update(JSON.stringify({relativeInput, size: stat.size, mtimeMs: stat.mtimeMs}));
}
const fingerprintPath = path.join(work, 'render-input-fingerprint.json');
const fingerprint = fingerprintHash.digest('hex');
let previousFingerprint = null;
if (fs.existsSync(fingerprintPath)) {
  try {
    previousFingerprint = JSON.parse(fs.readFileSync(fingerprintPath, 'utf8')).sha256;
  } catch {
    previousFingerprint = null;
  }
}
if (previousFingerprint !== fingerprint || process.argv.includes('--force')) {
  let invalidated = 0;
  for (const name of fs.readdirSync(partsDir)) {
    if (/^part-\d{4}-\d{4}\.mp4$/.test(name)) {
      fs.rmSync(path.join(partsDir, name), {force: true});
      invalidated += 1;
    }
  }
  fs.writeFileSync(fingerprintPath, JSON.stringify({sha256: fingerprint, inputCount: renderInputs.length, recordedAt: new Date().toISOString()}, null, 2) + '\n');
  console.log(`Render inputs changed; invalidated ${invalidated} old video chunks.`);
}
for (const relativeAsset of requiredPublicAssets) {
  const source = path.join(root, 'public', relativeAsset);
  const destination = path.join(isolatedPublic, relativeAsset);
  if (!fs.existsSync(source)) throw new Error(`Missing required static file: public/${relativeAsset}`);
  fs.mkdirSync(path.dirname(destination), {recursive: true});
  const sourceStat = fs.statSync(source);
  const destinationStat = fs.existsSync(destination) ? fs.statSync(destination) : null;
  if (!destinationStat || destinationStat.size !== sourceStat.size || destinationStat.mtimeMs !== sourceStat.mtimeMs) {
    fs.copyFileSync(source, destination);
    fs.utimesSync(destination, sourceStat.atime, sourceStat.mtime);
  }
}

const chunkFrames = 600;
const expectedChunkFrames = (start, end) => end - start + 1;
const probeChunk = (file) => {
  if (!fs.existsSync(file)) return null;
  try {
    const result = run(ffprobe, [
      '-v', 'error', '-show_entries', 'stream=codec_name,width,height,r_frame_rate,pix_fmt,nb_frames',
      '-of', 'json', file,
    ], true);
    const data = JSON.parse(result.stdout);
    return data.streams.find((stream) => stream.codec_name === 'h264') || null;
  } catch {
    return null;
  }
};

for (let start = 0; start < edit.durationInFrames; start += chunkFrames) {
  const end = Math.min(edit.durationInFrames - 1, start + chunkFrames - 1);
  const expected = expectedChunkFrames(start, end);
  const chunkName = `part-${String(start).padStart(4, '0')}-${String(end).padStart(4, '0')}.mp4`;
  const chunkPath = path.join(partsDir, chunkName);
  const previous = probeChunk(chunkPath);
  if (previous
      && previous.width === edit.width
      && previous.height === edit.height
      && previous.r_frame_rate === `${edit.fps}/1`
      && previous.pix_fmt === 'yuv420p'
      && Number(previous.nb_frames) === expected) {
    console.log(`Checkpoint exists and matches: ${chunkName} (${expected} frames).`);
    continue;
  }
  if (fs.existsSync(chunkPath)) fs.rmSync(chunkPath, {force: true});
  console.log(`Rendering recoverable chunk ${start}-${end} (${expected} frames).`);
  run(node, [
    cli, 'render', 'src/index-somatotypes.jsx', edit.id, chunkPath,
    '--muted', '--codec=h264', '--crf=16', '--x264-preset=medium', '--pixel-format=yuv420p',
    '--color-space=bt709', '--scale=1', '--concurrency=4', '--overwrite', `--frames=${start}-${end}`,
    `--public-dir=${isolatedPublic}`,
  ]);
  const created = probeChunk(chunkPath);
  if (!created || Number(created.nb_frames) !== expected) {
    throw new Error(`Chunk did not validate after render: ${chunkName}; expected ${expected} frames.`);
  }
}

const concatManifest = path.join(work, 'somatotypes-v1-video-parts.ffconcat');
const manifestLines = ['ffconcat version 1.0'];
for (let start = 0; start < edit.durationInFrames; start += chunkFrames) {
  const end = Math.min(edit.durationInFrames - 1, start + chunkFrames - 1);
  const chunkName = `part-${String(start).padStart(4, '0')}-${String(end).padStart(4, '0')}.mp4`;
  const chunkPath = path.join(partsDir, chunkName).replaceAll('\\', '/');
  if (chunkPath.includes("'")) throw new Error('Unexpected apostrophe in render path for FFmpeg concat manifest.');
  manifestLines.push(`file '${chunkPath}'`);
}
fs.writeFileSync(concatManifest, `${manifestLines.join('\n')}\n`, 'utf8');
run(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', concatManifest, '-c', 'copy', '-movflags', '+faststart', uploadVideoSilent]);

const soundtrack = path.join(root, 'public/somatotypes/soundtrack.m4a');
run(ffmpeg, [
  '-hide_banner', '-loglevel', 'error', '-y', '-i', uploadVideoSilent, '-i', soundtrack,
  '-map', '0:v:0', '-map', '1:a:0', '-c:v', 'copy', '-c:a', 'copy', '-t', durationSeconds.toFixed(8),
  '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', '-movflags', '+faststart', upload,
]);
run(ffmpeg, [
  '-hide_banner', '-loglevel', 'error', '-y', '-i', upload,
  '-vf', 'scale=2160:3840:flags=lanczos', '-c:v', 'libx264', '-preset', 'medium', '-crf', '15',
  '-maxrate', '60M', '-bufsize', '120M', '-pix_fmt', 'yuv420p', '-color_primaries', 'bt709',
  '-color_trc', 'bt709', '-colorspace', 'bt709', '-r', String(edit.fps), '-fps_mode', 'cfr',
  '-c:a', 'copy', '-movflags', '+faststart', masterVideo,
]);
run(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', '-i', upload, '-frames:v', '1', '-update', '1', cover]);

function metadata(file) {
  const probe = run(ffprobe, [
    '-v', 'error', '-show_entries',
    'stream=index,codec_type,codec_name,width,height,r_frame_rate,pix_fmt,color_space,color_transfer,color_primaries,sample_rate,channels',
    '-show_entries', 'format=duration,size,bit_rate', '-of', 'json', file,
  ], true);
  const data = JSON.parse(probe.stdout);
  const video = data.streams.find((s) => s.codec_type === 'video');
  const audio = data.streams.find((s) => s.codec_type === 'audio');
  if (!video || video.codec_name !== 'h264') throw new Error(`Missing H.264 video in ${file}`);
  if (video.r_frame_rate !== '60/1') throw new Error(`Frame rate mismatch in ${file}: ${video.r_frame_rate}`);
  if (video.pix_fmt !== 'yuv420p') throw new Error(`Pixel format mismatch in ${file}: ${video.pix_fmt}`);
  if (video.color_primaries !== 'bt709' || video.color_transfer !== 'bt709' || video.color_space !== 'bt709') throw new Error(`Rec.709 tags missing on ${file}`);
  if (!audio || audio.codec_name !== 'aac' || audio.sample_rate !== '48000') throw new Error(`AAC/48 kHz audio missing from ${file}`);
  const expected = file === masterVideo ? [2160, 3840] : [1080, 1920];
  if (video.width !== expected[0] || video.height !== expected[1]) throw new Error(`Unexpected dimensions in ${file}: ${video.width}×${video.height}`);
  const actual = Number(data.format.duration);
  if (Math.abs(actual - durationSeconds) > 0.08) throw new Error(`A/V duration differs from planned ${durationSeconds}s: ${actual}s`);
  run(ffmpeg, ['-hide_banner', '-v', 'error', '-i', file, '-f', 'null', '-'], true);
  return {file: path.relative(root, file).replaceAll('\\', '/'), expectedDurationSeconds: durationSeconds, ...data};
}
const masterMetadata = metadata(masterVideo);
const uploadMetadata = metadata(upload);

const cueAudit = edit.sfx.map((cue) => {
  const start = seconds(cue.frame);
  const duration = cue.durationSeconds.toFixed(4);
  const check = run(ffmpeg, ['-hide_banner', '-ss', start, '-t', duration, '-i', path.join(job, 'sfx-review.wav'), '-af', 'volumedetect', '-f', 'null', '-'], true).stderr;
  const peak = Number(check.match(/max_volume:\s*(-?[\d.]+|inf) dB/)?.[1]);
  if (!Number.isFinite(peak) || peak < -45) throw new Error(`Planned SFX cue has no meaningful signal near frame ${cue.frame} (${peak} dBFS).`);
  return {...cue, peakDbfsInSfxStem: peak, signalPresent: true};
});

const loudnessLog = run(ffmpeg, ['-hide_banner', '-i', upload, '-af', 'loudnorm=I=-14.5:TP=-1.8:LRA=9:print_format=json', '-f', 'null', '-'], true).stderr;
const loudMatch = loudnessLog.match(/\{\s*"input_i"[\s\S]*?\}/);
if (!loudMatch) throw new Error('Could not measure upload-copy integrated loudness.');
const loudness = JSON.parse(loudMatch[0]);
const sha256 = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');

const coverMeta = JSON.parse(run(ffprobe, ['-v', 'error', '-show_entries', 'stream=width,height', '-of', 'json', cover], true).stdout);
if (coverMeta.streams[0]?.width !== 1080 || coverMeta.streams[0]?.height !== 1920) throw new Error('Cover image is not 1080 × 1920.');
const coverage = {
  fps: edit.fps,
  durationInFrames: edit.durationInFrames,
  durationSeconds,
  dialogueSegments: edit.segments.map((s) => ({id: s.id, sourceInFrame: s.sourceStartFrame, sourceOutFrameExclusive: s.sourceEndFrame, outputInFrame: s.outputStartFrame, outputOutFrameExclusive: s.outputStartFrame + s.durationInFrames})),
  authoredSilence: [{outputInFrame: 0, outputOutFrameExclusive: edit.coverFrames, reason: 'authentic 0.1-second cover'}],
  removedSourcePauses: [{startSeconds: 8.133, endSeconds: 13.4}, {startSeconds: 40.6, endSeconds: 43.3}, {startSeconds: 60.133, endSeconds: 62.933}],
  preservedLowSpeech: [{sourceStartSeconds: 64.82, sourceEndSeconds: 65.72, line: 'complete “Okay?”'}],
  uncertainCaption: {sourceStartSeconds: 39.02, sourceEndSeconds: 40.4, decision: 'voice retained, speculative subtitle omitted'},
  speechContinuityMethod: 'source-audio EDL concatenated into the global soundtrack; every visual sequence sits above it',
};
fs.writeFileSync(path.join(job, 'narration-coverage.json'), JSON.stringify(coverage, null, 2) + '\n');
fs.writeFileSync(path.join(job, 'sfx-cue-audit.json'), JSON.stringify({cueCount: cueAudit.length, cues: cueAudit, method: 'measured each cue window in the rendered SFX stem; this confirms signal presence, not subjective audibility'}, null, 2) + '\n');
fs.writeFileSync(path.join(job, 'render-metadata.json'), JSON.stringify({
  composition: edit.id,
  renderInputFingerprint: fingerprint,
  master: masterMetadata,
  upload: uploadMetadata,
  cover: {file: path.relative(root, cover).replaceAll('\\', '/'), width: 1080, height: 1920, sha256: sha256(cover)},
  uploadSha256: sha256(upload),
  masterSha256: sha256(masterVideo),
  uploadAudioLoudness: loudness,
  masterIsUpscale: true,
  sourcePresenterResolution: '1080 × 1920; both source footage and the rendered edit are upscaled for the 4K archive master',
  tiktokRecompression: 'not controllable by the rendered file',
}, null, 2) + '\n');

console.log(`Render verified: ${durationSeconds.toFixed(3)}s; 1080p60 upload; 4K60 upscale master; ${cueAudit.length} SFX windows contain signal.`);
