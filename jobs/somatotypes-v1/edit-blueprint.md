# Somatotypes · Edit blueprint v1

## Brief and decisions

- Source: creator's 94.983-second, 1080 × 1920, 60 fps Taglish recording (`public/somatotypes/main.mp4`).
- Goal: preserve the complete recorded narration and its natural delivery; edit it into an evidence-aware vertical explainer with the selected AshwagandhaEditorialV2 visual language.
- Duration: 82.433 seconds (4946 frames at 60 fps). The one-minute outline is shorter than the recorded voice. Reaching one minute would require removing meaningful lines or unnaturally speeding speech, so this cut removes only long dead air and keeps the whole delivery.
- Music: the creator previously specified a suspenseful synth riser followed by a bouncy hip-hop/electronic beat at 0:08. This is the explicit exception to the no-music default. Use a newly synthesized original cue, subordinate to voice.
- Picture: use the creator-confirmed 44 kg dog/tuk-tuk still, the supplied 76 kg gym clip, the 64 kg gym clip with its source display rotation, the creator's Sheldon portrait, the supplied body-type diagram, and the Britannica screenshot. Other 44 kg and 76 kg assets remain unused. Do not use school or vaccination-card photos in this public-facing cut; they add no explanatory value and expose private context.
- Science nuance: keep the recorded words intact, but correct the overbroad impression with an on-screen distinction. Sheldon’s physique-to-personality/delinquency theory is discredited; Heath–Carter somatotyping remains a descriptive method used in sport research. The creator's weight-change example is personal illustration, not proof about everyone's body.
- Output: 1080 × 1920, 60 fps H.264/AAC upload copy; 2160 × 3840, 60 fps archive master (upscaled from 1080p presenter footage); separate genuine frame-0 cover.

## Narrative and visual language

1. **0:00–0:10 hook:** six-frame authentic presenter cover, 0.1-second zoom-dissolve, tight presenter crop, quick type beats for the three names, then a 44 → 76 → 64 kg photo/footage sequence as the early payoff. The visual labels come from the creator's asset context; no years or causal claims are added.
2. **Historical origin:** full-screen and stacked inserts use the supplied William H. Sheldon portrait, body-type chart, the user-provided Britannica screenshot, a clean 1940 timeline, and compact JAMA/Rafter source cards. Animate the proposition as an attributed historical claim, then visibly strike through the personality/delinquency link. Do not imply the modern body-build assessment is itself invalid.
3. **Science distinction:** transform rigid illustrated categories into three continuously adjustable descriptive components. Keep a clear two-card contrast on screen long enough to read: `Sheldon: physique → personality (discredited)` and `Heath–Carter: descriptive physique assessment (still used in sport research)`. Add one compact 2020 study and one 2025 scoping-review citation.
4. **Practical takeaway:** show nutrition, training, muscle/fat mass, and time as interacting examples, never as a complete or exclusive causal model. Return to the creator's actual footage for `44 → 76 → 64 kg`; label it `personal example`.
5. **Close:** return to direct-to-camera speech, retain every recorded line, and place `Like and follow for more science-based lifting advice. God bless!` as a restrained overlay over the active final shot. Do not create a silent end card.

Use the V2 palette (warm paper, dark ink/green, restrained yellow highlight), Manrope/Inter typography, deliberate full-bleed inserts, occasional upper-image/lower-presenter stack, and direct cuts or short motivated wipes. Avoid constant motion, fake diagrams, AI-looking stock art, fixed heavy subtitle boxes, and effects on every word.

## Speech edit decision list

Source and output are both 60 fps. `sourceStartFrame` is inclusive; `sourceEndFrame` is exclusive. The 6-frame cover is the only authored silent picture hold. Audio from each listed source interval remains continuous in the output order.

| ID | Source frames | Source time | Output start frame | Frames | Role |
|---|---:|---:|---:|---:|---|
| A | 94–488 | 1.567–8.133 s | 6 | 394 | Hook and three body-type names |
| B | 804–888 | 13.400–14.800 s | 400 | 84 | “Here's the reality” |
| C | 899–2436 | 14.983–40.600 s | 484 | 1537 | Sheldon origin and constitutional-psychology history |
| D | 2598–3608 | 43.300–60.133 s | 2021 | 1010 | Modern-science section and descriptive-vs-destiny visual correction |
| E | 3776–3950 | 62.933–65.833 s | 3031 | 174 | “Stop limiting yourself, okay?”; retain the whole “Okay?” |
| F | 3954–4197 | 65.900–69.950 s | 3205 | 243 | Ectomorph example and recorded “Again” |
| G | 4199–5697 | 69.983–94.950 s | 3448 | 1498 | Main takeaway, examples, recorded close and CTA |

The detector flagged multi-second pauses at 8.13–13.40, 40.60–43.30, and 60.13–62.93 seconds; those are removed. Short source pauses and quiet word tails remain. In particular, source speech through 65.72 seconds is kept so “Okay?” is not cut off. An ASR-uncertain short Taglish aside near source 39–40.4 seconds remains audible but will not receive a guessed subtitle.

## Audio plan

- Use one frame-accurate dialogue mix for preview and exports.
- Generate original, deterministic music: low suspense riser from 0:00, clear beat drop at output frame 480 (0:08), then a restrained 92 BPM hip-hop/electronic groove. Lower it beneath voice; fade it at the end.
- Use owned project SFX only: short whoosh for the transformation and science transitions; subtle tick/pop for source/evidence reveals. No SFX on every caption.
- 48 kHz AAC delivery. Measure the final integrated loudness and true peak; verify cue windows contain the planned audio. Subjective audition status must be reported accurately.

## Implementation and review gates

- Build from this saved EDL; captions and SFX use the same output frame clock.
- Add a separate Remotion entry point (`src/index-somatotypes.jsx`) so this composition does not touch the concurrent Creatine project’s uncommitted shared index changes.
- Render and decode the actual 4K master and 1080p upload copy; verify dimensions, 60 fps, H.264/yuv420p, Rec.709 tags, AAC/48 kHz, duration, frame count, loudness and true peak.
- Inspect a complete-duration contact sheet plus opening, each picture transition, all science/source cards, captions and the final frame. Repair visible defects before delivery.
- Keep raw personal source files out of Git and GitHub release packages. Publish the finished video and job/project documentation to the existing private repository only.
