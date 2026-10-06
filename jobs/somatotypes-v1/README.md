# Somatotypes V1 · job files

`SomatotypesEditorialV1` is a standalone Remotion entry point. The rendering files do not modify the shared Studio registry, package manifests, or the other edits in progress.

## Files

- `edit-blueprint.md` — story, exact cut plan, visual direction and delivery decisions.
- `execution-prompt.md` — portable job-specific instructions for Codex/Antigravity.
- `edit-data.json` — frame-accurate speech EDL, captions and SFX events.
- `somatotypes-v1-captions.srt` and `export-captions.mjs` — optional captions on the trimmed output timeline.
- `sources-and-claims.md` — checked sources, access status, boundaries and on-screen correction.
- `assets-and-rights.md` — local input provenance and what is excluded from GitHub.
- `RELEASE-NOTES.md` — release asset list and export limitations.
- `build-audio.mjs` — constructs the continuous dialogue/SFX mix and original requested music cue.
- `render.mjs` — stages only this edit's static inputs, renders recoverable frame chunks at native 1080p60, muxes the soundtrack, makes a 4K upscale and validates exports.
- `narration-coverage.json`, `silence-audit.json`, `sfx-cue-audit.json`, `audio-measurements.json`, `render-metadata.json`, `quality-review.md` — generated review records.

## Local media required to rebuild

The large personal originals stay outside Git. Put the creator-supplied files under `public/somatotypes/` using the names in `assets-and-rights.md`, and restore the project's shared fonts/SFX through `pnpm assets:restore` if they are absent. The finished videos and cover are available in the private GitHub release, so the Mac download does not need these personal originals.

```powershell
pnpm install --frozen-lockfile
pnpm assets:restore
node jobs/somatotypes-v1/build-audio.mjs
node jobs/somatotypes-v1/export-captions.mjs
node jobs/somatotypes-v1/render.mjs --skip-audio
pnpm exec remotion studio src/index-somatotypes.jsx --port=3001 --no-open
```

The MP4 upload copy is 1080 × 1920 at 60 fps. The separate 2160 × 3840 archive master is an upscale; it cannot restore detail absent from the 1080p presenter recording. TikTok may re-encode any upload.
