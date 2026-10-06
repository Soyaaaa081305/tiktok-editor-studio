# Quality review · CreatineMythsV2 / V3 correction

## Final export

- V2 (`outputs/creatine-tiktok-v2.mp4`) remains unchanged. The corrected final is `outputs/creatine-tiktok-v3.mp4`.
- V3 fully decoded: H.264, 1080 × 1920, 60 fps, 4,188 frames, 69.800 seconds; AAC stereo at 48 kHz; 113,794,545 bytes.
- Audio scan: −17.03 LUFS integrated and −0.99 dBTP true peak, unchanged from V2. No music was added; the voice remains at original speed with four selective SFX cues.
- A full subjective listen-through was not performed. Taglish captions were compared against the supplied ASR word timestamps; transcript alignment still warrants a human ear review for code-switching and the English signoff.

## Picture review

- Reviewed a 16-point contact sheet and full-resolution frames at the research, hair evidence, kidney GIF, kidney trial, body-composition trial, and CTA beats.
- Confirmed the supplied bald-man portrait appears in an evidence card with an explicit illustrative-only/no-creatine-or-hair-loss-link note.
- Confirmed the supplied kidney GIF is an animated overlay: the 31.3-second and 32.2-second frames show different GIF poses. The overlay labels it anatomy illustration only and says it does not depict creatine causing kidney damage.
- Confirmed all three supplied article screenshots appear as distinct media overlays, separate from the custom motion graphics. Their titles and the attached scope notes are readable at full resolution.
- The V2 export contained the unrelated idle `package-frame.jpg` still in both the dose card and CTA. This was a real image-selection defect, reported by the creator.

## Corrective export · V3 verified

- V3 replaces the static still in the dose card with muted, moving source footage beginning at source frame 240 (4 seconds), where the creator is actively holding the product.
- V3 removes the duplicate presenter inset from the CTA entirely; the continuing source footage fills the canvas and includes the creator's actual product hold near the end.
- Frame checks at 57.0, 58.4, and 60.2 seconds confirm the dose overlay is moving and shows the creator holding the pouch. Checks at 61.0, 63.5, 66.1, and 66.5 seconds confirm there is no duplicate still in the CTA and the full-screen source shows the live product hold near its end.
- The V3 full-export contact sheet was inspected; the earlier evidence, hair, kidney, and body-composition visuals remain present. The cover was extracted from the corrected export and visually inspected.
- The V2 MP4 remains unchanged. V3 passed full-file decode and the audio/loudness checks above.

## 4K60 archive master

- Created `outputs/creatine-tiktok-v3-4k-master.mp4` from the verified V3 upload export using Lanczos scaling to 2160 × 3840. This is an upscale from the 1080 × 1920 source and adds no captured detail.
- H.264, 2160 × 3840, constant 60 fps, 4,188 frames, 69.800 seconds, yuv420p, Rec.709; AAC stereo at 48 kHz copied from V3 without re-encoding. File size: 422,811,897 bytes. SHA-256: `3b6488541f8046d9a63751303de87616f03900a8a70142f789c21c445bbcb782`.
- Full-file decode passed. The AAC bitstream hash matched V3 exactly. Extracted a 2160 × 3840 cover and inspected it; also inspected a 16-frame contact sheet across the full 4K export. Existing V3 visuals, including the moving product demo and corrected full-screen CTA, are intact.
- The previous V3 audio measurement remains applicable because its encoded audio stream is identical: −17.03 LUFS integrated, −0.99 dBTP. No new subjective listen-through was performed for this resolution-only export.

## Claims and editorial checks

- Retains the creator's natural research aside and the first meta-study aside, plus the kidney explanation pause, CTA clause pause, and recorded signoff. Runtime is 69.8 seconds; the edit does not target an exact one-minute length.
- Removes the repeated take, on-set directions, unsupported claim that 12 follow-up studies replicated hair-loss outcomes, universal kidney-function guarantee, and false claim that zero calories makes fat gain impossible.
- Qualifies the "single most researched" line on screen: the 2021 review cites more than 500 creatine publications but does not prove a #1 ranking across all supplements.
- The kidney trial card specifies 26 healthy resistance-trained men over 12 weeks and notes that it does not establish safety for kidney disease.
- The 2003 body-composition card says 17 active men, four weeks, high-dose protocol; it specifies measured total body water and body-fat percentage, not intracellular distribution.

## Silence scan

FFmpeg `silencedetect` at −45 dB with a 0.35-second minimum flagged three intervals:

- 5.803–6.570 s (0.767 s), within the restored research aside; retained conservatively because the detector cannot distinguish quiet speech from breath.
- 64.009–64.872 s (0.863 s), the expected CTA clause pause.
- 69.272–69.803 s (0.531 s), the quiet natural signoff tail.

No other interval over 0.35 seconds was flagged. No silence was cut solely from the detector output.
