import {Audio, Video} from '@remotion/media';
import {Gif} from '@remotion/gif';
import {loadFont} from '@remotion/fonts';
import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import edit from '../jobs/creatine-v2/edit-plan.json';
import captions from '../jobs/creatine-v2/captions.json';
import sfxData from '../jobs/creatine-v2/sfx-cues.json';

const C = {ink:'#17221d', paper:'#f6f4ed', green:'#326345', gold:'#f1c75b', muted:'#677067', purple:'#7052a6'};
const FONT = 'Inter, Arial, sans-serif';
const SOURCE = staticFile('creatine/source-recording.mp4');
const clamp = {extrapolateLeft:'clamp',extrapolateRight:'clamp'};
loadFont({family:'Inter',url:staticFile('ashwagandha/inter-900.woff2'),weight:'900'});
const timedCaptions = captions.map((caption)=>{
  const segment=edit.segments.find((item)=>item.id===caption.segmentId);
  if(!segment)throw new Error('Caption references missing segment: '+caption.segmentId);
  const startFrame=segment.timelineStartFrame+caption.sourceStartFrame-segment.sourceStartFrame;
  const endFrame=segment.timelineStartFrame+caption.sourceEndFrame-segment.sourceStartFrame;
  if(caption.sourceStartFrame<segment.sourceStartFrame||caption.sourceEndFrame>segment.sourceEndFrame||endFrame<=startFrame)throw new Error('Caption falls outside its source segment: '+caption.text);
  return {...caption,startFrame,endFrame};
});
const eased=(frame,end=18)=>interpolate(frame,[0,end],[24,0],{...clamp,easing:Easing.out(Easing.cubic)});

const CaptionLane=()=>{
  const frame=useCurrentFrame();
  const line=timedCaptions.find((caption)=>frame>=caption.startFrame&&frame<caption.endFrame);
  if(!line)return null;
  return <div style={{position:'absolute',zIndex:50,left:76,right:76,bottom:250,minHeight:108,display:'flex',justifyContent:'center',alignItems:'center',padding:'12px 24px',borderRadius:18,background:'rgba(18,27,22,.8)',color:C.paper,fontFamily:FONT,fontSize:42,lineHeight:1.13,fontWeight:800,textAlign:'center',textShadow:'0 2px 10px rgba(0,0,0,.4)',transform:'translateY('+eased(frame-line.startFrame,10)+'px)'}}>{line.text}</div>;
};

const Presenter=({segment,split=false})=><>
  <Video name={'Original camera · source frame '+segment.sourceStartFrame} src={SOURCE} trimBefore={segment.sourceStartFrame} muted premountFor={60} objectFit="cover" style={{position:'absolute',inset:0,width:1080,height:1920}} />
  {split?<div style={{position:'absolute',left:0,right:0,top:940,height:980,overflow:'hidden',borderTop:'8px solid '+C.paper}}>
    <Video name={'Presenter detail · source frame '+segment.sourceStartFrame} src={SOURCE} trimBefore={segment.sourceStartFrame} muted premountFor={60} objectFit="cover" style={{position:'absolute',left:0,top:-270,width:1080,height:1920}} />
    <AbsoluteFill style={{background:'linear-gradient(0deg, rgba(12,18,15,.24), transparent 65%)'}} />
  </div>:null}
  <AbsoluteFill style={{background:'linear-gradient(180deg, rgba(9,15,12,.28), transparent 43%, rgba(9,15,12,.12) 72%, rgba(9,15,12,.40))',pointerEvents:'none'}} />
</>;

const Kicker=({children,color=C.green})=><div style={{display:'flex',alignItems:'center',gap:14,color,fontSize:25,fontWeight:800,letterSpacing:1.2,textTransform:'uppercase'}}><span style={{height:5,width:32,background:color}} />{children}</div>;
const Title=({children,size=64,color=C.ink,style={}})=><div style={{fontFamily:FONT,fontSize:size,lineHeight:1.02,fontWeight:900,letterSpacing:-2.3,color,...style}}>{children}</div>;
const PaperPanel=({children,top=64,left=48,width=984,height=820})=>{
  const frame=useCurrentFrame();
  const opacity=interpolate(frame,[0,12],[0,1],clamp);
  const rise=interpolate(frame,[0,18],[30,0],{...clamp,easing:Easing.out(Easing.cubic)});
  return <div style={{position:'absolute',top,left,width,minHeight:height,boxSizing:'border-box',padding:'46px 52px',borderRadius:25,background:C.paper,color:C.ink,boxShadow:'0 20px 55px rgba(0,0,0,.24)',fontFamily:FONT,opacity,transform:'translateY('+rise+'px)'}}>{children}</div>;
};

