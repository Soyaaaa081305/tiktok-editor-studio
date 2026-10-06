import {spawnSync} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const run = (args, {capture = false} = {}) => {
  const result = spawnSync('git', args, {
    cwd: root,
    encoding: 'utf8',
    stdio: capture ? 'pipe' : 'inherit',
    windowsHide: true,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    const detail = result.stderr?.trim() || result.stdout?.trim() || `exit code ${result.status}`;
    throw new Error(`git ${args.join(' ')} failed: ${detail}`);
  }
  return result.stdout?.trim() ?? '';
};

const fail = (message) => {
  console.error(`\nTikTok Editor update stopped: ${message}`);
  console.error('Resolve this GitHub sync issue, then run pnpm studio again.');
  process.exit(1);
};

try {
  const gitRoot = run(['rev-parse', '--show-toplevel'], {capture: true});
  const canonical = (value) => {
    const resolved = path.resolve(value).replace(/[\\/]+$/, '');
    return process.platform === 'win32' ? resolved.toLowerCase() : resolved;
  };
  if (canonical(gitRoot) !== canonical(root)) fail('This folder is not the root of its Git checkout.');

  const branch = run(['branch', '--show-current'], {capture: true});
  if (!branch) fail('This checkout is detached from a branch.');

  let upstream;
  try {
    upstream = run(['rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{u}'], {capture: true});
  } catch {
    fail(`Branch "${branch}" has no GitHub tracking branch.`);
  }
  if (!upstream.startsWith('origin/')) fail(`Expected an origin tracking branch, found "${upstream}".`);

  console.log(`Checking GitHub updates for ${upstream}...`);
  run(['fetch', '--prune', 'origin']);

  const [ahead, behind] = run(['rev-list', '--left-right', '--count', `HEAD...${upstream}`], {capture: true})
    .split(/\s+/)
    .map(Number);
  if (ahead > 0 && behind > 0) fail(`This branch and ${upstream} have diverged. Resolve the branch before opening Studio.`);

  if (behind > 0) {
    const changedFiles = run(['status', '--porcelain', '--untracked-files=no'], {capture: true});
    if (changedFiles) fail('There are uncommitted tracked edits. Commit or save them before syncing, so the update cannot overwrite your work.');
    run(['merge', '--ff-only', upstream]);
    console.log(`Updated to the latest ${upstream} version.`);
  } else if (ahead > 0) {
    console.log(`This local branch is ahead of ${upstream}; keeping its newer local commits.`);
  } else {
    console.log('This project is already current with GitHub.');
  }
} catch (error) {
  fail(error.message);
}
