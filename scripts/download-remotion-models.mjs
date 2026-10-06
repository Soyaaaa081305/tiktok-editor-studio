import {mkdir, readdir, stat, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {env} from '@huggingface/transformers';
import {
  downloadWhisperModel,
  getAvailableModels as getWhisperModels,
  isWhisperModelCached,
} from '@remotion/whisper-webgpu';
import {
  downloadVideoMattingModel,
  getAvailableModels as getMattingModels,
  isVideoMattingModelCached,
} from '@remotion/video-matting';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cacheDir = path.join(projectRoot, 'models', 'remotion-transformers');

// Use a project-local file cache so the models are reusable by this project
// and do not silently land inside node_modules or a browser-only cache.
await mkdir(cacheDir, {recursive: true});
env.cacheDir = cacheDir;
env.useFSCache = true;
env.useBrowserCache = false;
env.useCustomCache = false;

const tasks = [
  ...getWhisperModels().map((model) => ({
    kind: 'Whisper transcription',
    model: model.name,
    modelId: model.modelId,
    sizeBytes: model.webGpuDownloadSize,
    download: downloadWhisperModel,
    verify: isWhisperModelCached,
  })),
  ...getMattingModels().map((model) => ({
    kind: 'Video matting',
    model: model.name,
    modelId: model.modelId,
    sizeBytes: model.webGpuDownloadSize,
    download: downloadVideoMattingModel,
    verify: isVideoMattingModelCached,
  })),
];

const totalBytes = tasks.reduce((sum, task) => sum + task.sizeBytes, 0);
console.log(`Model cache: ${cacheDir}`);
console.log(`Preparing ${tasks.length} Remotion-supported models (${(totalBytes / 1e9).toFixed(2)} GB advertised total).`);

const results = [];
for (const task of tasks) {
  console.log(`\n${task.kind}: ${task.model} (${(task.sizeBytes / 1e6).toFixed(0)} MB)`);
  let lastReportedBucket = -1;
  const result = await task.download({
    model: task.model,
    onProgress: ({progress, loadedBytes, totalBytes: fileBytes}) => {
      const bucket = Math.floor(progress * 10);
      if (bucket > lastReportedBucket) {
        lastReportedBucket = bucket;
        console.log(`  ${Math.min(bucket * 10, 100)}% · ${(loadedBytes / 1e6).toFixed(0)} / ${(fileBytes / 1e6).toFixed(0)} MB`);
      }
    },
  });
  const cachedAfterDownload = await task.verify({model: task.model});
  if (!cachedAfterDownload) {
    throw new Error(`Remotion cache check failed for ${task.model}.`);
  }
  results.push({
    kind: task.kind,
    model: task.model,
    modelId: task.modelId,
    advertisedDownloadBytes: task.sizeBytes,
    alreadyDownloaded: result.alreadyDownloaded,
    cachedAfterDownload,
    checkedAt: new Date().toISOString(),
  });
  console.log(result.alreadyDownloaded ? '  Already cached and verified.' : '  Download complete and cache verified.');
}

const measureCacheBytes = async (directory) => {
  const entries = await readdir(directory, {withFileTypes: true});
  let total = 0;
  for (const entry of entries) {
    if (entry.name === 'remotion-models-manifest.json') continue;
    const entryPath = path.join(directory, entry.name);
    total += entry.isDirectory()
      ? await measureCacheBytes(entryPath)
      : (await stat(entryPath)).size;
  }
  return total;
};
const cacheBytesOnDisk = await measureCacheBytes(cacheDir);

const manifest = {
  generatedAt: new Date().toISOString(),
  cacheDir,
  cacheBytesOnDisk,
  note: 'Each model was confirmed with the matching Remotion cache-check API. Hardware/WebGPU support and model licenses are separate checks.',
  models: results,
};
await writeFile(
  path.join(cacheDir, 'remotion-models-manifest.json'),
  `${JSON.stringify(manifest, null, 2)}\n`,
  'utf8',
);
console.log(`\nManifest written to ${path.join(cacheDir, 'remotion-models-manifest.json')}`);
