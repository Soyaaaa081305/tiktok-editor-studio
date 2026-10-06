# Always-on TikTok Editor prompt

Use this file before every prompt, script, edit, or review task in this TikTok Editor project. It is the creator's persistent preference layer; combine it with the relevant task prompt in this same `prompts/` folder. The latest direct user instruction overrides a default here.

## Choose the task prompt

- New topic or science script: `03-topic-to-script-prompt.md`.
- Existing recording to edit or export: `04-master-production-system-prompt.md`.
- New reference analysis: `02-reference-style-refresh-prompt.md` and `07-approved-editorial-reference.md`.
- Gemini Spark planning: `gemini-spark-start-here.md` or `gemini-spark-nightly-packet.md`.
- Use `house-style.json` for machine-readable format and audio defaults.

## Creator preferences

1. **Model:** Use GPT-6 Luna at Max as the default when available. It is sufficient for this workflow's motion graphics. Do not switch to Sol unless the creator asks or a specific task exceeds Luna's capability. Prompt files do not change the app's model selector.
2. **Preferred look:** `AshwagandhaEditorialV2` is the creator's selected visual reference. Keep its clean editorial style, meaningful motion graphics, authentic presenter/product footage, and readable product details when asked to match the preferred look. Do not force the same graphics onto an unrelated topic or override a newly named version.
3. **Voice continuity:** Preserve the actual recorded words, Taglish wording, natural pace, and clear voice lane beneath motion graphics and full-screen inserts. Remove long dead-air pauses between phrases. Do not create silent picture holds in place of speech.
4. **Protect speech:** A silence detector is a review aid, not automatic cut authority. Listen when possible; preserve low-level word onsets, consonants, and short natural breaths. Never remove a word or syllable just to make a silence report read zero. If a quiet interval cannot be judged without listening, flag it honestly.
5. **Visuals:** Use real source/product footage and accurate, topic-specific motion graphics. Keep captions readable and selective. Do not use synthetic product shots, invented testimonials, decorative filler, or an unexplained static end card.
6. **Evidence:** Verify supplement facts against readable labels and reliable sources. Do not invent dosages, ingredient amounts, study findings, or health outcomes. Keep personal experience clearly anecdotal.
7. **Sound:** Keep added music off unless explicitly requested. Use selective, subordinate sound effects and verify the final mix where possible.
8. **Delivery:** Keep editable project files in this local project and finished videos under `outputs/`. Inspect the actual export and state what was and was not verified. Distinguish files local to this device from changes pushed to GitHub; do not publish or push without direct authorization.

## Quick instruction to give an AI

> For this TikTok Editor task, always apply `prompts/ALWAYS-ON-PROMPT.md` first. Then use the relevant task prompt from `prompts/`. Keep my AshwagandhaEditorialV2 visual preference, preserve Taglish and all actual spoken words, remove long dead air without clipping quiet speech, and use GPT-6 Luna at Max unless I say otherwise. Follow my latest request if it changes a default.
