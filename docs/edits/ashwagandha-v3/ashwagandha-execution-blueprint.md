# Ashwagandha — minimal editorial execution blueprint

Created 2026-10-06 from the user's latest visual direction. Implements the current master and source-specific prompt with the saved reference findings. This is the active plan for v3; older scene specifications do not govern this revision.

## Editorial decision

The user found the prior treatment visibly artificial. Remove the generic cartoon bed, icon circles, decorative waveform, orbiting Mg diagram, growing plant, marker-highlight card, floating bottle sticker/arrow, numbered ingredient headings, repeated source/provenance labels, count-up number and oversized boxed CTA. Replace them with real source footage, controlled type hierarchy, simple purposeful keyframes and fewer sound events. A preliminary narrow photo/side-label composition was further simplified to full-frame real footage with a legible two-line function statement.

Keep original speech, exact source trims, 82 caption words, 27 caption pages, the fixed white/gold caption lane, 0.1s embedded cover, selected upper-footage/lower-presenter scenes and useful full-screen explanation/inserts. Clean does not require removing needed factual qualifiers.

## Inputs and coverage

- Recording: C:/Users/Admin/Videos/2026-10-06 09-44-08.mp4; 120.950s, 1080×1920, 60fps. Use only retained speech and the user's bottle/capsule B-roll. Do not use backstage chatter.
- Reference: C:/Users/Admin/Downloads/Download (1).mp4; cached Dylan Page/News Daddy observations are in prompt01. Prior analysis used 206 half-second stills and local ASR; it was not uninterrupted audiovisual observation. Do not rewatch old benchmarks for this aesthetic revision.
- Existing project: C:/Users/Admin/Documents/Codex/2026-10-05/files-pasted-by-the-user-master/work/atc-fish-oil-remotion. Source implementation: src/ashwagandha/editorial-clean.jsx. Current composition AshwagandhaEditorial; old v2 separately available as AshwagandhaEditorialV2. All ATC compositions retained.
- Final file: ashwagandha-tiktok-editorial-v3-clean.mp4. Picture length 2014frames / 33.567s; AAC may extend container by roughly 33ms.

## Paper edit

| Beat | Output seconds | Source frames | Visual |
|---|---:|---:|---|
| poster | 0.000–0.100 | — | One genuine creator frame, one question headline; six clear frames |
| hook | 0.100–6.433 | 90–470 | Full presenter with two deliberate punch-ins; no sleep cartoon or extra headings |
| context | 6.433–9.067 | 704–862 | Presenter; Workout then Stress with a thin underline timed to words |
| product | 9.067–13.700 | 868–1146 | Large genuine bottle inserts above synchronized presenter; no badges |
| mineral-voice | 13.700–14.483 | 1590–1637 | Ingredient name; full-screen photo and concise function explanation |
| mineral-hold | 14.483–17.533 | — | Real full-screen bottle footage; concise normal nerve/muscle function text |
| stress | 17.533–21.317 | 2326–2553 | Genuine upper product footage and one ingredient name; presenter below |
| evidence | 21.317–23.317 | — | Real bottle footage; May help with stress / Evidence is limited / Results vary |
| label | 23.317–26.333 | 3137–3318 | Real label footage/still; static 1,400 mg + Combined blend · per serving |
| capsules | 26.333–28.333 | — | Real capsules; 60 capsules + Per bottle |
| personal | 28.333–30.333 | 3694–3814 | Presenter with one small Results vary line; no testimonial box |
| cta | 30.333–32.017 | 3466–3567 | Real upper product inserts and synchronized lower original CTA; captions only |
| outro | 32.017–33.567 | — | Real bottle pair, product name, one plain Yellow basket pointer |

## Layout and visual treatment

