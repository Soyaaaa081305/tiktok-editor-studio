# Somatotypes v2 quality review

## Edit and continuity

- Removed the repeated “Again, here’s the reality” retake, the false-start “Again” in the closing, the repeated first closing take, and the extra alternate outro. The edit keeps one continuous pass of the supplied script and ends on its final spoken sentence.
- Removed the source pauses already marked as long. Remaining detected voice gaps are 0.37–0.62 seconds between phrases; the beat-drop gap before the evidence section is intentional. No long dead-air segment remains in the edit.
- Presenter dialogue comes from the original recording. The source audio is concatenated across the edited EDL with short edge fades; no synthetic narration was added.

## Motion and visuals

- The original presenter source is 1080 × 1920 CFR 60 fps. No frame-rate conversion or digital zoom is applied to the presenter footage; the artificial oscillating zoom has been removed.
- The 30 fps 76 kg insert is interpolated to 60 fps for the short montage. Original source media remains unchanged.
- Reviewed representative rendered frames covering the 0.1-second cover and transition, hook, 44→76→64 kg montage, evidence cards, clean retake join, and final signature. Text, captions, and full-screen graphics remain inside the portrait frame.

## Export validation

- Upload: H.264, 1080 × 1920, CFR 60 fps, yuv420p, BT.709, AAC stereo at 48 kHz; 64.95-second composition.
- Archive master: H.264, 2160 × 3840, CFR 60 fps, yuv420p, BT.709, AAC stereo at 48 kHz. This is a 4K upscale from the 1080p source and edit, not native 4K detail.
- Both exports passed full-file FFmpeg decode checks. The Remotion chunks passed frame-count validation; rendered composition is 3,897 frames.
- Audio measurement: -14.42 LUFS integrated, -1.80 dBTP. Nine SFX cue windows contain signal. Signal checks do not replace a subjective listening pass.
- Cover PNG is 1080 × 1920. Caption file was rebuilt from retained source ranges and contains no removed “Again” retakes.

## Review limits

Visual review used representative frames and a contact sheet; the model could not perform a continuous subjective audio audition or confirm the source camera’s movement by ear/eye during full-speed playback. The editor-added zoom jitter was removed. Any movement already present in the original recording is preserved.
