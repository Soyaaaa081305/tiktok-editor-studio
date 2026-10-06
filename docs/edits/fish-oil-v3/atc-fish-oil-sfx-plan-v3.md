# ATC Fish Oil V3 — Sound Design Correction

The phrase “no SFX eh” meant that the edit was missing sound effects. Sound design is enabled for this revision.

## Picture and delivery

The existing full-screen V3 edit remains the picture timeline: 1080 × 1920, 60 fps, 49.117 seconds, Taglish captions, and a 0.4-second opening poster. The new export is `atc-fish-oil-tiktok-v3-sfx.mp4`.

## Sound map

| Output cue | Sound and purpose |
|---|---|
| 00:00.00 | Short original impact for the opening poster. |
| 00:00.38 | Whoosh into the spoken opening. |
| 00:01.48 | Whoosh into the full-screen hook. |
| 00:04.33–00:04.75 | Omega-3 chapter sweep; two short clicks follow the EPA/DHA panel entrances. |
| 00:08.78–00:11.17 | EPA chapter sweep; three brief interface ticks follow the signal moving through the diagram. |
| 00:13.13–00:13.88 | DHA chapter sweep and a quiet accent when the brain outline finishes drawing. |
| 00:20.30 | Short whip for the personal-experience chapter. |
| 00:22.85 | Sweep into the skin story. |
| 00:26.87–00:26.93 | Short whip and low impact for the DOMS reveal. |
| 00:32.12–00:32.52 | Softer sweep and pop for the two-step results qualifier. |
| 00:37.03–00:38.72 | Product sweep and hit; a quiet ticking sequence follows the capsule count to 100, ending in an original tonal accent. |
| 00:42.95 | Short whip for the packaging comparison. |
| 00:44.00–00:44.22 | Sweep and click as the comparison cards enter. |
| 00:47.13–00:48.05 | CTA whip, basket pop, and brief tonal accent. |

Each cue is stored with an exact frame, length, asset path, gain, and fade in `src/sound-design-v3.json`. The original cut voice is mixed with these cues. Studio and export use the same finished audio asset so effects cannot disappear during export.

## Mixing

- Voice remains the main audio. Effect levels are adjusted per asset rather than applying one quiet gain to every sound.
- Short envelopes prevent clicks at trimmed boundaries. Count ticks stay quieter than chapter effects.
- The mix has headroom and a peak limiter. Measure the finished AAC output before delivery.
- The new edit uses spoken audio and sound effects; no music bed is added.

## Asset sources

- Whoosh: 1bob, CC0, cached locally from [Remotion whoosh](https://www.remotion.dev/docs/sfx/whoosh).
- Whip: JW_Audio, CC0, cached locally from [Remotion whip](https://www.remotion.dev/docs/sfx/whip).
- Mouse click: Pixeliota, CC0, cached locally from [Remotion mouseClick](https://www.remotion.dev/docs/sfx/mouse-click).
- Impact, pop, counter tick, and tonal accent: original project sounds. Existing synthesized cues are raised to usable asset levels; the tonal accent is synthesized locally.

## Verification completed

- All 36 cues have audio energy in their scheduled frame windows; none are silent. Measured effect-stem peaks range from −20.43 to −7.31 dBFS, with stronger poster/transition hits and quieter counter ticks.
- The finished AAC mix measures −16.36 LUFS integrated and −1.60 dBTP true peak. These are measured input values from the final export, not predicted normalization targets.
- The complete export decoded successfully: 2947 video frames, 49.117 seconds, H.264 1080 × 1920 at 60 fps, and one AAC stereo audio stream at 48 kHz.
- The encoded picture stream has the same SHA-256 hash as the previous full-screen V3 export, confirming that its visuals, captions, poster, and cut timing were preserved without another image encode.
- Studio shows the new voice/SFX soundtrack, `sound-track-v3-sfx.m4a`. The export contains that same audio asset.
- Full subjective listening was unavailable in this tool session. Sound presence, event timing, asset levels, final loudness, peak safety, and full-file decoding were checked numerically; no claim of a complete listening review is made.

To reproduce the full export, run `pnpm run render:v3`. To update only the sound mix over the existing V3 picture, run `pnpm run audio:v3`.
