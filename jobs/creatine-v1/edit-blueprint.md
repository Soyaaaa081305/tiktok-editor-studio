# Creatine myths · editorial blueprint

## Deliverable

`CreatineMythsV1`: vertical 1080 × 1920, 60 fps, 62.55 seconds. It uses the supplied one-take Taglish recording, backed by clean study cards and the recorded product label. Speech remains at its original speed. No music is added. Four quiet CC0 sound cues mark the evidence cards.

## Story

Open on the creator holding the product and ask about hair loss and kidneys. Set up the three myths. For hair, distinguish a 2009 DHT measurement from a hair-loss outcome, then show the 2025 trial that directly measured hair metrics and DHT. For kidney function, explain creatinine as a marker and describe the small 12-week trial without extending it to people with kidney disease. For weight, explain that body weight can rise with water and show the limits of the small 2003 body-composition study. End on the creator's recorded daily-dose line, personal product recommendation, and recorded signoff.

## Source ranges

Frame-accurate source and timeline cuts are in `edit-plan.json`. The selected passages retain the hook, all three questions, study context, marker explanation, body-water explanation, daily-dose recommendation, complete personal CTA, and recorded signoff. Shortened internal gaps keep quiet handles around the complete hook, kidney explanation, and CTA clauses. Cut intervals also remove a research superlative, a false replication claim, repeated production takes, the absolute kidney guarantee, and the “zero calories means impossible to gain fat” line. The edit does not replace the spoken wording with new narration.

## Visual direction

Use the `AshwagandhaEditorialV2` palette and contrast: warm paper study cards against the real room and presenter, forest-ink panels, restrained gold accents, and short, deliberate entrances. Keep the creator visible on evidence scenes in a lower live crop. Use recorded product frames at the opener and label/CTA. Keep citations visible on the cards.

The supplied celebrity baldness image is excluded because it does not substantiate a health claim and its reuse rights were not provided. The supplied low-resolution generic kidney GIF is excluded because it does not depict creatine or kidney function. The supplied article screenshots are source reminders; on-screen cards use the study findings and identifiers instead of unreadable browser screenshots.

## Voice and captions

`voice-edit.wav` is assembled from the selected source frames at 48 kHz with short edge fades and one loudness-normalization pass. Phrase captions retain source-frame timing and are mapped to the EDL timeline. The hook and final signoff captions were normalized from the local ASR transcript and house signoff; check `quality-review.md` for the transcription limitation.

## Export

Render `CreatineMythsV1` using `pnpm render:creatine-v1`. Save the H.264 MP4 and cover PNG under `outputs/`. Asset restoration is described in `assets-manifest.json` and `README.md`.
