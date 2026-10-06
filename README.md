# TikTok Production Studio

Portable private Remotion project for the creator’s original science-based Taglish videos. It includes editable Ashwagandha, ATC Fish Oil, Creatine myths, and Somatotypes cuts, reusable research and production prompts, creator/Spark context, and the local animation library.

## Download on Mac

Sign in to the private repository as `Soyaaaa081305` or an account with access, then clone and restore its media/export archives:

```sh
brew install gh
gh auth login --hostname github.com --git-protocol https --web
gh repo clone Soyaaaa081305/tiktok-production-studio
cd tiktok-production-studio
bash scripts/setup-mac.sh --studio
```

The setup installs the pinned Node and pnpm versions, downloads and checks the original private media plus the v2 additions, restores the finished export archive, verifies required sound files, then opens Remotion Studio. The project root contains the Remotion configuration and registered third-party element catalog. The Somatotypes export is a separate asset in the latest private release.

## Download on Windows

Install Git, Node.js 24.19.0, pnpm 11.19.0 and GitHub CLI. Sign in to GitHub with an account that has access to this private repository, then run these commands in PowerShell:

```powershell
gh auth login --hostname github.com --git-protocol https --web
gh repo clone Soyaaaa081305/tiktok-production-studio
Set-Location tiktok-production-studio
pnpm install --frozen-lockfile
pnpm run assets:restore -- --media-only
pnpm run check:project
pnpm studio
```

`pnpm studio` checks GitHub for updates every time it starts, fast-forwards only when the local tracked files are clean, verifies the required media, rebuilds the V2 gapless soundtrack, and opens Studio with `AshwagandhaEditorialV2` selected first. If a GitHub update would conflict with local edits, it stops and preserves those edits. Windows installs its own native dependencies; never copy `node_modules` from the Mac.

To download finished videos only, sign in to GitHub and download `exports-v2.0.0.zip` from the private repository’s **Releases** page. The archive contains both current edits, 4K archive masters, 1080p60 upload copies and covers. Restore the ZIP to `outputs/baseline/` with:

```sh
node scripts/restore-assets.mjs --exports-only
```

For a quick Mac download, the release also includes each 1080p60 upload MP4 as a separate asset. Download the ZIP when you also want the 4K masters and cover images.

Cloning the code alone does not include large recordings or MP4 exports. `pnpm assets:restore` downloads their separate release archives and checks SHA-256 before extracting.

## Current outputs

| Video | Upload file | Archive master |
|---|---|---|
| Ashwagandha | `outputs/baseline/ashwagandha-tiktok-v4-1080p-upload.mp4` | `outputs/baseline/ashwagandha-tiktok-v4-4k-master.mp4` |
| ATC Fish Oil | `outputs/baseline/atc-fish-oil-v4-1080p-upload.mp4` | `outputs/baseline/atc-fish-oil-v4-4k-master.mp4` |
| Creatine myths | `outputs/creatine-tiktok-v2.mp4` | — |
| Somatotypes | `outputs/somatotypes-tiktok-v1-1080p-upload.mp4` | `outputs/somatotypes-tiktok-v1-4k-master.mp4` |

All listed cuts use 60 fps. The Ashwagandha, Fish Oil, and Somatotypes archive masters are 2160 × 3840 upscales from 1080 × 1920 source footage; upscaling improves output dimensions but cannot restore detail that was not captured. Use the 1080 × 1920 upload copy in TikTok Studio. TikTok can re-encode an upload, so no file can guarantee uncompressed playback. A separate cover is included with each export; choose it in TikTok Studio because automatic cover selection is not guaranteed.

## Open, preview or reproduce

On Mac, after setup:

```sh
bash scripts/run-mac.sh studio
bash scripts/run-mac.sh reproduce:ashwagandha
bash scripts/run-mac.sh reproduce:fish-oil
```

Compositions: `AshwagandhaEditorialGaplessV4` and `ATCFishOilV4`. Studio starts on port 3000 by default. Start it from this project root so the Remotion config and element registry load.

The desktop launcher opens `AshwagandhaEditorialV2`, the selected V2 visual style with long narration pauses removed. `pnpm studio` checks for GitHub updates, installs any locked dependency changes, restores required source media, rebuilds its local gapless soundtrack from the V2 voice, ambient bed and sound cues, then starts Studio.

```sh
pnpm install --frozen-lockfile
pnpm setup:project
pnpm audio:ashwagandha-v2-gapless
pnpm studio
pnpm prepare:ashwagandha-v4
pnpm render:ashwagandha-v4
pnpm prepare:fish-oil-v4
pnpm render:fish-oil-v4
```

