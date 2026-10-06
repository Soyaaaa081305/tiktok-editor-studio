import {spawnSync} from 'node:child_process';
import {existsSync} from 'node:fs';
import bundledFfmpeg from 'ffmpeg-static';

export const getFfmpegPath = () => {
  const candidates = process.env.FFMPEG_PATH
    ? [process.env.FFMPEG_PATH]
    : [bundledFfmpeg, 'ffmpeg'];
  for (const candidate of candidates.filter(Boolean)) {
    if (candidate !== 'ffmpeg' && !existsSync(candidate)) continue;
    const result = spawnSync(candidate, ['-version'], {encoding: 'utf8', windowsHide: true});
    if (!result.error && result.status === 0) return candidate;
  }
  throw new Error('FFmpeg could not run. Reinstall the locked dependencies; on Mac, brew install ffmpeg and set FFMPEG_PATH to its executable if needed.');
};