const Cover=()=>{
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const opacity=interpolate(frame,[5,8],[1,0],clamp);
  const scale=spring({frame:frame-1,fps,config:{damping:22,stiffness:125,mass:.7}});
  return <AbsoluteFill style={{zIndex:30,opacity,transform:'scale('+(1+scale*.01)+')',transformOrigin:'50% 45%',overflow:'hidden'}}>
    <Img src={staticFile('creatine/creator-poster-frame.jpg')} style={{width:1080,height:1920,objectFit:'cover'}} />
    <AbsoluteFill style={{background:'linear-gradient(180deg, rgba(17,30,23,.92) 0%, rgba(17,30,23,.28) 39%, rgba(17,30,23,.05) 68%, rgba(17,30,23,.68) 100%)'}} />
    <div style={{position:'absolute',left:66,top:150,width:885}}>
      <Kicker color={C.gold}>Creatine · 3 myths checked</Kicker>
      <Title size={102} color={C.paper} style={{marginTop:24}}>Nakakalbo?<br/>Nakakasira ng bato?</Title>
    </div>
    <div style={{position:'absolute',left:70,bottom:165,color:C.paper,fontFamily:FONT,fontSize:27,fontWeight:800}}>Ano ba talaga ang ipinapakita ng studies?</div>
  </AbsoluteFill>;
};

const HookTitle=()=> <div style={{position:'absolute',top:108,left:62,width:880,color:C.paper,fontFamily:FONT,fontWeight:900,lineHeight:1.06,fontSize:64,letterSpacing:-1.5,textShadow:'0 3px 16px rgba(0,0,0,.8)'}}>Creatine myths,<br/><span style={{color:C.gold}}>what does evidence say?</span></div>;

const ChapterCard=({number,title,accent=C.gold})=>{
  const frame=useCurrentFrame();
  return <div style={{position:'absolute',zIndex:12,left:56,top:185+eased(frame),width:850,padding:'27px 32px',boxSizing:'border-box',background:'rgba(23,34,29,.93)',borderLeft:'10px solid '+accent,color:C.paper,fontFamily:FONT,boxShadow:'0 12px 32px rgba(0,0,0,.3)'}}><Kicker color={accent}>Myth {number} / 3</Kicker><Title size={65} color={C.paper} style={{marginTop:17}}>{title}</Title></div>;
};

const ScreenshotPanel=({file,kicker,note,imageHeight=390})=>{
  const frame=useCurrentFrame();
  const opacity=interpolate(frame,[0,12],[0,1],clamp);
  const y=interpolate(frame,[0,16],[26,0],{...clamp,easing:Easing.out(Easing.cubic)});
  return <div style={{position:'absolute',zIndex:24,left:38,top:72,width:1004,boxSizing:'border-box',padding:'18px 20px 20px',borderRadius:22,background:C.paper,color:C.ink,boxShadow:'0 18px 48px rgba(0,0,0,.34)',fontFamily:FONT,opacity,transform:'translateY('+y+'px)'}}>
    <Kicker>{kicker}</Kicker>
    <Img src={staticFile('creatine/research/'+file)} style={{display:'block',width:'100%',height:imageHeight,marginTop:14,objectFit:'contain',background:'#fff',borderRadius:8}} />
    <div style={{marginTop:12,fontSize:22,lineHeight:1.15,fontWeight:800,color:C.ink}}>{note}</div>
  </div>;
};

const ResearchClaimContext=()=> <ScreenshotPanel file="2021-review.png" kicker="2021 evidence review · supplied screenshot" imageHeight={360} note="The review cites 500+ peer-reviewed creatine publications; it does not establish a #1 ranking across all supplements." />;

