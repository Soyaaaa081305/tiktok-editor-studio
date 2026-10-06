import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const job = path.join(root, 'jobs/atc-fish-oil-v4');
const sourceEdit = JSON.parse(fs.readFileSync(path.join(root, 'src/edit-data-v2.json'), 'utf8'));
const sourceSound = JSON.parse(fs.readFileSync(path.join(root, 'src/sound-design-v3.json'), 'utf8'));
const edit = {
  ...sourceEdit,
  edl: sourceEdit.edl.map((clip) => ({...clip})),
  captions: sourceEdit.captions.map((page) => ({...page, words: page.words.map((word) => ({...word}))})),
  posterFrames: 6,
};
const retain = new Set([
  'poster-hit', 'poster-exit', 'hook', 'omega-wipe', 'epa-panel', 'dha-panel',
  'epa-wipe', 'epa-node-2', 'epa-node-3', 'dha-wipe', 'brain-outline',
  'personal-wipe', 'skin-wipe', 'doms-wipe', 'results-wipe', 'results-pop',
  'product-wipe', 'count-100', 'packaging-wipe', 'cost-wipe', 'cost-click',
  'cta-wipe', 'basket-pop', 'basket-shine',
]);
const sound = {
  ...sourceSound,
  cues: sourceSound.cues.filter((cue) => retain.has(cue.id)).map((cue) => ({
    ...cue,
    frame: cue.frame === 0 ? 0 : Math.max(0, cue.frame - 18 - (cue.frame >= 2222 ? 30 : 0)),
  })),
};

const trimmedGapFrames = 30;
const gapClip = edit.edl[7];
gapClip.sourceStartFrame += trimmedGapFrames;
gapClip.durationInFrames -= trimmedGapFrames;
edit.edl.forEach((clip, index) => {
  if (index > 7) clip.outputStartFrame -= trimmedGapFrames;
});
edit.bodyDurationInFrames -= trimmedGapFrames;
edit.durationInFrames = edit.bodyDurationInFrames + edit.posterFrames;
edit.captions.forEach((page) => {
  if (page.startFrame >= 2199) {
    page.startFrame -= trimmedGapFrames;
    page.endFrame -= trimmedGapFrames;
    page.words.forEach((word) => { word.startFrame -= trimmedGapFrames; word.endFrame -= trimmedGapFrames; });
  }
});
if (edit.durationInFrames !== 2899 || edit.posterFrames !== 6) throw new Error('Fish Oil v4 cover/timeline does not match the planned frame count.');
let cursor = 0;
for (const clip of edit.edl) {
  if (clip.outputStartFrame !== cursor || clip.durationInFrames !== clip.sourceEndFrame - clip.sourceStartFrame) {
    throw new Error(`Non-contiguous dialogue edit or source mismatch at ${clip.id}.`);
  }
  cursor += clip.durationInFrames;
}
if (cursor !== edit.bodyDurationInFrames) throw new Error(`EDL ends at ${cursor}, expected ${edit.bodyDurationInFrames}.`);
for (const cue of sound.cues) {
  if (cue.frame + cue.durationInFrames > edit.durationInFrames) throw new Error(`SFX cue extends past the cut: ${cue.id}`);
}

fs.mkdirSync(job, {recursive: true});
fs.writeFileSync(path.join(root, 'src/edit-data-v4.json'), JSON.stringify(edit, null, 2) + '\n');
fs.writeFileSync(path.join(root, 'src/sound-design-v4.json'), JSON.stringify(sound, null, 2) + '\n');
fs.writeFileSync(path.join(job, 'captions.json'), JSON.stringify({fps: edit.fps, posterFrames: edit.posterFrames, timeline: 'body-relative frames; the genuine cover is excluded', captions: edit.captions}, null, 2) + '\n');
fs.writeFileSync(path.join(job, 'sfx-cues.json'), JSON.stringify({fps: edit.fps, music: false, mixedCueCount: sound.cues.length, cues: sound.cues}, null, 2) + '\n');

