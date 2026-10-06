# Somatotypes TikTok edit · final QA

Reviewed: 2026-10-07

Composition: `SomatotypesEditorialV1`

## Visual review

The final upload copy was sampled at frames 0, 6, 500, 550, 584, 1500, 1870, 1920, 2630 and 4945. The samples cover the cover/first talking frame, the 44→76→64 kg sequence, the Sheldon-claim graphic, the presenter bridge, a modern component graphic with its corrected caption, and the closing shot.

Repairs made before this export:

- The 76 kg video card now loads its media before its short nested sequence begins; the 44, 76 and 64 kg visuals are visible in the weight timeline.
- The history graphic's scientific-status label sits between its explanation and delinquency panel; the citation remains legible at the bottom.
- The 2.1-second bridge now keeps the live presenter in the lower panel while the animated history-to-modern transition occupies the upper panel.
- Captions in stacked scenes were moved above the speaker's face and reduced slightly in size.
- The 44→76→64 kg heading now has clear spacing above the image card.
- The caption reads `Somatotype isn't a genetic blueprint.` to match the supplied script.

No collision, blank media card, or missing presenter was visible in the sampled final frames. This is a frame-sampled review, not a continuous human viewing of every frame.

## Export verification

The render script completed both full-file decode passes and verified:

- **TikTok copy:** MP4, H.264, 1080 × 1920, 60 fps, yuv420p, Rec.709, AAC stereo at 48 kHz; duration 82.435 s; file size 151,924,896 bytes.
- **Archive master:** MP4, H.264, 2160 × 3840, 60 fps, yuv420p, Rec.709, AAC stereo at 48 kHz; duration 82.434 s; file size 399,413,952 bytes. It is an upscale from the 1080 × 1920 source, not native 4K detail.
- **Cover:** 1080 × 1920 PNG extracted from the opening frame.
- **Audio:** measured integrated loudness −14.50 LUFS and true peak −1.80 dBTP. All 9 planned SFX cue windows contain signal in the SFX stem; this measurement confirms signal presence, not subjective audibility in the final mix.
- **Captions:** 32 source-timed cues mapped to the edited timeline; SRT export validated that cues fit retained dialogue segments and do not overlap.

The opening six frames are the 0.1-second cover. The recorded narration runs longer than the original one-minute outline, so the final cut is 82.43 seconds; shortening it further would require removing spoken material. The three long dead-air intervals listed in `narration-coverage.json` were removed while the remaining narration stays on one continuous output soundtrack. One uncertain Taglish aside is kept in the audio without a guessed subtitle.

## Review limits and upload notes

The code verified codecs, dimensions, frame rate, duration, stream metadata, SFX-stem signal and full-file decoding. The final audio has not received continuous subjective listening by a human reviewer in this run; no claim of “no faults” in subjective sound is made.

Use the 1080 × 1920 copy in TikTok Studio. TikTok's current web-upload help lists MP4/WebM, at least 720 × 1280, up to 30 minutes and under 10 GB, with cover selection; this export meets those listed limits. Where available, enable TikTok's HD upload option. TikTok may recompress uploaded media, so no export can guarantee uncompressed playback. The 4K file is an archive upscale and will not restore source detail.
