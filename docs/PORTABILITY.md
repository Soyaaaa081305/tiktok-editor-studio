# Windows to Mac transfer

## Changes made in the portable copy

The JSX scene compositions are copied unchanged. Only historical source-path
metadata, setup/configuration and surrounding render scripts were adapted.
Windows absolute output paths and external scratch paths became project-local
`outputs/` and `work-render/`. The existing config and element registry remain
at the project root. Package versions and the dependency lockfile are retained.
The two placeholder pnpm build decisions for `esbuild` and `ffmpeg-static`
became explicit `true` values so a clean install can build those dependencies.
The locked `onnxruntime-node`, `protobufjs` and `sharp` dependency build scripts
are explicitly enabled as well; the clean installation identified these as
additional build steps in the existing package set.

The reproduction commands reuse preserved soundtrack files. This avoids a
different FFmpeg version rebuilding the dialogue processing and SFX mix. The
private release also includes the exact previously delivered MP4s. The original
running Windows working project was not moved or replaced by this transfer.

The restore helper verifies each archive before extraction and checks each
restored file against its original SHA-256. It refuses to overwrite changed
existing media unless `--force` is explicitly supplied. GitHub credentials
are handled by the local GitHub CLI/keychain and are never packaged.

## Mac requirements

Use the native Node build for your Mac: arm64 for Apple Silicon, x64 for Intel.
The lockfile includes both Remotion macOS compositor variants; pnpm selects
the appropriate native package. The setup script uses fnm to pin Node 24.19.0
and npm to install pnpm 11.19.0. Internet access is needed for dependency
installation, the private release downloads and the first browser setup.

The default FFmpeg comes from the locked `ffmpeg-static` dependency. The helper
checks it can execute and supports a system FFmpeg fallback. If its binary is
not supported on your Mac:

```sh
brew install ffmpeg
export FFMPEG_PATH="$(command -v ffmpeg)"
bash scripts/run-mac.sh reproduce:ashwagandha
```

The saved mixes make it unnecessary to use that fallback for audio rebuilding
when using the reproduction commands. It is still needed for final muxing.
For a lower-memory machine, set `REMOTION_CONCURRENCY=2` for the Ashwagandha
renderer. Keep hardware encoding settings unchanged if you want to minimize
encoding differences. New video files can differ in hash across platforms.

An existing process on port 3000 can conflict with Studio. Stop the other
Studio first, or launch `pnpm studio --port=3001` and use that port. Start it
from this root folder so the third-party element config is present.

## What this transfer does not establish

It was prepared on a Windows computer, not an actual Mac. The included doctor
reports the native platform when you run it. Imported animation components
are available source files; each component still needs integration into a
specific scene and review. Current compositions can be reproduced without
opening the old TikTok reference videos or downloading the optional models.

The original Fish Oil layouts use system Arial/Arial Black. Availability and
rasterization can differ across hosts; download the included baseline MP4 to
get its exact original picture. The clean Ashwagandha layout has local Inter
font files. Do not redistribute proprietary system fonts as a workaround.

## Official references

- [GitHub CLI private repository creation](https://cli.github.com/manual/gh_repo_create)
- [GitHub CLI release downloads](https://cli.github.com/manual/gh_release_download)
- [GitHub CLI authentication](https://cli.github.com/manual/gh_auth_login)
- [FFmpeg static package](https://github.com/eugeneware/ffmpeg-static)
- [pnpm project configuration](https://pnpm.io/cli/config)

Read `docs/transfer-verification.json` for the checks actually completed for
this packaged revision. A configuration check is not a full audiovisual review
of a newly rendered video.
