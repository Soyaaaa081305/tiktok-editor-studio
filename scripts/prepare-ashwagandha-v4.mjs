import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const project=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=JSON.parse(fs.readFileSync(path.join(project,'src/ashwagandha/edit-clean.json'),'utf8'));
const sound=JSON.parse(fs.readFileSync(path.join(project,'src/ashwagandha/sound-design-clean.json'),'utf8'));
const byId=new Map(source.edl.map(c=>[c.id,c]));
const seq=[
 ['poster',0,6,null,null],
 ['hook',6,380,90,470],
 ['context',386,158,704,862],
 ['product',544,278,868,1146],
 ['mineral-voice',822,47,1590,1637],
 ['stress',869,227,2326,2553],
 ['label',1096,177,3141,3318],
 ['capsules',1273,148,3318,3466],
 ['personal',1421,93,3716,3809],
 ['cta',1514,101,3466,3567],
];
const purpose={
 hook:'Original spoken hook with fast, frame-0 cover dissolve and deliberate camera punch-ins.',
 context:'Keep the actual sentence fragment attached to the hook; do not amplify the unsupported population-wide magnesium-deficiency phrase.',
 product:'Creator speech remains audible beneath genuine upper product footage.',
 'mineral-voice':'Only the spoken ingredient name; no silent explanatory hold or added absorption claim.',
 stress:'Original ashwagandha sentence, synchronized lower presenter and relevant upper insert.',
 label:'Original 1,400 mg total/per-serving line; genuine label imagery; label amount is not portrayed as elemental magnesium.',
 capsules:'Restore the creator’s recorded “2 capsules, 30 minutes before bed” line over the capsule insert; verify the current package directions before reusing as advice.',
 personal:'Full original “This really helped me sa totoo lang” anecdote, kept as personal experience.',
 cta:'Recorded yellow-basket call to action; add the visible trademark while spoken audio continues; no silent outro.'
};
const timeline=seq.map(([id,from,durationInFrames,sourceStartFrame,sourceEndFrame])=>({
 ...byId.get(id),id,from,durationInFrames,sourceStartFrame,sourceEndFrame,
 purpose:purpose[id]??byId.get(id)?.purpose??'Original source audio.'
}));
const targetDuration=seq.at(-1)[1]+seq.at(-1)[2];
const shift={hook:0,context:0,product:0,'mineral-voice':0,stress:-183,label:-303,capsules:null,personal:null,cta:-306};
const frameFromId={'hook':0,'context':386,'product':544,'mineral-voice':822,'stress':1052,'label':1399,'capsules':1580,'personal':1700,'cta':1820};
const pages=[];
for(const page of source.pages){
 const clip=page.words?.[0]?.clipId;
 if(!Object.hasOwn(shift,clip)||shift[clip]===null)continue;
 const d=shift[clip]*1000/source.fps;
 const words=page.words.map(w=>({...w,startMs:w.startMs+d,endMs:w.endMs+d,timestampMs:w.timestampMs==null?null:w.timestampMs+d}));
 pages.push({...page,startMs:page.startMs+d,endMs:page.endMs+d,words});
}
const ms=f=>f*1000/source.fps;
pages.push({startMs:ms(1273),endMs:ms(1321),words:[
 {text:'Two',startMs:ms(1275),endMs:ms(1294),timestampMs:ms(1284),confidence:null,clipId:'capsules'},
 {text:' capsules',startMs:ms(1294),endMs:ms(1321),timestampMs:ms(1307),confidence:null,clipId:'capsules'}]});
pages.push({startMs:ms(1321),endMs:ms(1421),words:[
 {text:'30',startMs:ms(1321),endMs:ms(1340),timestampMs:ms(1330),confidence:null,clipId:'capsules'},
 {text:' minutes',startMs:ms(1340),endMs:ms(1370),timestampMs:ms(1355),confidence:null,clipId:'capsules'},
 {text:' before',startMs:ms(1370),endMs:ms(1392),timestampMs:ms(1381),confidence:null,clipId:'capsules'},
 {text:' bed',startMs:ms(1392),endMs:ms(1421),timestampMs:ms(1406),confidence:null,clipId:'capsules'}]});
pages.push({startMs:ms(1421),endMs:ms(1483),words:[
 {text:'This',startMs:ms(1421),endMs:ms(1430),timestampMs:ms(1425),confidence:null,clipId:'personal'},
 {text:' really',startMs:ms(1430),endMs:ms(1449),timestampMs:ms(1440),confidence:null,clipId:'personal'},
 {text:' helped',startMs:ms(1449),endMs:ms(1474),timestampMs:ms(1461),confidence:null,clipId:'personal'},
 {text:' me',startMs:ms(1474),endMs:ms(1483),timestampMs:ms(1478),confidence:null,clipId:'personal'}]});
