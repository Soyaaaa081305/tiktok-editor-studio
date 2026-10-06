# Your two-prompt TikTok workflow

Version 5.0.0 · Updated 6 October 2026

## Use these two files

| File | What you supply | What you receive |
|---|---|---|
| [03 — Science scripting](03-topic-to-script-prompt.md) | A topic, study link/PDF or clear product photo; optional personal notes | Researched 45–60-second Taglish script, 1–3 selected studies, source/claim map and recording-to-edit handoff |
| [04 — Production master](04-master-production-system-prompt.md) | Your recording; optional script/research package, photos and B-roll | Exact source-specific blueprint and execution prompt, edited MP4, cover and documented review |

Both prompts stand alone. The production master contains the saved reference grammar, planning process, design rules, implementation architecture, sound requirements and quality filter. You do not need to paste the older reference, blueprint and review prompts each time.

**The everyday flow:** topic + evidence → clean-read script → your recording → exact blueprint → Remotion edit → final-file review → delivery.

## Before recording

Attach or reference 03 and provide a topic. Study links and readable labels help, but you do not have to pre-research everything. For example:

> Use the science scripting prompt. Topic: fish oil and recovery. Make one natural 45–60-second Taglish script, research the evidence, give me 1–3 verified studies and the production handoff. Use the photos/links I attached and keep claims proportionate.

The output begins with the script you should read. Sources, estimates and edit instructions are separate. The script usually mentions one short study attribution naturally; the source pack includes all selected studies. Optional attribution lines replace a beat rather than add uncounted runtime.

Save the script package with the recording so the editor can reuse the same sources and claim IDs. Record at a comfortable pace. Useful optional footage: a clear front label, back label, hands/demo, product beside you and a brief clean room shot. These are suggestions, not a requirement that every topic include a product.

## After recording

Attach or reference 04, add the video and the script/research package when available:

> Use the production master in EDIT_AND_EXPORT. Edit this recording for TikTok, save and execute the detailed blueprint, use real footage and accurate explanatory graphics, lighter adaptive captions, selective SFX and no added music. Export and inspect the finished file. Make routine decisions and deliver the best complete result.

The master writes the precise recording-specific execution prompt itself and uses it in the same job. You do not need to construct another prompt or approve normal creative choices.

For planning only:

> Use PLAN_ONLY for this recording. Give me the exact edit blueprint and generated execution prompt.

For a new reference:

> Use REFERENCE_UPDATE. Analyze this new reference once, record actual visual/audio coverage and cache the useful findings for future jobs.

## What stays consistent

- Original, useful, science-based Taglish; normally one main takeaway supported by 1–3 selected studies.
- SmartFit-inspired educational clarity and qualified hooks, with News Daddy-style word-driven upper imagery/lower presenter when useful.
- Real footage, clear hierarchy and restrained motion. Difficult ideas can receive bespoke full-screen animation; simple ideas can stay on the presenter.
- Inter-based typography, neutral color, one warm-gold emphasis color and phone-readable text.
- Lighter phrase captions. A stable style with placement chosen for the shot; a key term can become a large foreground visual without bouncing every word.
- Dialogue and purposeful SFX. **No added music by default.**
- A genuine cover visible on frame 0 for about 0.1 second, followed by the moving hook and a short transition when suitable.
- An exact saved plan, actual final-file measurements, artifact links and an honest review record.

What changes with the topic: sources, picture choice, crops, visual explanation, exact timings and the useful amount of motion. Consistency should not make every video a copy of the same slideshow.

## Model and working setup

Keep your chosen **GPT-6.1 Sol / Max** for substantial research, planning and complex edit work. OpenAI's current model page lists support for `max` reasoning effort. This kit preserves that model choice; it does not change the app's selector. [Official model documentation](https://developers.openai.com/api/docs/models/gpt-6.1-sol).

For a finished video, use an execution-capable workflow with file access, web research, Remotion and media inspection tools. The production prompt saves an architecture plan before building; a separate planning-only run is optional. In a text-only chat the agent can write scripts and blueprints, but it cannot truthfully claim a local render without the necessary tools.

The prompts specify concrete deliverables, stage gates and review evidence. They avoid repeated “think harder” demands and requests to expose hidden reasoning. This follows the general direction of [OpenAI's prompting guidance](https://developers.openai.com/api/docs/guides/reasoning-best-practices). Higher reasoning effort is a tool for the work; the standard of the output still depends on the source, assets, evidence and review.

100/100 is the target, with no automatic perfect rating. The workflow aims to reduce drift and repair observable defects. A consistent review process cannot guarantee the same aesthetic or audience response for every recording.

## Sources and access

Research uses PubMed, original papers/publisher pages, accessible full text and relevant public agencies. The selected source pack includes direct links and access levels. The scripting prompt searches challenging as well as supportive evidence. [PubMed search guide](https://pubmed.ncbi.nlm.nih.gov/help/).

Chris Beardsley's relevant accessible posts or supplied excerpts can inform an explanation; their underlying studies support factual claims. Locked material is marked unavailable and the script continues with accessible research. The public [Chris Beardsley index](https://www.patreon.com/SandCResearch/posts/frequently-asked-43097481?l=en-GB) was accessible during this upgrade; that does not establish access to every linked post or figure.

An opening cover frame is available for the cover picker; automatic TikTok cover selection is not guaranteed. Choose the opening frame when posting if needed. The 0.1-second opening is your house preference.

## Files and versions

Your canonical folder is `prompts/` in this repository. Continue using 03 and 04. The same versioned files are provided in this output kit and its ZIP.

Supporting files are records, not extra required prompts:

- `01-style-card-smartfit-enver.md`: cached observations and evidence limits.
- `house-style.json`: machine-readable defaults and review weights matching the prompts.
- `WORKFLOW-REVIEW.md`: this upgrade's requirements and scenario review.
- `SOURCES-AND-IMPLEMENTATION-NOTES.md`: documentation checked and current local project context.

Old standalone reference/blueprint/filter prompts are replaced by short redirects to the master. Their previous contents are preserved in the canonical folder's Archive. Older ZIPs, videos and project files remain historical versions.

Do not paste old and new kits together. Use one current version for a job and record that version in its blueprint. The agent updates durable defaults only when you ask for a prompt/style change; one topic's exceptional treatment should stay in that job's notes.
