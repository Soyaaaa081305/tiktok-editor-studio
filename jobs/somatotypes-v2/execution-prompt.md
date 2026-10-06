# Execution prompt v2

Render `SomatotypesEditorialV2` from `jobs/somatotypes-v2/edit-data.json`. Use the retained source-range EDL as the single dialogue/caption timing authority. Remove redundant spoken retakes as listed in `narrationCoverage.removedSourceRanges`; do not suppress only the subtitle while leaving the repeated speech. Preserve Taglish and complete intended lines.

Use original 60 fps presenter frames with a stable crop and no digital zoom. Use the generated 60 fps interpolation only for the short supplied 76 kg insert; leave raw sources unchanged. Retain the evidence-aware graphics and original requested riser/beat. Render 1080 × 1920/60, create a 4K upscale archive, rebuild captions and metadata, and inspect the final output and audio continuity.