pages.push({startMs:ms(1483),endMs:ms(1514),words:[
 {text:'sa',startMs:ms(1483),endMs:ms(1492),timestampMs:ms(1487),confidence:null,clipId:'personal'},
 {text:' totoo',startMs:ms(1492),endMs:ms(1503),timestampMs:ms(1497),confidence:null,clipId:'personal'},
 {text:' lang.',startMs:ms(1503),endMs:ms(1514),timestampMs:ms(1508),confidence:null,clipId:'personal'}]});
const cueShift={'Cover dissolve':0,'First camera punch':0,'Workout emphasis':0,'Stress emphasis':0,'Product cut':0,'Ingredient explanation cut':0,'Ashwagandha cut':-183,'Label detail':-303,'Amount landing':-303,'Capsule detail':-307,'Personal camera reset':-279,'CTA entrance':-306};
const cues=sound.cues.filter(c=>Object.hasOwn(cueShift,c.id)).map(c=>({...c,frame:c.frame+cueShift[c.id]}));
const result={
 version:'4.1.0-gapless',sourcePromptVersion:'6.0.0',fps:source.fps,width:source.width,height:source.height,
 posterFrames:6,durationInFrames:targetDuration,musicEnabled:false,
 composition:'AshwagandhaEditorialGaplessV4',sourceVideo:'public/ashwagandha/source.mp4',
 sourceTranscript:'../ashwagandha/source-transcript.json',edl:timeline,pages,cues,
 audioContract:{allDialogueSourceIntervalsAdjacent:true,coverSilentFrames:6,maxAuthoredDialogueGapFrames:0,voiceTargetLufs:-15,finalTargetLufs:-14.5,truePeakCeilingDbTP:-1.6,sfxCues:cues.length},
 decisions:['Removed every added silent hold from the previous 33.57 s edit (516 frames / 8.6 s, excluding the intentional 6-frame cover); the capsule insert now carries the original recorded directions.','Trimmed 48 frames of detected source silence before the personal line and remapped its captions to the audible onset.','The new 26.92 s program is net 399 frames / 6.65 s shorter than the previous edit.','Moved full-screen words and product overlays onto actual relevant recorded dialogue; dialogue runs underneath each overlay.','The tagline is visible during the final spoken basket CTA; this source does not contain a spoken trademark line.','No fabricated voice, extra health-effect narration, music bed, or silent explanatory slides.']
};
for(let i=1;i<timeline.length;i++){
 const prev=timeline[i-1],next=timeline[i];
 if(prev.from+prev.durationInFrames!==next.from)throw Error(`Picture gap or overlap between ${prev.id} and ${next.id}`);
 if(next.sourceStartFrame!==null&&next.sourceEndFrame-next.sourceStartFrame!==next.durationInFrames)throw Error(`Speech/source-duration mismatch on ${next.id}`);
}
const dialogueTimeline=timeline.filter(c=>c.sourceStartFrame!==null);
if(dialogueTimeline[0]?.from!==result.posterFrames)throw Error('Dialogue must begin immediately after the intentional cover.');
for(let i=1;i<dialogueTimeline.length;i++)if(dialogueTimeline[i-1].from+dialogueTimeline[i-1].durationInFrames!==dialogueTimeline[i].from)throw Error(`Dialogue gap between ${dialogueTimeline[i-1].id} and ${dialogueTimeline[i].id}`);
for(const cue of cues)if(cue.frame<0||cue.frame+cue.durationInFrames>targetDuration)throw Error(`SFX cue outside timeline: ${cue.id}`);
fs.writeFileSync(path.join(project,'src/ashwagandha/edit-gapless-v4.json'),JSON.stringify({...source,...result},null,2)+'\n');
fs.writeFileSync(path.join(project,'src/ashwagandha/sound-design-gapless-v4.json'),JSON.stringify({voiceTargetLufs:-15,finalTargetLufs:-14.5,peakLimitDb:-1.6,ambientGain:0,musicEnabled:false,cues},null,2)+'\n');
const jobs=path.join(project,'jobs/ashwagandha-gapless-v4');fs.mkdirSync(jobs,{recursive:true});
fs.writeFileSync(path.join(jobs,'narration-coverage.json'),JSON.stringify({version:'1.0.0',fps:source.fps,durationInFrames:targetDuration,dialogueIntervals:dialogueTimeline.map(c=>({id:c.id,sourceInFrame:c.sourceStartFrame,sourceOutFrame:c.sourceEndFrame,outputInFrame:c.from,outputOutFrame:c.from+c.durationInFrames})),authoredSilence:[{id:'genuine-cover',outputInFrame:0,outputOutFrame:6,reason:'0.1-second platform-cover image'}],removedSourceSilence:[{id:'personal-leading-pause',sourceInFrame:3668,sourceOutFrame:3716,sourceSilenceDetectSeconds:0.811646}],expectedUnexplainedDialogueGaps:0},null,2)+'\n');
fs.writeFileSync(path.join(jobs,'edit-plan.json'),JSON.stringify(result,null,2)+'\n');
fs.writeFileSync(path.join(jobs,'sfx-cues.json'),JSON.stringify(result.cues,null,2)+'\n');
fs.writeFileSync(path.join(jobs,'captions.json'),JSON.stringify(pages.flatMap(p=>p.words),null,2)+'\n');
fs.writeFileSync(path.join(jobs,'edit-blueprint.md'),`# Ashwagandha V4 — continuous-narration edit\n\n${targetDuration} frames at 60 fps · ${(targetDuration/60).toFixed(2)} seconds · 1080 × 1920 composition.\n\nThe previous edit contained 516 frames (8.6 seconds) of added silent holds outside its intentional 6-frame cover. All those holds are gone: the capsule insert now carries 148 frames (2.47 seconds) of the creator’s original recorded directions. The final program is net 351 frames (5.85 seconds) shorter than the previous 33.57-second edit. Dialogue remains on its own continuous audio track underneath every insert and motion graphic; only the genuine six-frame cover is intentionally silent.\n\n| Output [start,end) | Source [start,end) | Beat | Picture/speech plan |\n|---|---|---|---|\n${timeline.map(c=>`| ${c.from}–${c.from+c.durationInFrames} | ${c.sourceStartFrame??'cover'}–${c.sourceEndFrame??''} | ${c.id} | ${c.purpose} |`).join('\n')}\n\nThe light caption placement, punch-ins, upper product inserts and restrained full-screen word graphics preserve the approved Ashwagandha V3 visual language. Every phrase caption follows the retained spoken line. Product directions use the creator’s original recorded wording; check the current physical label before turning that line into future dosage advice. The anecdote stays explicitly personal. The closing signature appears during the audible CTA; no separate silent outro was added.\n\nMusic is off. Twelve existing selected SFX cues are frame-aligned and remain audible over the mix. The common soundtrack is mixed to house targets and attached to both 4K and 1080p deliverables. Source is original 1080p/60 footage; a 4K master cannot add missing camera detail.\n\n## Review\n\nCheck the actual video and soundtrack at the hook, each takeover and cut, the Mg ingredient word, Ashwagandha line, 1,400 mg/serving, the restored capsule instruction, personal line, final CTA/signature and last frame. Verify H.264, 60 fps, expected decoded frame count, Rec.709, AAC, peak/loudness, subtitle legibility and absence of unplanned silence.\n`);
const blueprintPath=path.join(jobs,'edit-blueprint.md');
let blueprint=fs.readFileSync(blueprintPath,'utf8');
blueprint=blueprint.replace('# Ashwagandha V4 — continuous-narration edit','# Ashwagandha V4.1 — continuous-narration edit');
blueprint=blueprint.replace('The final program is net 351 frames (5.85 seconds) shorter than the previous 33.57-second edit.','A 0.81-second near-silent lead-in before the personal line was removed and its captions were retimed to the actual audible phrase. The final program is net 399 frames (6.65 seconds) shorter than the previous 33.57-second edit.');
fs.writeFileSync(blueprintPath,blueprint);
fs.writeFileSync(path.join(jobs,'execution-prompt.md'),`Execute jobs/ashwagandha-gapless-v4/edit-plan.json in the real Remotion project. Implement AshwagandhaEditorialGaplessV4 with independently editable clips and the saved speech-bound captions. Keep the six-frame genuine cover, 0.1-second dissolve, approved light/dark palette, real original footage and full-screen text/product inserts. Do not create any explanatory frames without matching narration. Preserve exact recorded line timings; restore the recorded two-capsules/30-minutes wording over the capsule insert. Use voice plus the saved 12 cue events with music disabled. Render a 4K60 H.264 master and 1080×1920/60 H.264 TikTok upload, both with the same AAC soundtrack. Inspect the exported files and report any check that was not performed.\n`);
console.log(`Saved ${targetDuration} frames, ${pages.length} caption pages and ${cues.length} non-silent SFX cues; timeline has no inserted holds.`);