- 1080×1920/60fps, Rec.709. Neutral #18181b background, white text, muted lavender only on the functional connector, yellow retained for captions/brief underline. No patterned backdrop, glow, glass, gratuitous gradients or fake interface.
- Inter500 supporting type and Inter700 headings; 58px Inter900 dialogue at fixed y1290. Supporting text35–52px. Headings65–108px. Strong contrast and negative space. One primary idea per shot.
- Real footage uses slight saturation reduction .94 and contrast1.025; preserve real skin and package colors. This is a restrained display grade, not a skin/room-lighting restoration.
- Opening frame: genuine creator.jpg at2.000s, full canvas scale1.025; one two-line question at(82,178),108px white Inter700. No framed product cutout, arrow, eyebrow or footer. Six clear frames. Live hook begins6f; six-frame opacity .9→0 / scale1→1.025 dissolve; fully clear11f.
- Hook: original90–470f, full presenter, inner y=-30 and scale1.025; punch to1.075 atlocal120f and reset1.04 at260f. No additional on-screen copy beyond captions.
- Context: original704–862f, full presenter scale1.045. One word at(82,178): Workout, then Stress atlocal88f. Ten-frame9–10px reveal; 3px gold underline draws14f. No stock icons or spurious physiological trace.
- Product: upper1080×720 window, crop original video y=-420; source3960–4044f,6786–6900f,3960–4040f over consecutive84/114/80f. Lower synced source868–1146f, window y720, inner y=-415.4px separator; no badge or extra product label.
- Magnesium full-screen230f: genuine source3960–4190f (66.000–69.833s), full canvas at x0 with no side gap. Heading(82,180),86px. Bottom statement(82,1455),width810,48px Inter500: Supports normal nerve / and muscle function. Reveal local62–82f with9px motion; a115px,3px muted line draws local48–82f at y1405. The added text describes normal nutrient function, not product-specific clinical proof. No molecular model, orbit, brain or activity icon.
- Ashwagandha: upper genuine source3960–4074f then6786–6899f,114/113f. Lower source2326–2553f. One 62px ingredient name at(82,575). Direct insert changes.
- Evidence: original6876–6996f full-frame bottle pair,2s. Plain heading May help with stress at(82,195),81px; necessary qualifier Evidence is limited / Results vary at(82,1455),52px. No cards, numbered headings or repeated bibliography labels.
- Label: original3960–4050f for90f, then genuine67.200s still91f, both full canvas at x0 with no side gap. Static 1,400mg at(82,185),116/62px; Combined blend · per serving35px. Twelve-frame8px fade reveal. No count-up or claim that this is elemental magnesium.
- Capsules: original5496–5616f, full canvas1.01→1.035 scale.60 capsules / Per bottle at(82,185),100/67/35px. Remove redundant inside-bottle/provenance/directions overlays.
- Personal: original3694–3814f full presenter1.03. One unboxed35px Results vary at(82,1510). No heart icon or My personal experience badge.
- CTA: upper original6786–6887f, lower3466–3567f synced; captions carry the spoken CTA without a duplicate button. Outro6876–6969f has product name at(82,184), one plain Yellow basket ↓ at(82,1460), and32px Food supplement · Results vary at(82,1570).
- Caption pages/timing remain as stored in edit-decision-list.json. White/gold highlights only; remove the per-word scale bounce; reduce outline4→3px and shadow to2px. Keep fixed position and wording.
- Important text generally ends before x900 and y1640. Review house mask; device/posting UI still needs real platform verification. An embedded cover does not force TikTok's selected cover.

## Sound

15 selective cues in sound-cues.json: real local CC0 whoosh and owned tick/pop, gains .17–.30. No constant whips, trailer hits, chimes, or sounds on every word. Align each intentional cut/reveal with its event. Reduce existing quiet original ambient bed gain.72→.40. Preserve original voice processing/natural pace. Master approximately-14.5LUFS, encode with-1.8dBTP target headroom, then measure actual final AAC against delivery ceiling-1.5dBTP.

Use separate voice-clean.wav, original-ambient-clean.wav and soundtrack-clean.m4a so the v2 preview/export assets remain intact. Render a muted picture pass, explicitly mux the common finished soundtrack, and verify packet identity between Studio and export. Signal analysis establishes presence/levels, not subjective listening.

## Claims and provenance

Keep the earlier factual trims and source-preservation decisions; do not reinsert unverified deficiency, dose, cortisol, absorption, urgency or dosing-regimen claims. Product quantities are package statements. Keep the necessary per-serving/blend and results-vary qualifiers readable; put long citations, source paths, licensing and production rationale in accompanying notes.

- [NIH ODS magnesium](https://ods.od.nih.gov/factsheets/Magnesium-HealthProfessional/): normal muscle/nerve function; compound and elemental amounts differ. Rechecked2026-10-06.
- [NIH ODS ashwagandha](https://ods.od.nih.gov/factsheets/Ashwagandha-HealthProfessional/): some preparations may help stress; research is limited and product-specific efficacy is unverified. Rechecked2026-10-06.
- Fonts from installed Inter/Fontsource; source-license information retained in asset-and-claim-notes.md. Whoosh uses the earlier verified CC0 cache; tick/pop are the project's original synthesis. No borrowed reference media, soundtrack or wording.

## Delivery and review

Save this plan before implementation/render. Export a separate v3 MP4 and frame0 cover. Inspect full-duration samples, every boundary, typography/crops and first12frames. Decode entire export, verify2014frames/1080×1920/60fps/Rec.709, final AAC loudness, all15 cue windows and shared-mix equality. Validate caption/source ranges and canonical prompt mirror/archive. Record unperformed continuous subjective listening and TikTok device/upload checks without claiming a perfect rating.
