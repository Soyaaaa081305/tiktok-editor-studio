import {createHash} from 'node:crypto';
import {createReadStream} from 'node:fs';
import {mkdir, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import ffprobe from 'ffprobe-static';
import {getFfmpegPath} from '../../scripts/runtime-paths.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const input = path.join(root, 'outputs', 'creatine-tiktok-v3.mp4');
const master = path.join(root, 'outputs', 'creatine-tiktok-v3-4k-master.mp4');
const cover = path.join(root, 'outputs', 'creatine-cover-v3-4k.png');
const work = path.join(root, 'work', 'creatine-2026-10-06', '4k-review');
const ffmpeg = getFfmpegPath();

await mkdir(path.dirname(master), {recursive: true});
await mkdir(work, {recursive: true});

const run = (command, args, {capture = false} = {}) => {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: 'utf8',
    stdio: capture ? 'pipe' : 'inherit',
    windowsHide: true,
    maxBuffer: 16 * 1024 * 1024,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`${path.basename(command)} failed (${result.status}): ${result.stderr || ''}`);
  }
  return result;
};

const probe = (file) => {
  const result = run(ffprobe.path, [
    '-v', 'error',
    '-show_entries', 'format=duration,size,bit_rate:stream=codec_name,codec_type,width,height,r_frame_rate,avg_frame_rate,nb_frames,pix_fmt,color_space,color_transfer,color_primaries,channels,sample_rate',
    '-of', 'json', file,
  ], {capture: true});
  return JSON.parse(result.stdout);
};

const original = probe(input);
const originalVideo = original.streams.find((stream) => stream.codec_type === 'video');
const originalAudio = original.streams.find((stream) => stream.codec_type === 'audio');
if (!originalVideo || originalVideo.width !== 1080 || originalVideo.height !== 1920 || originalVideo.r_frame_rate !== '60/1') {
  throw new Error('Expected the verified 1080 × 1920, 60 fps Creatine V3 upload export.');
}
if (!originalAudio || originalAudio.codec_name !== 'aac' || originalAudio.sample_rate !== '48000' || originalAudio.channels !== 2) {
  throw new Error('Expected the final stereo AAC/48 kHz mix in the Creatine V3 export.');
}

console.log('Upscaling the verified 1080p60 picture to a 2160 × 3840 archive master; preserving its AAC audio stream.');
run(ffmpeg, [
  '-hide_banner', '-loglevel', 'warning', '-y', '-i', input,
  '-map', '0:v:0', '-map', '0:a:0',
  '-vf', 'scale=2160:3840:flags=lanczos',
  '-c:v', 'libx264', '-preset', 'medium', '-crf', '15', '-maxrate', '60M', '-bufsize', '120M',
  '-pix_fmt', 'yuv420p', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709',
  '-r', '60', '-fps_mode', 'cfr', '-c:a', 'copy', '-movflags', '+faststart', master,
]);

run(ffmpeg, [
  '-hide_banner', '-loglevel', 'error', '-y', '-i', master,
  '-vf', 'select=eq(n\\,2)', '-frames:v', '1', '-update', '1', cover,
]);

const output = probe(master);
const video = output.streams.find((stream) => stream.codec_type === 'video');
const audio = output.streams.find((stream) => stream.codec_type === 'audio');
const expectedFrames = Number(originalVideo.nb_frames);
if (!video || video.codec_name !== 'h264' || video.width !== 2160 || video.height !== 3840 || video.r_frame_rate !== '60/1' || video.avg_frame_rate !== '60/1' || video.pix_fmt !== 'yuv420p' || Number(video.nb_frames) !== expectedFrames) {
  throw new Error(`Unexpected 4K master video stream: ${JSON.stringify(video)}`);
}
if (video.color_primaries !== 'bt709' || video.color_transfer !== 'bt709' || video.color_space !== 'bt709') {
  throw new Error('Rec.709 tags are missing on the 4K archive master.');
}
if (!audio || audio.codec_name !== 'aac' || audio.sample_rate !== '48000' || audio.channels !== 2) {
  throw new Error(`Unexpected 4K master audio stream: ${JSON.stringify(audio)}`);
}
if (Math.abs(Number(output.format.duration) - Number(original.format.duration)) > 0.02) {
  throw new Error(`4K master duration ${output.format.duration}s differs from V3 ${original.format.duration}s.`);
}

console.log('Fully decoding the 4K master.');
run(ffmpeg, ['-hide_banner', '-v', 'error', '-i', master, '-f', 'null', '-'], {capture: true});

const audioInput = path.join(work, 'v3-audio-check.aac');
const audioOutput = path.join(work, '4k-audio-check.aac');
for (const [source, destination] of [[input, audioInput], [master, audioOutput]]) {
  run(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', '-i', source, '-map', '0:a:0', '-c:a', 'copy', '-f', 'adts', destination], {capture: true});
}
const digest = async (file) => {
  const hash = createHash('sha256');
  for await (const chunk of createReadStream(file)) hash.update(chunk);
  return hash.digest('hex');
};
const [originalAudioSha256, masterAudioSha256, masterSha256, coverSha256] = await Promise.all([
  digest(audioInput), digest(audioOutput), digest(master), digest(cover),
]);
if (originalAudioSha256 !== masterAudioSha256) throw new Error('The AAC audio stream changed during the 4K upscale.');

const coverInfo = probe(cover);
const coverVideo = coverInfo.streams[0];
if (coverVideo.width !== 2160 || coverVideo.height !== 3840) throw new Error('The 4K cover dimensions are incorrect.');

const review = {
  input: path.relative(root, input).replaceAll('\\', '/'),
  output: path.relative(root, master).replaceAll('\\', '/'),
  cover: path.relative(root, cover).replaceAll('\\', '/'),
  sourceDimensions: `${originalVideo.width}x${originalVideo.height}`,
  outputDimensions: `${video.width}x${video.height}`,
  fps: video.r_frame_rate,
  frames: Number(video.nb_frames),
  durationSeconds: Number(output.format.duration),
  videoCodec: video.codec_name,
  pixelFormat: video.pix_fmt,
  color: `${video.color_primaries}/${video.color_transfer}/${video.color_space}`,
  audio: `${audio.codec_name}, ${audio.sample_rate} Hz, ${audio.channels} channels, copied unchanged`,
  audioBitstreamSha256MatchesV3: true,
  fullDecode: 'passed',
  masterBytes: Number(output.format.size),
  masterSha256,
  coverSha256,
  interpretation: '4K upscale from 1080p; no additional source detail is created.',
};
await writeFile(path.join(work, 'review.json'), `${JSON.stringify(review, null, 2)}\n`, 'utf8');
console.log(JSON.stringify(review, null, 2));