const HairOrigin=()=> <PaperPanel height={820}>
  <Kicker>Hair loss · where the claim started</Kicker>
  <Title size={58} style={{marginTop:26}}>A 2009 rugby study<br/>measured DHT</Title>
  <div style={{display:'flex',gap:20,marginTop:30}}>
    <div style={{flex:1,padding:23,background:'#e6def5',borderRadius:16}}><div style={{fontSize:23,fontWeight:800,color:C.purple}}>TRIAL</div><div style={{fontSize:38,fontWeight:900,marginTop:8}}>20 enrolled</div><div style={{fontSize:23,lineHeight:1.2,marginTop:8}}>16 completed · college rugby · 3 weeks</div></div>
    <div style={{flex:1,padding:23,background:'#fff',borderRadius:16}}><div style={{fontSize:23,fontWeight:800,color:C.green}}>WHAT IT DID NOT TEST</div><div style={{fontSize:34,fontWeight:900,marginTop:8}}>Hair loss</div><div style={{fontSize:23,lineHeight:1.2,marginTop:8}}>It measured hormone levels.</div></div>
  </div>
  <div style={{position:'absolute',left:52,right:52,bottom:30,color:C.muted,fontSize:20,fontWeight:700}}>van der Merwe et al. · Clin J Sport Med · 2009 · PMID 19741313</div>
</PaperPanel>;

const HairEvidence=()=> <PaperPanel height={850}>
  <Kicker>Direct hair measurements · 2025</Kicker>
  <Title size={56} style={{marginTop:20}}>No significant<br/>group differences</Title>
  <div style={{display:'flex',alignItems:'center',gap:18,marginTop:18}}>
    <div style={{flex:1}}><div style={{fontSize:67,fontWeight:900,color:C.green}}>38 <span style={{fontSize:26,color:C.ink}}>completed</span></div><div style={{fontSize:26,fontWeight:800,marginTop:8}}>12 weeks · 5 g/day</div><div style={{marginTop:14,padding:18,borderRadius:15,background:'#fff',fontSize:24,lineHeight:1.2,fontWeight:700}}>DHT and measured hair outcomes were similar between creatine and placebo groups.</div></div>
    <div style={{width:260,flexShrink:0,textAlign:'center'}}><div style={{overflow:'hidden',height:254,borderRadius:20,border:'6px solid white',boxShadow:'0 5px 17px rgba(0,0,0,.2)'}}><Img src={staticFile('creatine/user-asset-baldman.avif')} style={{width:'100%',height:'100%',objectFit:'cover'}} /></div><div style={{marginTop:8,fontSize:16,lineHeight:1.12,fontWeight:800,color:C.muted}}>Illustrative portrait only · no creatine or hair-loss link</div></div>
  </div>
  <div style={{position:'absolute',left:52,right:52,bottom:28,color:C.muted,fontSize:19,fontWeight:700}}>One small, short trial in healthy young men · Lak et al. · PMID 40265319</div>
</PaperPanel>;

const CreatinineGraphic=()=>{
  const frame=useCurrentFrame();
  const arrow=interpolate(frame,[0,24],[0,18],{...clamp,easing:Easing.out(Easing.cubic)});
  return <PaperPanel top={58} height={800}>
    <Kicker color={C.green}>Kidney myth · understand the marker</Kicker>
    <Title size={58} style={{marginTop:20}}>Creatine → creatinine</Title>
    <div style={{display:'flex',gap:15,alignItems:'center',marginTop:26}}><div style={{flex:1,borderRadius:16,background:'#fff',padding:22,fontSize:31,fontWeight:900}}>Creatine</div><div style={{fontSize:42,color:C.green,fontWeight:900,transform:'translateX('+arrow+'px)'}}>→</div><div style={{flex:1.25,borderRadius:16,background:'#e5ecdf',padding:22,fontSize:29,fontWeight:900}}>Creatinine</div></div>
    <div style={{marginTop:22,fontSize:25,lineHeight:1.2,fontWeight:700}}>Creatinine is a blood-test marker. A change by itself does not prove kidney injury.</div>
    <div style={{marginTop:20,padding:'17px 20px',borderRadius:15,background:C.ink,color:C.paper,fontSize:23,lineHeight:1.2,fontWeight:700}}>The 2013 trial used a direct GFR measure in 26 healthy resistance-trained men for 12 weeks.</div>
    <div style={{position:'absolute',left:52,right:52,bottom:25,color:C.muted,fontSize:19,fontWeight:700}}>Lugaresi et al. · JISSN · 2013 · PMID 23680457 · not a kidney-disease safety test</div>
  </PaperPanel>;
};