const plan = {
  version: '4.0.0', topic: 'ATC Fish Oil', source: 'public/source.mp4', fps: edit.fps,
  width: 1080, height: 1920, outputFrames: edit.durationInFrames,
  outputSeconds: edit.durationInFrames / edit.fps, coverFrames: edit.posterFrames,
  coverSeconds: edit.posterFrames / edit.fps, sourceVoiceIsTimelineAuthority: true,
  soundtrack: {dialogue: 'edited directly from the original recording; no generated voice', sfxCues: sound.cues.length, music: false},
  visualPlan: [
    {range: [0, 6], scene: 'Genuine product-and-hand cover for social cover capture; six frames only.'},
    {range: [6, 243], scene: 'Moving direct-to-camera hook. Cover dissolves over its first six frames; early question/title graphics ride the same speech.'},
    {range: [243, 510], scene: 'Full-frame EPA/DHA explainer; two restrained animated panels.'},
    {range: [510, 771], scene: 'Full-frame EPA signaling path; label the mechanism without a treatment promise.'},
    {range: [771, 1198], scene: 'Full-frame DHA brain/retina explainer, with general biology wording.'},
    {range: [1198, 1354], scene: 'Two-layer personal-experience card over the matching recorded presenter shot.'},
    {range: [1354, 1592], scene: 'Full-frame personal acne experience; the visual labels it as anecdotal.'},
    {range: [1592, 1910], scene: 'Two-layer DOMS graphic above the matching recorded presenter; no efficacy promise.'},
    {range: [1910, 2175], scene: 'Full-frame individual-results qualifier over continuous speech.'},
    {range: [2175, 2527], scene: 'Full-frame genuine handheld product close-up; animate the verified 100-softgel count.'},
    {range: [2527, 2593], scene: 'Short package comparison visual; no invented competitor prices.'},
    {range: [2593, 2778], scene: 'Cost-per-capsule comparison; directs viewers to compare current prices.'},
    {range: [2778, 2899], scene: 'Recorded Yellow Basket CTA with the creator signature visibly over live footage.'},
  ],
  speechEdit: edit.edl,
  evidenceAndClaimLimits: [
    'Keep acne and DOMS statements as the creator’s personal report; show results vary.',
    'Do not imply fish oil treats acne, prevents soreness, or guarantees recovery.',
    'Use EPA/DHA as general omega-3 biology; the supplied front label does not quantify their amounts.',
    'Use the visible 100 softgels claim from the authentic ATC bottle. Do not add an unsourced price or savings percentage.',
  ],
  export: {master: '2160x3840 (vertical 4K upscale), 60fps, H.264, Rec.709 SDR', upload: '1080x1920, 60fps, H.264, Rec.709 SDR, AAC 48 kHz'},
};
fs.writeFileSync(path.join(job, 'edit-plan.json'), JSON.stringify(plan, null, 2) + '\n');

