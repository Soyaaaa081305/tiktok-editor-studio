# ATC Fish Oil TikTok Edit — V3

> The latest delivery includes synchronized sound effects: `atc-fish-oil-tiktok-v3-sfx.mp4`. See `atc-fish-oil-sfx-plan-v3.md` for the sound map and verification. The original V3 export documented below was the version without effects. `pnpm run render:v3` now produces the corrected SFX version.

## Delivery

- 49.12 seconds, vertical 1080 × 1920, 60 fps.
- TikTok-ready 9:16 H.264 MP4 with AAC stereo audio at 48 kHz.
- Taglish voice and original caption timing retained from the supplied take.
- Sound effects and added music are off. The poster’s first 0.4 seconds are silent; the cut spoken track follows.
- Motion graphics are full-frame Remotion scenes. The product close-up uses the creator’s real ATC bottle photo; hook and basket CTA use the original camera footage.

## Timeline

| Output time | Visual treatment |
|---|---|
| 00:00.00–00:00.40 | Real-frame poster: “3 reasons I use fish oil.” |
| 00:00.40–00:01.50 | Direct-to-camera opening line, full vertical frame. |
| 00:01.50–00:04.35 | Full-screen hook question and animated title. |
| 00:04.35–00:08.80 | Full-frame EPA and DHA explainer; animated entry and molecular marks. |
| 00:08.80–00:13.15 | Full-screen EPA signaling diagram with moving signal path. |
| 00:13.15–00:20.27 | Full-screen DHA brain and retina illustration. |
| 00:20.27–00:22.87 | Personal-experience chapter card. |
| 00:22.87–00:26.83 | Full-screen abstract skin-layer animation; anecdote stays personal. |
| 00:26.83–00:32.13 | Full-screen muscle-fiber animation for the DOMS anecdote. |
| 00:32.13–00:37.05 | Results-vary interstitial. |
| 00:37.05–00:42.92 | Full-frame authentic bottle photo with animated count to 100 softgels. |
| 00:42.92–00:44.02 | Full-screen bottle-versus-blister-pack illustration. |
| 00:44.02–00:47.10 | Animated cost-per-capsule comparison; no made-up prices or savings figure. |
| 00:47.10–00:49.12 | Original product-in-hand CTA shot with animated Yellow Basket graphic. |

## TikTok framing and captions

- Full-screen vertical 9:16 composition at 1080 × 1920.
- Main copy sits in the central-left safe area. The animated captions keep a right-side margin for TikTok’s interaction controls and stay above the lower navigation/description area.
- Captions retain the supplied Taglish words and timing, with restrained active-word emphasis.
- TikTok’s guidance recommends 9:16 and keeping key text/product inside the safe zone; that zone can change with the app UI and CTA elements. [TikTok Creative Codes](https://ads.tiktok.com/business/library/Creative_Codes_May_2023.pdf) · [TikTok video advertising guide](https://ads.tiktok.com/business/en/guides/video-advertising-guide)

## Content notes

- EPA and DHA graphics explain general omega-3 biology; they do not say this product treats a condition.
- Acne and DOMS remain framed as the creator’s own experience. “Results vary” is shown as a qualifier.
- The bottle count follows the spoken 100-softgel claim. No dose, product potency, price, certification, or quantified savings was added.
- No stock footage or extra sound was added.

## Editable source

- Composition: `ATCFishOilV3` in `work/atc-fish-oil-remotion/src/ATCFishOilV3.jsx`.
- Timeline and caption cues are reused from `src/edit-data-v2.json`.
- To render again from the project folder, run `pnpm run render:v3`. The script renders the video, restores the selected original spoken sections, and exports the final MP4 to `outputs/`.
