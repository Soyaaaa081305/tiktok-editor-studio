# Sources and implementation notes

Version 5.0.0 · Checked 6 October 2026

## Documentation actually opened during this upgrade

- [GPT-6.1 Sol model page](https://developers.openai.com/api/docs/models/gpt-6.1-sol): supports Max reasoning. The kit keeps the user's model choice and avoids asserting an account-wide best model or guaranteed video score.
- [GPT-6 family guidance](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-6.1-sol): family prompting advice, including autonomy and explicit work scope. It advises evaluation on the chosen workload.
- [Reasoning prompting guidance](https://developers.openai.com/api/docs/guides/reasoning-best-practices): clear goals, delimiters and concise instructions; no request for hidden chain of thought.
- [Execution-plan recipe](https://developers.openai.com/cookbook/articles/codex_exec_plans): self-contained living plans. This recipe is marked archived; only its general planning-document pattern is used, not its historical model recommendation or API setup.
- [PubMed User Guide](https://pubmed.ncbi.nlm.nih.gov/help/): concept-based queries, filters, related papers and direct article records. The kit applies these research methods without claiming a formal exhaustive systematic review.
- [Chris Beardsley's public Patreon index](https://www.patreon.com/SandCResearch/posts/frequently-asked-43097481?l=en-GB): author identity and research-topic index accessible. Specific paid graphs/posts were not inspected, downloaded or licensed by this upgrade.
- [Remotion caption grouping](https://www.remotion.dev/docs/captions/create-tiktok-style-captions): Caption-compatible input and configurable phrase pages. The API supports varied grouping; the documentation does not require our past fixed heavy caption design.

The TikTok help URL retained by the older kit, https://support.tiktok.com/en/using-tiktok/creating-videos/editing-posting-and-deleting , returned no substantive body to the current web reader. Earlier workflow notes described Select cover. The new kit makes no claim that a 0.1-second opening forces automatic selection or that it is an official minimum. No TikTok upload or native cover-picker check was performed.

## Installed guidance consulted

The local Remotion 4.0.533 router, creation, markup, captions and rendering skill instructions were read. Additional markup guidance on independently editable clip timelines and sound effects was read. It supports deterministic frame-based animation, actual-fps timing, one independently authored JSX node per editable clip, appropriate premounting and final rendering. Chosen APIs must still be checked in each project's installed version.

## Current local context — snapshot, not a universal path

Project inspected: the original Windows working project; its portable snapshot is the root of this repository.

- The config sets entry `src/index-v2.jsx`, Studio port 3000 and a Remocn element catalog.
- Package metadata lists Remotion 4.0.533, React 19.3.0, local Inter fonts, media/caption/render packages and additional effects tooling.
- Existing ATC and Ashwagandha outputs remain prior media artifacts. The prompt upgrade does not render another video or change their mixes/captions.
- No new library, transcription model, stock-media collection or music track was required for writing this kit.
- Package presence is not proof that a model, component, asset, current API or rights clearance is ready. The prompts require verification of selected items rather than catalog-wide claims.

Future jobs should inspect their actual paths/config/version instead of assuming this snapshot. Both main prompts contain enough house-style context to run without this note, the separate reference record or earlier chat history.