const sceneRows = plan.visualPlan.map((scene) => `| ${scene.range[0]}–${scene.range[1]} | ${(scene.range[0] / edit.fps).toFixed(2)}–${(scene.range[1] / edit.fps).toFixed(2)} | ${scene.scene} |`).join('\n');
const clipRows = edit.edl.map((clip) => `| ${clip.id} | ${clip.name} | ${(clip.outputStartFrame / edit.fps).toFixed(2)} | ${(clip.durationInFrames / edit.fps).toFixed(2)} | ${(clip.sourceStartFrame / edit.fps).toFixed(2)}–${(clip.sourceEndFrame / edit.fps).toFixed(2)} |`).join('\n');
fs.writeFileSync(path.join(job, 'edit-blueprint.md'), `# ATC Fish Oil · gapless editorial v4\n\nVersion 4.0.0 · source-specific plan created 6 October 2026\n\n## Intent\n\nKeep the recorded Taglish delivery and product directions as the master timeline. The first ten seconds get the strongest hook, early visual changes, clean title treatment and meaningful transition; the middle stays speech-led; the final product/value and Yellow Basket beats receive a clearer visual finish. Alternate full-screen explanations with two-layer presenter/graphic passages. Use only the original recording, its genuine bottle close-up, and bespoke vector graphics.\n\nThe opening cover is the real handheld product still for 6 frames (0.1 s), followed by a short dissolve over moving footage. The voice is silent only during those six opening frames. Captions, graphics, transitions and selective SFX are separate picture/audio layers and never replace dialogue.\n\n## Scene map\n\n| Frames | Time (s) | Picture and graphic direction |\n|---:|---:|---|\n${sceneRows}\n\n## Dialogue source EDL\n\n| Clip | Content | Output start (s) | Duration (s) | Source range (s) |\n|---|---|---:|---:|---:|\n${clipRows}\n\n## Audio and claims\n\nUse the original edited voice, 24 selected sound effects, and no music. Keep SFX quiet under dialogue. Acne and DOMS stay personal anecdotes, not product efficacy claims. “100 softgels” comes from the authentic bottle; no unsupported price or competitor comparison. The spoken closing line is the original Yellow Basket CTA; the Noda.lifts signature is a visible overlay during that live closing footage, not fabricated speech.\n\n## Technical outputs\n\n- Vertical 60 fps, Rec.709 SDR.\n- 2160×3840 archival master is an upscale of source footage; it adds no source detail.\n- 1080×1920 H.264/AAC file is intended for TikTok Studio upload. TikTok may re-encode uploaded media; no export setting can guarantee an uncompressed platform copy.\n- Cover still is frame 0 and can be selected in TikTok Studio; automatic cover selection is not guaranteed.\n\n## Evidence notes\n\n- NIH ODS, *Omega-3 Fatty Acids: Health Professional Fact Sheet*: https://ods.od.nih.gov/factsheets/Omega3FattyAcids-HealthProfessional/ (general EPA/DHA biology; DHA is a structural component concentrated in brain and retina).\n- Dupuy et al., 2020, systematic review/meta-analysis of omega-3 and DOMS after eccentric exercise: https://pubmed.ncbi.nlm.nih.gov/32382573/ (evidence depends on trial timing/dose and should not be recast as a product-specific guarantee).\n- Borzutzky et al., 2024, prospective omega-3 acne intervention: https://pubmed.ncbi.nlm.nih.gov/38982829/ (dietary intervention; not proof that this product treats acne).\n\n`, 'utf8');
fs.writeFileSync(path.join(job, 'execution-prompt.md'), '# Execution prompt · ATC Fish Oil v4\n\nApply prompts/04-master-production-system-prompt.md, house style v6.0.0, and src/edit-data-v4.json. Treat the original spoken EDL as the timeline authority. Render ATCFishOilV4 from src/ATCFishOilV4.jsx. Preserve every selected word and keep the voice lane continuous through all full-screen graphics. Use the real source and product footage only. Deliver both the 4K60 archival upscale and 1080p60 TikTok Studio upload, with the cover, captions, selective SFX cue list, silence audit, and this blueprint. Do not claim TikTok playback remains uncompressed or that 4K upscaling restores source detail.\n');
fs.writeFileSync(path.join(job, 'narration-coverage.json'), JSON.stringify({status: 'STRUCTURAL_PASS', fps: edit.fps, totalOutputFrames: edit.durationInFrames, intentionalSilentFrames: [{start: 0, end: edit.posterFrames, reason: 'real cover hold'}], unplannedInsertedSilentFrames: 0, editedSpeechCoverage: {start: edit.posterFrames, end: edit.durationInFrames, frames: edit.bodyDurationInFrames}, sourceDialogueEdl: edit.edl.map(({id, sourceStartFrame, sourceEndFrame, outputStartFrame, durationInFrames}) => ({id, sourceStartFrame, sourceEndFrame, outputStartFrame, durationInFrames})), visualCoverage: 'All full-screen scenes are overlays over the same continuous edited voice lane.'}, null, 2) + '\n');
console.log(`Prepared ATC Fish Oil v4: ${edit.durationInFrames} frames, 0.1-second cover, ${sound.cues.length} SFX cues.`);