const KidneyAnatomy=()=>{
  const frame=useCurrentFrame();
  const scale=interpolate(frame,[0,18],[.97,1],{...clamp,easing:Easing.out(Easing.cubic)});
  return <div style={{position:'absolute',zIndex:22,left:105,top:190,width:870,padding:20,borderRadius:24,background:'rgba(17,30,23,.95)',border:'5px solid '+C.paper,boxShadow:'0 18px 48px rgba(0,0,0,.35)',transform:'scale('+scale+')',fontFamily:FONT}}>
    <Kicker color={C.gold}>Supplied anatomy GIF · illustration only</Kicker>
    <div style={{height:480,marginTop:12,overflow:'hidden',borderRadius:14,background:'#170e0b'}}><Gif src={staticFile('creatine/user-asset-kidney.gif')} width={830} height={480} fit="contain" loopBehavior="loop" style={{display:'block',width:'100%',height:'100%'}} /></div>
    <div style={{marginTop:11,fontSize:21,lineHeight:1.15,fontWeight:800,color:C.paper}}>Anatomy illustration · it does not show creatine causing kidney damage.</div>
  </div>;
};

const KidneyTrialEvidence=()=> <ScreenshotPanel file="2013-kidney-trial.png" kicker="2013 kidney trial · supplied screenshot" imageHeight={340} note="26 healthy resistance-trained men · 12 weeks · measured GFR · does not establish safety for kidney disease." />;

const KidneyExplainVisual=()=>{
  const frame=useCurrentFrame();
  return frame<304?<CreatinineGraphic/>:<KidneyTrialEvidence/>;
};

const WeightQuestionVisual=()=> <ChapterCard number="3" title="Weight & bloating" accent={C.gold}/>;
const BodyWaterStudy=()=> <ScreenshotPanel file="2003-body-composition.png" kicker="2003 body-composition trial · supplied screenshot" imageHeight={310} note="17 active men · 4 weeks · high-dose protocol. Measured total body water and body-fat %; not intracellular distribution." />;

const WaterWeightGraphic=()=>{
  const frame=useCurrentFrame();
  const particles=[0,1,2,3,4].map((index)=>{
    const progress=((frame/115+index*.2)%1);
    return {x:85+progress*325,y:70+(index%3)*44,opacity:progress>.82?.28:.85};
  });
  return <PaperPanel height={850}>
    <Kicker color={C.green}>Body weight ≠ body fat</Kicker>
    <Title size={58} style={{marginTop:22}}>Water can move<br/>the scale</Title>
    <div style={{display:'flex',gap:16,marginTop:25}}>
      <div style={{flex:1,padding:22,background:'#e4ecdf',borderRadius:16}}><div style={{fontSize:23,fontWeight:800}}>4-WEEK TRIAL</div><div style={{fontSize:57,color:C.green,fontWeight:900,marginTop:5}}>17</div><div style={{fontSize:21,lineHeight:1.18,fontWeight:700}}>active men · small sample</div></div>
      <div style={{flex:1.1,padding:22,background:'#fff',borderRadius:16}}><div style={{fontSize:25,fontWeight:900}}>↑ body water</div><div style={{fontSize:25,fontWeight:900,marginTop:12}}>↔ body-fat %</div><div style={{fontSize:20,lineHeight:1.16,marginTop:10,color:C.muted}}>No significant change in this short, high-dose study.</div></div>
    </div>
    <div style={{position:'absolute',left:58,top:470,width:850,height:214}}>
      <svg width="850" height="155" viewBox="0 0 850 155" role="img" aria-label="Conceptual water movement into a muscle fiber"><rect x="330" y="8" width="465" height="128" rx="64" fill="#e5ecdf" stroke="#326345" strokeWidth="6"/><text x="560" y="84" textAnchor="middle" fontFamily={FONT} fontSize="27" fontWeight="800" fill="#17221d">MUSCLE FIBER</text><text x="50" y="142" fontFamily={FONT} fontSize="18" fontWeight="700" fill="#677067">H₂O · conceptual</text>{particles.map((p,i)=><circle key={i} cx={p.x} cy={p.y} r="10" fill={C.gold} stroke={C.green} strokeWidth="3" opacity={p.opacity}/>)}</svg>
      <div style={{position:'absolute',left:0,right:0,bottom:0,color:C.muted,fontSize:18,fontWeight:700}}>Illustration only; this study measured total body water, not intracellular distribution.</div>
    </div>
    <div style={{position:'absolute',left:52,right:52,bottom:24,color:C.muted,fontSize:19,fontWeight:700}}>Kutz & Gunter · 2003 · PMID 14636103 · 30 g/day, then 15 g/day</div>
  </PaperPanel>;
};

