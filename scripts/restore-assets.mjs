import {spawnSync} from 'node:child_process';
import {existsSync} from 'node:fs';
import {mkdir, rename} from 'node:fs/promises';
import path from 'node:path';
import {root, manifest, sha256, checkEntries} from './assets-lib.mjs';

const args = process.argv.slice(2);
if (args.includes('--help')) {
  console.log('Restore private release media and finished exports. Flags: --media-only, --exports-only, --from <download-folder>, --force. Requires gh auth login for downloading.');
  process.exit(0);
}
if (args.includes('--media-only') && args.includes('--exports-only')) throw new Error('Choose one asset group or omit both flags.');
const fromIndex = args.indexOf('--from');
if (fromIndex >= 0 && (!args[fromIndex + 1] || args[fromIndex + 1].startsWith('--'))) throw new Error('--from requires a folder.');
const directory = fromIndex >= 0 ? path.resolve(args[fromIndex + 1]) : path.join(root, '.cache/assets');
const archives = manifest.archives.filter(a => !args.includes('--media-only') || a.kind === 'media').filter(a => !args.includes('--exports-only') || a.kind === 'exports');
await mkdir(directory, {recursive: true});

const run = (command, parameters, options = {}) => {
  const result = spawnSync(command, parameters, {cwd: root, stdio: 'inherit', windowsHide: true, ...options});
  if (result.error || result.status !== 0) throw new Error(`${command} failed. ${result.error?.message || `Exit ${result.status}`}`);
};
for (const archive of archives) {
  const before = await checkEntries([archive]);
  if (!before.failures.length) {
    console.log(`${archive.kind}: already restored and verified.`);
    continue;
  }
  const modified = before.failures.filter(item => item.reason !== 'missing');
  if (modified.length && !args.includes('--force')) throw new Error(`${modified.length} existing ${archive.kind} file(s) differ. Back up your changes, then explicitly use --force to restore this snapshot.`);
  if (path.basename(archive.file) !== archive.file) throw new Error('Invalid archive filename.');
  const file = path.join(directory, archive.file);
  if (existsSync(file) && await sha256(file) !== archive.sha256) {
    if (fromIndex >= 0) throw new Error(`Checksum mismatch: ${file}. Download the intact release archive.`);
    await rename(file, `${file}.invalid-${Date.now()}`);
  }
  if (!existsSync(file)) {
    if (fromIndex >= 0) throw new Error(`Missing downloaded archive: ${file}`);
    console.log(`Downloading ${archive.kind} from the private ${manifest.release} release...`);
    run('gh', ['release', 'download', manifest.release, '--repo', manifest.repository, '--pattern', archive.file, '--dir', directory]);
  }
  if (await sha256(file) !== archive.sha256) throw new Error(`Archive checksum mismatch: ${archive.file}`);
  console.log(`Extracting verified ${archive.file}...`);
  if (process.platform === 'win32') {
    const extract = `
      $ErrorActionPreference='Stop'
      Add-Type -AssemblyName System.IO.Compression.FileSystem
      $rootPath=[System.IO.Path]::GetFullPath($env:TIKTOK_ASSET_TARGET).TrimEnd([System.IO.Path]::DirectorySeparatorChar)+[System.IO.Path]::DirectorySeparatorChar
      $archive=[System.IO.Compression.ZipFile]::OpenRead($env:TIKTOK_ASSET_ARCHIVE)
      try {
        foreach($entry in $archive.Entries) {
          $destination=[System.IO.Path]::GetFullPath([System.IO.Path]::Combine($rootPath,$entry.FullName))
          if (!$destination.StartsWith($rootPath,[System.StringComparison]::OrdinalIgnoreCase)) { throw 'Archive path escaped the project.' }
          if ($entry.FullName.EndsWith('/')) { [System.IO.Directory]::CreateDirectory($destination) | Out-Null; continue }
          [System.IO.Directory]::CreateDirectory([System.IO.Path]::GetDirectoryName($destination)) | Out-Null
          [System.IO.Compression.ZipFileExtensions]::ExtractToFile($entry,$destination,$true)
        }
      } finally { $archive.Dispose() }
    `;
    run('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', extract], {env: {...process.env, TIKTOK_ASSET_ARCHIVE: file, TIKTOK_ASSET_TARGET: root}});
  } else {
    run('unzip', ['-q', '-o', file, '-d', root]);
  }
  const after = await checkEntries([archive]);
  if (after.failures.length) throw new Error(`Restore verification failed: ${JSON.stringify(after.failures)}`);
  console.log(`${archive.kind}: ${after.count} restored files match the original snapshot.`);
}
