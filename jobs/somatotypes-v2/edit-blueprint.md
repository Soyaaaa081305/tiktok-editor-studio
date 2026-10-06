# Somatotypes edit blueprint v2

## Edit decisions

- Keep the first spoken “Here’s the reality” and remove the repeated “Again, here’s the reality” retake.
- Remove the first closing take (“Stop limiting yourself, okay?” and the first ectomorph example) plus the spoken “Again” false start. Keep one clean “Kaya stop limiting yourself” take and the complete Taglish example sequence through “stop capping your own potential.”
- End after the supplied script’s final spoken sentence. The later filler and alternate spoken CTA are removed; the creator signature is shown briefly over the active last shot without added voice or a silent end card.
- Remove the long source pauses already flagged in v1. All dialogue is original source audio; no synthetic narration.
- Keep the original 60 fps presenter footage without digital zoom. Remove the 76 kg image’s oscillating scale. Convert its short 30 fps insert to 60 fps by optical-flow interpolation for smoother motion; the raw source stays untouched.

## Final source EDL

All source/output frames use 60 fps; source end is exclusive.

| Beat | Source frames | Output start | Frames |
|---|---:|---:|---:|
| Cover | — | 0 | 6 |
| Hook | 94–488 | 6 | 394 |
| First reality line | 804–888 | 400 | 84 |
| History | 1014–2436 | 484 | 1422 |
| Modern science | 2598–3608 | 1906 | 1010 |
| Concise close | 4282–5263 | 2916 | 981 |

Total: 3897 frames = 64.95 seconds. The 0.1 second cover is the only authored silent time. The source provides 60 fps CFR presenter footage; the 76 kg insert is 30 fps and is interpolated for the 60 fps composition.

## Visuals / audio

- Preserve AshwagandhaEditorialV2’s clean two-layer and full-screen explanatory graphic language. Keep the 44→76→64 kg personal montage, Sheldon history, evidence distinctions and closing examples.
- Avoid animated zooms on the human footage. Keep animation on the explanatory cards/diagrams, with a stable crop for the presenter.
- Keep the creator-requested 8-second riser/drop and the existing selective SFX. No new music beyond the explicit original cue.
- Rebuild captions from the retained source ranges and remove captions for deleted speech.

## Removed source ranges

See `edit-data.json` and `narration-coverage.json` for exact ranges and reasons. The cut removes the repeated line at 14.8–16.9 s, the duplicated first close/re-take at 62.933–71.3667 s, and the extra outro after 87.7167 s.
