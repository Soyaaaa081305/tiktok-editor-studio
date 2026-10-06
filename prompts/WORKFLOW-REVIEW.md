# Workflow and prompt review

Version 5.0.0 · 6 October 2026

## Scope of this upgrade

Two standalone reusable prompts were rebuilt from the latest conversation and saved kit. This review checks their instructions, defaults, handoff and packaging. It does not rate an unproduced video, report a new scientific finding or claim that a future render has passed.

## Requirements review

| Requested behavior | Result in the new kit |
|---|---|
| Two main prompts | 03 science scripting and 04 production; planning/filter/reference rules integrated |
| Architecture before editing | Source inventory, paper EDL, exact layer/motion/caption/SFX table, files/components and render/review plan |
| A recording-specific prompt generated automatically | execution-prompt.md saved and executed in EDIT_AND_EXPORT; delivered only in PLAN_ONLY |
| SmartFit + News Daddy | Cached creator-led clarity, literal upper insert/lower presenter, camera resets and evidence; honest reference coverage limits |
| Minimal professional finish | Real footage, useful full-frame explainers, concise type, no default cartoon/orbit/card decorations |
| Science as the foundation | PubMed/publisher research, supplied studies read, challenging findings checked, 1–3 selected sources |
| Chris Beardsley and graphs | Relevant accessible interpretation followed to underlying studies; unavailable posts noted; real data/axes/rights preserved |
| Script ready to read | One clean Taglish script, source pack and production instructions separated |
| 45–60 seconds | Speaking-pace estimate plus pauses; no rushed speech or artificial padding |
| Lighter, less fixed captions | Phrase captions, sentence case, shot-aware anchor, selective enlarged key terms |
| SFX in the actual output | Real cue plan, shared preview/export mix and final-file inclusion checks; energy is not falsely called a listening check |
| No music | Disabled by default in both prompts and JSON; explicit request required to add a bed |
| Very short thumbnail opening | Approximately 0.1s clear authentic frame; moving hook and optional short overlap transition |
| Reliable source handling | Per-claim sources/access levels, source/output time remapping, retained-speech fidelity and original-file preservation |
| Honest quality | Critical defect gates, evidence-backed rubric, no automatic 100, unperformed checks UNVERIFIED |
| Minimal prompting | Master + recording can run end to end; routine decisions made autonomously |

## Logical scenario walkthroughs

These are reviews of the instructions, not actual model runs or rendered examples.

| Scenario | Expected route and reason |
|---|---|
| Only a fitness topic is supplied | Scripting researches a narrow question and writes a supported clean-read script; education is the default |
| Clear product photo, unreadable dose | Identify readable attributes; research a defensible ingredient topic; omit guessed dose and product-specific efficacy |
| A supplied study contradicts the requested hook | Narrow/change the hook; map the revised claim; do not hunt only for supportive papers |
| Two sources report one underlying trial | Explain overlap; do not count them as independent replications |
| A paper is abstract-only | Record access level and restrict conclusions; do not invent methods/figures |
| Chris Beardsley post is locked | Mark NOT ACCESSED; finish using accessible research; a later excerpt is optional |
| A conceptual graph has no measured values | Use it only as an identified concept; no fake numerical chart or inferred dose-response curve |
| A rough script needs 75 seconds | Shorten the explanation while preserving the material boundary; no dialogue speed-up |
| Recording has only 35 coherent seconds | Prefer a truthful shorter edit and state the source limitation; no silent filler to satisfy the target |
| Source fps differs from output fps | Use source seconds/asset metadata and map to output frames; include cover/transition overlap once |
| Product label occupies the usual caption region | Reposition the caption anchor at a boundary; keep wording accurate and the phrase stable |
| FISH OIL is the emphasis word | Promote one meaningful keyword beat; avoid duplicate headline/caption copies and per-word bounce |
| The preview has SFX but export is muted | Fail the audio gate; mux the verified common soundtrack and inspect the actual new file |
| No optional B-roll is available | Use relevant real crops, supplied photos/source material or accurate original diagrams; deliver and list useful future pickups |
| Prompt-only planning is requested | PLAN_ONLY saves blueprint/execution prompt; no video mutation or export |
| A new reference is supplied for analysis | REFERENCE_UPDATE records actual coverage once; no fabricated audio findings or routine rewatch of old references |

## Consistency decisions

Retired fixed heavy captions, per-word pops, default music, maximum-effects quotas and four-core-prompt language. Kept authentic 0.1s cover, genuine footage, explanatory graphics, meaningful stacked/full-screen scenes, original speech, source-aware science and actual SFX review. Reference findings remain separate from user preferences and unknown audio details remain unknown.

The human-readable prompts are authoritative. house-style.json mirrors their defaults; automated document checks validate key values, the rubric total, required concepts, local Markdown links, UTF-8/version markers and the canonical/mirror/ZIP copies. They do not establish creative quality for future footage. Sources and implementation limitations are recorded separately.

## Completion evidence

See package-verification.json for actual checks, hashes and copy/ZIP verification. Prior canonical prompts were backed up to the recorded Archive path. Existing video outputs and inspected Remotion project files were preserved. No new video was edited or rendered as part of this prompt upgrade.
