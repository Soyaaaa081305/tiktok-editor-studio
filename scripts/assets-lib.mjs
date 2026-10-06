import {createReadStream, existsSync} from 'node:fs';
import {readFile, stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const manifest = JSON.parse(await readFile(path.join(root, 'assets-manifest.json'), 'utf8'));
export const sha256 = async (file) => {
  const hash = createHash('sha256');
  for await (const chunk of createReadStream(file)) hash.update(chunk);
  return hash.digest('hex');
};
export const assetPath = (relative) => {
  if (!/^(public\/|outputs\/)/.test(relative) || relative.split('/').some(p => p === '..') || relative.includes('\\')) {
    throw new Error(`Invalid asset path: ${relative}`);
  }
  const resolved = path.resolve(root, relative);
  if (!resolved.startsWith(root + path.sep)) throw new Error('Asset path escaped the project.');
  return resolved;
};
export const checkEntries = async (archives, {quick = false} = {}) => {
  const failures = [];
  let count = 0;
  for (const archive of archives) {
    for (const entry of archive.entries) {
      const file = assetPath(entry.path);
      if (!existsSync(file)) failures.push({path: entry.path, reason: 'missing'});
      else if ((await stat(file)).size !== entry.bytes) failures.push({path: entry.path, reason: 'size differs'});
      else if (!quick && await sha256(file) !== entry.sha256) failures.push({path: entry.path, reason: 'checksum differs'});
      count++;
    }
  }
  return {count, failures};
};
