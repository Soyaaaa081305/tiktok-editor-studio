# Media and provenance

The Creatine v1 private release delta adds the user's original recording,
provided baldman and kidney GIF files, three source-article screenshots, two
stills from the source recording and the V1 edited voice track. The Creatine V2
release delta adds the revised voice track and finished MP4/cover archive. V2
uses the user-provided portrait, kidney GIF and each supplied study screenshot
as labeled image overlays; custom motion graphics explain concepts in separate
beats. The portrait's original source, identity and rights were not verified,
so it is labeled illustrative and is never presented as evidence. The kidney
GIF is labeled as an anatomy illustration. Archive contents, byte sizes and
SHA-256 values are recorded in `assets-manifest.json`.

The private media release contains the user's original Fish Oil and
Ashwagandha recordings, genuine stills extracted for the existing edits,
local font files and the actual used soundtracks/SFX. The final exports ZIP
contains the existing delivered MP4s and genuine covers without re-encoding.
Individual filenames, byte lengths and SHA-256 values are in the root manifest.

The reference TikTok videos are not redistributed. Their cached observations
are in the prompt folder, with limits on what was watched and heard.

Only three Remotion catalog sounds needed by the current edits are included:

| Local file | Attribution recorded by Remotion | License | Source |
|---|---|---|---|
| `public/sfx/remotion/whoosh.wav` | 1bob | CC0 | [Remotion whoosh](https://www.remotion.dev/docs/sfx/whoosh) |
| `public/sfx/remotion/whip.wav` | JW_Audio | CC0 | [Remotion whip](https://www.remotion.dev/docs/sfx/whip) |
| `public/sfx/remotion/mouseClick.wav` | Pixeliota | CC0 | [Remotion mouseClick](https://www.remotion.dev/docs/sfx/mouse-click) |

These three attribution pages were checked on 6 October 2026. The other unused
catalog sounds can be downloaded with the existing optional script, whose
manifest points to each sound's rights information. Downloading a package or
catalog does not clear every sound for use in a promotional edit.

The four Ashwagandha `original-*.wav` cues are deterministically synthesized
by the included script. The original ambient bed is synthesized by the older
render scripts and is preserved only as part of that snapshot. Existing local
`soft-*`/`production-*` cues are retained for Fish Oil reproduction. Font license
texts for Inter and Manrope are restored under `public/ashwagandha/licenses/`.
Proprietary Windows system fonts are not bundled.

The Remotion and third-party code packages keep their respective license
terms. The copied Remocn sources remain editable project components. This
private repository does not grant a new blanket license to third-party code,
footage, graphs or assets. Research figures for future videos need their own
accurate citation and permitted use.