const DoseCard=()=>{
  const {fps}=useVideoConfig();
  return <PaperPanel top={56} height={850}>
    <Kicker>Simple maintenance dose</Kicker>
    <Title size={58} style={{marginTop:20}}>3–5 g daily</Title>
    <div style={{marginTop:15,width:535,fontSize:26,fontWeight:700,lineHeight:1.22}}>A common maintenance range in the 2021 review. The product label says 5 g per serving.</div>
    <div style={{position:'absolute',top:34,right:29,width:302,height:524,overflow:'hidden',borderRadius:18,border:'4px solid '+C.paper,boxShadow:'0 4px 15px rgba(0,0,0,.19)'}}><Video name="Original product demo · creator holds creatine" src={SOURCE} trimBefore={4*fps} muted premountFor={fps} objectFit="cover" style={{width:'100%',height:'100%'}} /></div>
    <div style={{position:'absolute',left:52,right:52,bottom:29,color:C.muted,fontSize:20,fontWeight:700}}>Label information is a product fact, not medical endorsement · Antonio et al. · 2021 · PMID 33557850</div>
  </PaperPanel>;
};

const ProductCTA=()=>{
  return <>
    <div style={{position:'absolute',zIndex:18,top:105,left:50,width:610,padding:'32px 36px',background:C.paper,borderRadius:23,color:C.ink,fontFamily:FONT,boxShadow:'0 15px 45px rgba(0,0,0,.28)'}}>
      <Kicker color={C.green}>Creator’s personal pick</Kicker><Title size={51} style={{marginTop:18}}>Link in the comments</Title>
      <div style={{fontSize:25,lineHeight:1.23,fontWeight:700,marginTop:15}}>Dr. Daily · Creatine Monohydrate<br/>150 g · 30 servings · 5 g per serving</div>
      <div style={{marginTop:14,color:C.muted,fontSize:18,fontWeight:700}}>No approved therapeutic claims</div>
    </div>
  </>;
};

const VisualForSegment=({segment,index})=>{
  switch(index){
    case 0:return <><Presenter segment={segment}/><HookTitle/></>;
    case 1:return <><Presenter segment={segment} split/><ResearchClaimContext/></>;
    case 2:return <><Presenter segment={segment}/><ChapterCard number="1" title="Hair loss"/></>;
    case 3:return <><Presenter segment={segment} split/><HairOrigin/></>;
    case 4:return <><Presenter segment={segment} split/><HairEvidence/></>;
    case 5:return <><Presenter segment={segment} split/><ScreenshotPanel file="2021-review.png" kicker="2021 review · supplied screenshot" imageHeight={390} note="This review discusses testosterone measurements, not direct hair-loss trials."/></>;
    case 6:return <><Presenter segment={segment}/><KidneyAnatomy/></>;
    case 7:return <><Presenter segment={segment} split/><KidneyExplainVisual/></>;
    case 8:return <><Presenter segment={segment}/><WeightQuestionVisual/></>;
    case 9:return <><Presenter segment={segment} split/><BodyWaterStudy/></>;
    case 10:return <><Presenter segment={segment} split/><WaterWeightGraphic/></>;
    case 11:return <><Presenter segment={segment} split/><DoseCard/></>;
    case 12:return <><Presenter segment={segment}/><ProductCTA/></>;
    default:return <Presenter segment={segment}/>;
  }
};

