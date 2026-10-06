import {Audio} from '@remotion/media';
import {AbsoluteFill, Freeze, Sequence, staticFile, useVideoConfig} from 'remotion';
import {C, Poster, CoverExit, CaptionLane, WipeAccent} from './shared.jsx';
import {HookScene, ContextScene, ProductIntroScene, StressScene, PersonalScene, CTAScene} from './presenter-scenes.jsx';
import {MineralScene, EvidenceScene, LabelScene, CapsulesScene, OutroScene} from './science-scenes.jsx';
import sourceEdit from './edit.json';
import gaplessEdit from './edit-v2-gapless.json';

const shiftedPages = sourceEdit.pages.map((page) => {
 const words=page.words.map((word)=>{
  const productPauseShift=word.clipId==='product'&&word.startMs>=gaplessEdit.productPause.shiftWordsStartingAtMs?gaplessEdit.productPause.shiftMs:0;
  const clipShift=gaplessEdit.captionShiftsMsByClipId[word.clipId]??0;
  const shift=productPauseShift||clipShift;
  return {...word,startMs:word.startMs+shift,endMs:word.endMs+shift,timestampMs:word.timestampMs+shift};
 });
 return {...page,startMs:Math.min(...words.map((word)=>word.startMs)),endMs:Math.max(...words.map((word)=>word.endMs)),words};
});

export const AshwagandhaEditorial=()=> {
 const {fps}=useVideoConfig();
 return <AbsoluteFill style={{background:C.ink,overflow:'hidden','--font-geist-sans':'Manrope'}}>
  <style>{`@font-face{font-family:Inter;src:url('${staticFile('ashwagandha/inter-900.woff2')}') format('woff2');font-weight:900;font-display:block;}@font-face{font-family:Manrope;src:url('${staticFile('ashwagandha/manrope-800.woff2')}') format('woff2');font-weight:800;font-display:block;}`}</style>
  <Audio name="V2 original voice, ambient bed and remapped SFX" src={staticFile(gaplessEdit.audio.outputTrack)} premountFor={fps}/>
  <Sequence name="Real-frame thumbnail — 0.1 sec" from={0} durationInFrames={6} premountFor={fps}><Poster/></Sequence>
  <Sequence name="Hook: camera then stacked night/morning illustration" from={6} durationInFrames={380} premountFor={fps}><HookScene/></Sequence>
  <Sequence name="Upper nouns change; presenter remains below" from={386} durationInFrames={158} premountFor={fps}><ContextScene/></Sequence>
  <Sequence name="Authentic upper product B-roll + synced lower presenter" from={544} durationInFrames={234} premountFor={fps}><ProductIntroScene/></Sequence>
  <Sequence name="Outgoing product frame under mineral whip" from={778} durationInFrames={10} premountFor={fps}><Freeze frame={233}><ProductIntroScene/></Freeze></Sequence>
  <Sequence name="Magnesium schematic: complete animation under the ingredient transition" from={778} durationInFrames={126} premountFor={fps}><MineralScene/></Sequence>
  <Sequence name="Ashwagandha voice continues over the completed magnesium graphic" from={825} durationInFrames={227} premountFor={fps}>
   <Sequence name="Presenter and herb graphic enter on ashwagandha" from={79} durationInFrames={148} layout="none"><StressScene sourceStartFrame={2405} sourceEndFrame={2553}/></Sequence>
  </Sequence>
  <Sequence name="Evidence qualification over the stress-relief line" from={997} durationInFrames={55} premountFor={fps}><EvidenceScene/></Sequence>
  <Sequence name="Full-screen genuine label + total amount" from={1052} durationInFrames={181} premountFor={fps}><LabelScene/></Sequence>
  <Sequence name="Original personal experience — camera reset" from={1233} durationInFrames={120} premountFor={fps}><PersonalScene/></Sequence>
  <Sequence name="Capsule product insert over the personal-experience line" from={1233} durationInFrames={60} premountFor={fps}><CapsulesScene durationInFrames={60}/></Sequence>
  <Sequence name="Top actual product duo + bottom synced CTA" from={1353} durationInFrames={101} premountFor={fps}><CTAScene/></Sequence>
  <Sequence name="Product and action ending over the spoken CTA" from={1411} durationInFrames={43} premountFor={fps}><OutroScene/></Sequence>
  <Sequence name="Fast zoom dissolve over already-moving camera" from={6} durationInFrames={6} premountFor={fps}><CoverExit/></Sequence>
  <Sequence name="Word-led product transition" from={540} durationInFrames={10} premountFor={fps}><WipeAccent/></Sequence>
  <Sequence name="Ashwagandha visual transition" from={902} durationInFrames={10} premountFor={fps}><WipeAccent color={C.green}/></Sequence>
  <Sequence name="Label match wipe" from={1048} durationInFrames={10} premountFor={fps}><WipeAccent color={C.green}/></Sequence>
  <CaptionLane pages={shiftedPages}/>
 </AbsoluteFill>;
};
