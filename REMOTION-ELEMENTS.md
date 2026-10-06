# Editable elements and Studio

Start `pnpm studio` from this repository root. `remotion.config.ts` points to
`src/index-v2.jsx`, uses port 3000, and registers Remocn. Open the desired
composition in Studio; the current clean Ashwagandha ID is
`AshwagandhaEditorial`, and the full-screen Fish Oil ID is `ATCFishOilV3`.

The previously downloaded Remocn component and helper sources are under
`src/components/remocn/` and `src/lib/`. Reuse these sources for animation,
text, backgrounds, Polaroids and overlays when they serve the spoken point.
The configured registry in `components.json` supports adding a selected new
component. Browse Elements requires the project config to be loaded; starting
from another folder can cause the missing-config message.

Being listed in a catalog or installed does not put an element into a video.
Choose it in the saved edit blueprint, import or insert it, adapt it to
1080 × 1920, align it to the actual words and check the result. Use a direct
cut when no more elaborate transition is useful. Keep SFX tied to meaningful
landings. Review the selected component's dependencies, props and duration.

The broad existing Remotion package set is retained at 4.0.533. Both current
videos render without the optional approximately 10 GB transcription/matting
model cache. `pnpm models:download` rebuilds that cache locally if a future
job needs it. `pnpm sfx:download` fetches the broader catalog; check the linked
rights information for each selected sound. The release already contains
the sounds used by the saved compositions.