export const CreatineMythsV2=()=>{
  const {fps}=useVideoConfig();
  const sfx=sfxData.cues;
  return <AbsoluteFill style={{background:C.ink,overflow:'hidden',fontFamily:FONT}}>
    <Audio name="Edited original Taglish voice · no music" src={staticFile('creatine/voice-edit-v2.wav')} volume={1} premountFor={fps}/>
    <Sequence name={edit.segments[0].label} from={edit.segments[0].timelineStartFrame} durationInFrames={edit.segments[0].durationInFrames} premountFor={fps}><VisualForSegment segment={edit.segments[0]} index={0}/></Sequence>
    <Sequence name={edit.segments[1].label} from={edit.segments[1].timelineStartFrame} durationInFrames={edit.segments[1].durationInFrames} premountFor={fps}><VisualForSegment segment={edit.segments[1]} index={1}/></Sequence>
    <Sequence name={edit.segments[2].label} from={edit.segments[2].timelineStartFrame} durationInFrames={edit.segments[2].durationInFrames} premountFor={fps}><VisualForSegment segment={edit.segments[2]} index={2}/></Sequence>
    <Sequence name={edit.segments[3].label} from={edit.segments[3].timelineStartFrame} durationInFrames={edit.segments[3].durationInFrames} premountFor={fps}><VisualForSegment segment={edit.segments[3]} index={3}/></Sequence>
    <Sequence name={edit.segments[4].label} from={edit.segments[4].timelineStartFrame} durationInFrames={edit.segments[4].durationInFrames} premountFor={fps}><VisualForSegment segment={edit.segments[4]} index={4}/></Sequence>
    <Sequence name={edit.segments[5].label} from={edit.segments[5].timelineStartFrame} durationInFrames={edit.segments[5].durationInFrames} premountFor={fps}><VisualForSegment segment={edit.segments[5]} index={5}/></Sequence>
    <Sequence name={edit.segments[6].label} from={edit.segments[6].timelineStartFrame} durationInFrames={edit.segments[6].durationInFrames} premountFor={fps}><VisualForSegment segment={edit.segments[6]} index={6}/></Sequence>
    <Sequence name={edit.segments[7].label} from={edit.segments[7].timelineStartFrame} durationInFrames={edit.segments[7].durationInFrames} premountFor={fps}><VisualForSegment segment={edit.segments[7]} index={7}/></Sequence>
    <Sequence name={edit.segments[8].label} from={edit.segments[8].timelineStartFrame} durationInFrames={edit.segments[8].durationInFrames} premountFor={fps}><VisualForSegment segment={edit.segments[8]} index={8}/></Sequence>
    <Sequence name={edit.segments[9].label} from={edit.segments[9].timelineStartFrame} durationInFrames={edit.segments[9].durationInFrames} premountFor={fps}><VisualForSegment segment={edit.segments[9]} index={9}/></Sequence>
    <Sequence name={edit.segments[10].label} from={edit.segments[10].timelineStartFrame} durationInFrames={edit.segments[10].durationInFrames} premountFor={fps}><VisualForSegment segment={edit.segments[10]} index={10}/></Sequence>
    <Sequence name={edit.segments[11].label} from={edit.segments[11].timelineStartFrame} durationInFrames={edit.segments[11].durationInFrames} premountFor={fps}><VisualForSegment segment={edit.segments[11]} index={11}/></Sequence>
    <Sequence name={edit.segments[12].label} from={edit.segments[12].timelineStartFrame} durationInFrames={edit.segments[12].durationInFrames} premountFor={fps}><VisualForSegment segment={edit.segments[12]} index={12}/></Sequence>
    <Sequence name={edit.segments[13].label} from={edit.segments[13].timelineStartFrame} durationInFrames={edit.segments[13].durationInFrames} premountFor={fps}><VisualForSegment segment={edit.segments[13]} index={13}/></Sequence>
    {sfx.map((cue,index)=><Sequence key={cue.frame} name={`Sound cue ${index+1}`} from={cue.frame} durationInFrames={60} premountFor={fps}><Audio src={staticFile(cue.file)} volume={cue.volume}/></Sequence>)}
    <Sequence name="Authentic opening cover · first 0.1 second" from={0} durationInFrames={6} premountFor={fps}><Cover/></Sequence>
    <CaptionLane/>
  </AbsoluteFill>;
};
export const CREATINE_V2_DURATION_IN_FRAMES=edit.durationInFrames;
