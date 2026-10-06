import {Audio} from '@remotion/media';
import {AbsoluteFill, Freeze, Sequence, staticFile, useVideoConfig} from 'remotion';
import {C, Poster, CoverExit, CaptionLane, WipeAccent} from './shared.jsx';
import {HookScene, ContextScene, ProductIntroScene, StressScene, PersonalScene, CTAScene} from './presenter-scenes.jsx';
import {MineralScene, EvidenceScene, LabelScene, CapsulesScene, OutroScene} from './science-scenes.jsx';

export const AshwagandhaEditorial=()=> {
 const {fps}=useVideoConfig();
 return <AbsoluteFill style={{background:C.ink,overflow:'hidden','--font-geist-sans':'Manrope'}}>
 <style>{`@font-face{font-family:Inter;src:url('${staticFile('ashwagandha/inter-900.woff2')}') format('woff2');font-weight:900;font-display:block;}@font-face{font-family:Manrope;src:url('${staticFile('ashwagandha/manrope-800.woff2')}') format('woff2');font-weight:800;font-display:block;}`}</style>
 <Audio name="Finished original dialogue, audible SFX and original ambient bed" src={staticFile('ashwagandha/soundtrack.m4a')} premountFor={fps}/>
 <Sequence name="Real-frame thumbnail — 0.1 sec" from={0} durationInFrames={6} premountFor={fps}><Poster/></Sequence>
 <Sequence name="Hook: camera then stacked night/morning illustration" from={6} durationInFrames={380} premountFor={fps}><HookScene/></Sequence>
 <Sequence name="Upper nouns change; presenter remains below" from={386} durationInFrames={158} premountFor={fps}><ContextScene/></Sequence>
 <Sequence name="Authentic upper product B-roll + synced lower presenter" from={544} durationInFrames={278} premountFor={fps}><ProductIntroScene/></Sequence>
 <Sequence name="Outgoing product frame under mineral whip" from={822} durationInFrames={10} premountFor={fps}><Freeze frame={277}><ProductIntroScene/></Freeze></Sequence>
 <Sequence name="Full-screen magnesium schematic + normal nerve/muscle function" from={822} durationInFrames={230} premountFor={fps}><MineralScene/></Sequence>
 <Sequence name="Upper ashwa illustration + synced lower presenter" from={1052} durationInFrames={227} premountFor={fps}><StressScene/></Sequence>
 <Sequence name="Outgoing speaker frame under evidence whip" from={1279} durationInFrames={10} premountFor={fps}><Freeze frame={226}><StressScene/></Freeze></Sequence>
 <Sequence name="Full-screen evidence qualification" from={1279} durationInFrames={120} premountFor={fps}><EvidenceScene/></Sequence>
 <Sequence name="Full-screen genuine label + total amount" from={1399} durationInFrames={181} premountFor={fps}><LabelScene/></Sequence>
 <Sequence name="Outgoing label frame under capsule whip" from={1580} durationInFrames={10} premountFor={fps}><Freeze frame={180}><LabelScene/></Freeze></Sequence>
 <Sequence name="Full-screen actual capsules + verified bottle count" from={1580} durationInFrames={120} premountFor={fps}><CapsulesScene/></Sequence>
 <Sequence name="Original personal experience — camera reset" from={1700} durationInFrames={120} premountFor={fps}><PersonalScene/></Sequence>
 <Sequence name="Top actual product duo + bottom synced CTA" from={1820} durationInFrames={101} premountFor={fps}><CTAScene/></Sequence>
 <Sequence name="Product and action hold" from={1921} durationInFrames={93} premountFor={fps}><OutroScene/></Sequence>
 <Sequence name="Fast zoom dissolve over already-moving camera" from={6} durationInFrames={6} premountFor={fps}><CoverExit/></Sequence>
 <Sequence name="Word-led product transition" from={540} durationInFrames={10} premountFor={fps}><WipeAccent/></Sequence>
 <Sequence name="Label match wipe" from={1395} durationInFrames={10} premountFor={fps}><WipeAccent color={C.green}/></Sequence>
 <CaptionLane/>
</AbsoluteFill>;
};
