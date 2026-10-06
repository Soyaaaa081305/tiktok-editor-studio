# TikTok Production Studio

Private production workflow for original, science-based Taglish TikTok videos.
Includes the actual editable ATC Fish Oil and Ashwagandha projects, the v5
science scripting and production prompts, and the installed animation source
library. The matching private release carries the footage and finished videos.

## Mac: download and open the same project

Install [Homebrew](https://brew.sh) if you do not have it. Then in Terminal:

```sh
brew install gh
gh auth login --hostname github.com --git-protocol https --web
gh repo clone Soyaaaa081305/tiktok-production-studio
cd tiktok-production-studio
bash scripts/setup-mac.sh --studio
```

Sign in as **Soyaaaa081305**, or an account you explicitly give access to. The
setup helper installs the pinned Node and pnpm versions, restores the private
media, checks every media checksum and SFX reference, then starts Studio.
Open **http://localhost:3000/AshwagandhaEditorial**. The project root contains
the Remotion config that also registers the Remocn element catalog.

Everyday use after setup:

```sh
bash scripts/run-mac.sh studio
bash scripts/run-mac.sh reproduce:ashwagandha
bash scripts/run-mac.sh reproduce:fish-oil
```

The two render commands write new files inside this checkout's `outputs/`.
They reuse the preserved finished soundtracks, including their audible SFX.
They do not require another transcription, research pass or reference review.

## Download the finished videos only

The release provides `exports-v1.0.0.zip`: both current final MP4s and covers,
copied without re-encoding. Restore to `outputs/baseline/` with:

```sh
node scripts/restore-assets.mjs --exports-only
```

This needs Node and an authenticated `gh`, but no Remotion dependency install.
You can also download the ZIP from the private repository's **Releases** page
while signed into your GitHub account. A GitHub **Download ZIP** of the code
does not include the large media: also download the release assets, or run
the restore helper. If you downloaded both archives manually:

```sh
node scripts/restore-assets.mjs --from /path/to/downloaded/archives
```

## What is saved

| Location | Purpose |
|---|---|
| `prompts/03-topic-to-script-prompt.md` | Research a topic and produce a 45â€“60s read-ready Taglish script with 1â€“3 studies |
| `prompts/04-master-production-system-prompt.md` | Analyze a recording, save its exact edit plan, execute and review the edit |
| `prompts/house-style.json` | Defaults for captions, layouts, cover, SFX and review |
| `prompts/01-style-card-smartfit-enver.md` | Cached SmartFit/Enver and News Daddy observations and access limits |
| `src/ashwagandha/` | Current clean editorial scenes, captions, frame timings and SFX cues |
| `src/ATCFishOilV3.jsx` | Current Fish Oil full-screen motion graphics and caption composition |
| `src/components/remocn/`, `src/lib/` | Previously downloaded editable animation and helper sources |
| `assets-manifest.json` | Release archive and individual media SHA-256 checksums |
| `docs/` | Portability, media provenance, workflow and reproduction notes |
| Private release `v1.0.0` | Original recordings, used assets, fonts, soundtracks, final MP4s and covers |

## Use the same workflow for a new video

Open this repository as a project in Codex or another execution-capable editor.
Use the scripting prompt with your topic, photos/labels and any studies. Read
the resulting script and record. Then use the production master with your
recording and source pack; `EDIT_AND_EXPORT` is the default. It saves the exact
recording-specific execution prompt and plans before implementing the edit.

The two main prompts are complete on their own. The additional numbered files
are supporting records or compatibility pointers. This repository's
`AGENTS.md` helps a coding agent find the same workflow automatically.

Future defaults: real footage, minimal editorial graphics, useful upper
inserts/lower presenter, light phrase captions, selective large keywords,
purposeful audible SFX, **no added music**, and a real cover at frame 0 for
about 0.1 second before the moving hook. Cache reference style; research new
claims for each new science topic.

## Versions and reproduction

- Node **24.19.0**, pnpm **11.19.0**.
- Remotion packages **4.0.533**, React **19.3.0**, with a committed lockfile.
- Install with `pnpm install --frozen-lockfile`; Mac downloads its own native
  dependencies. Windows `node_modules` is not part of the repository.
- Current Ashwagandha: **2014 frames, 60 fps, 1080 Ã— 1920**. The original
  recording is longer; the existing edited snapshot is about 33.6 seconds.
- The downloaded final MP4s are the exact existing delivered files. A fresh
  render preserves the source, scene timing and premixed audio; encoder and
  system font differences can change bytes across operating systems. The
  clean Ashwagandha layout uses the included Inter fonts. Older Fish Oil
  layouts use Arial/Arial Black; their font rendering may differ on a Mac.
- The saved Ashwagandha soundtrack includes the prior quiet original music
  bed. This is preserved for reproduction. The v5 production prompt's default
  of no added music applies to **new** work.
- This transfer was assembled and checked on Windows. Actual execution on
  your Mac is a separate check; see `docs/PORTABILITY.md`.

## Other commands

```sh
pnpm assets:restore       # restore and hash-check both private ZIPs
pnpm assets:verify        # hash-check media and baseline exports again
pnpm check:project               # check dependencies, media and all mapped SFX
pnpm render:ashwagandha    # regenerate its original audio, then render
pnpm render:v3            # regenerate Fish Oil dialogue + SFX, then render
pnpm models:download      # optional model cache; approximately 10 GB
pnpm sfx:download         # optional full Remotion SFX catalog; review rights per sound
```

Current projects do not need the optional models to preview or reproduce.
Keep new recordings under `public/` locally and update the asset manifest and
private release if you need to move those new edits between computers. These
folders are deliberately ignored by Git to keep large footage out of commits.
See [GitHub's file size guidance](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github)
and [release asset limits](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases).

On Windows: install the pinned Node/pnpm and GitHub CLI, authenticate, clone,
then run `pnpm install --frozen-lockfile`, `pnpm setup:project`, and `pnpm studio`.
