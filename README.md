# TikTok Production Studio

Portable private Remotion project for the creator’s original science-based Taglish videos. It includes the editable Ashwagandha and ATC Fish Oil cuts, reusable research and production prompts, creator/Spark context, and the local animation library.

## Download on Mac

Sign in to the private repository as `Soyaaaa081305` or an account with access, then clone and restore its media/export archives:

```sh
brew install gh
gh auth login --hostname github.com --git-protocol https --web
gh repo clone Soyaaaa081305/tiktok-production-studio
cd tiktok-production-studio
bash scripts/setup-mac.sh --studio
```

The setup installs the pinned Node and pnpm versions, downloads and checks the original private media plus the v2 additions, restores the finished export archive, verifies required sound files, then opens Remotion Studio. The project root contains the Remotion configuration and registered third-party element catalog.

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

Both cuts use 60 fps. Their archive masters are 2160 × 3840 upscales from 1080 × 1920 footage; upscaling improves output dimensions but cannot restore detail that was not captured. Use the 1080 × 1920 upload copy in TikTok Studio. TikTok’s current Studio help lists MP4/WebM, at least 720 × 1280, under 10 GB and up to 30 minutes. TikTok can re-encode an upload, so no file can guarantee uncompressed playback. The separate cover is a frame-zero still; choose it in TikTok Studio because automatic cover selection is not guaranteed.

## Open, preview or reproduce

On Mac, after setup:

```sh
bash scripts/run-mac.sh studio
bash scripts/run-mac.sh reproduce:ashwagandha
bash scripts/run-mac.sh reproduce:fish-oil
```

Compositions: `AshwagandhaEditorialGaplessV4` and `ATCFishOilV4`. Studio starts on port 3000 by default. Start it from this project root so the Remotion config and element registry load.

```sh
pnpm install --frozen-lockfile
pnpm setup:project
pnpm studio
pnpm prepare:ashwagandha-v4
pnpm render:ashwagandha-v4
pnpm prepare:fish-oil-v4
pnpm render:fish-oil-v4
```

Reproduction uses the preserved final voice/SFX mixes. It does not rerun transcription or broad research. Render scripts verify file decoding, dimensions, frame rate, pixel format, audio presence and duration. The saved silence audits report whether the edited voice contains unplanned gaps longer than 0.35 seconds.

## Prompt and operating kit

| File | Purpose |
|---|---|
| `prompts/03-topic-to-script-prompt.md` | Focused web/PubMed research, evidence map and a read-aloud 45–60-second Taglish script |
| `prompts/04-master-production-system-prompt.md` | Source analysis, continuous speech EDL, exact blueprint, Remotion build, review and export |
| `prompts/07-approved-editorial-reference.md` | Keeps the approved clean Ashwagandha motion-graphics standard consistent and prevents silent placeholder gaps |
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