The current Creatine edit is `CreatineMythsV2`. Its frame-accurate cut plan, phrase captions, claim map, asset overlays and review are in [`jobs/creatine-v2/`](jobs/creatine-v2/). To rebuild its original-speed voice mix and render the video, run `pnpm render:creatine-v2`. V2 keeps complete natural asides and clause pauses while removing dead air and inaccurate claims. The user-supplied bald-man photo, kidney GIF and all three evidence screenshots appear as labeled overlays alongside separate custom motion graphics. The private `creatine-v2.0.0` release contains the V2 voice edit and finished MP4/cover ZIPs; `pnpm assets:restore` verifies and restores both Creatine releases.

The Somatotypes edit is `SomatotypesEditorialV1`. Its cut plan, source and evidence notes, SFX cues, silence audit, and quality review are in [`jobs/somatotypes-v1/`](jobs/somatotypes-v1/). Its local-only personal media remains outside Git. After restoring those inputs under `public/somatotypes/`, run `pnpm render:somatotypes-v1`; to reuse the saved local soundtrack, run `pnpm reproduce:somatotypes-v1`. The private `somatotypes-v1.0.0` release includes the upload copy, archive master, and cover.

Reproduction uses the preserved final voice/SFX mixes. It does not rerun transcription or broad research. Render scripts verify file decoding, dimensions, frame rate, pixel format, audio presence and duration. The saved silence audits report whether the edited voice contains unplanned gaps longer than 0.35 seconds.

## Prompt and operating kit

All reusable prompts are grouped under [`prompts/`](prompts/). Start with [`prompts/ALWAYS-ON-PROMPT.md`](prompts/ALWAYS-ON-PROMPT.md) for every task, then choose the script or production prompt below. The folder also contains the research, reference-refresh, workflow, creator-operations, and Spark prompts, plus historical job examples.

| File | Purpose |
|---|---|
| `prompts/ALWAYS-ON-PROMPT.md` | Persistent V2, dialogue, language, model, evidence and delivery preferences |
| `prompts/03-topic-to-script-prompt.md` | Focused web/PubMed research, evidence map and a read-aloud 45–60-second Taglish script |
| `prompts/04-master-production-system-prompt.md` | Source analysis, continuous speech EDL, exact blueprint, Remotion build, review and export |
| `prompts/07-approved-editorial-reference.md` | Keeps the selected AshwagandhaEditorialV2 style consistent and prevents silent placeholder gaps |
| `prompts/house-style.json` | Shared settings for research, picture layers, captions, cover, SFX, output and review |
| `prompts/creator-operations-context.md` | Account cadence, affiliate/income context, automation phases and nightly/morning work packet |
| `prompts/gemini-spark-start-here.md` | Main context and output format for Gemini Spark |
| `prompts/gemini-spark-nightly-packet.md` | Reusable next-day 5-video planning prompt |
| `jobs/ashwagandha-gapless-v4/` and `jobs/atc-fish-oil-v4/` | Actual per-video blueprint, EDL, caption timings, SFX, silence/audio measurements and export metadata |

The active scripting and production prompts are version 6.1.0. The creator’s selected model preference is GPT-6 Luna at Max; a prompt cannot change the model setting. An active daily 9:00 PM Asia/Manila reminder prompts the creator to prepare the next day’s Spark packet.

## Project checks and files

```sh
pnpm assets:restore
pnpm assets:verify
pnpm check:project
```

Windows and macOS each install their own native dependencies. Keep `node_modules`, caches, credentials and raw production media out of Git. Versioned private release archives contain the original footage, new support assets and finished videos. See [Windows/Mac portability](docs/PORTABILITY.md), [source and implementation notes](prompts/SOURCES-AND-IMPLEMENTATION-NOTES.md), and [the transfer verification record](docs/transfer-verification.json).

The videos are files for the creator to review and upload. This workflow does not publish to TikTok, Shopee or Facebook.

## Sources and platform guidance

- [TikTok Studio creator tools and upload requirements](https://support.tiktok.com/en/using-tiktok/creating-videos/creator-tools-on-tiktok)
- [NIH Office of Dietary Supplements: Omega-3 Fatty Acids](https://ods.od.nih.gov/factsheets/Omega3FattyAcids-HealthProfessional/)
- [ATC Healthcare Fish Oil product page](https://atchealthcare.com.ph/product/atc-fish-oil/)
- [Philippine FDA product registration](https://verification.fda.gov.ph/All_FoodProductsview.php?ACCOUNTCODE=FR-4000010802010&export=pdf)
- [2026 omega-3 and exercise-induced muscle damage systematic review](https://pmc.ncbi.nlm.nih.gov/articles/PMC13165459/)
- [Prospective omega-3 acne intervention](https://pubmed.ncbi.nlm.nih.gov/38982829/)
