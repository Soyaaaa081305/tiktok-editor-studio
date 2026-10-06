import {Video} from '@remotion/media';
import {AbsoluteFill, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Moon, Sun, Dumbbell, Bell, Brain, Clock, ShoppingBasket, ArrowDown, Heart, Leaf} from 'lucide-react';
import {SoftBlurIn} from '../components/remocn/soft-blur-in.jsx';
import {C, Paper, Title, Eyebrow, SourceNote, Divider, SpeakerWindow, ClipFrame, clamp, ease, pop} from './shared.jsx';

const videoStyle={width:1080,height:1920};

const NightMorning=()=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();const day=f>=76;
 const appear=pop(f,fps);const alarm=pop(f,fps,78);
 return <Paper dark={!day}>
  <div style={{position:'absolute',left:74,top:145,opacity:appear,transform:`translateY(${(1-appear)*26}px)`}}><Eyebrow color={day?C.green:C.lilac}>The sleep-quality question</Eyebrow><Title size={76} color={day?C.ink:C.paper} style={{marginTop:20}}>{day?<>Gising na.<br/>Pagod pa rin?</>:<>Knockout<br/>ka lang?</>}</Title></div>
  <div style={{position:'absolute',left:734,top:155,transform:`scale(${day?alarm:appear}) rotate(${day?f*.18:f*.06}deg)`,color:day?C.green:C.lilac}}>{day?<Sun size={136} strokeWidth={2}/>:<Moon size={136} strokeWidth={2}/>}</div>
  <svg width="850" height="270" viewBox="0 0 850 270" style={{position:'absolute',left:74,top:390,overflow:'visible'}}>
   <g opacity={appear} transform={`translate(0 ${10*(1-appear)})`}>
    <path d="M40 60 V224 M790 110 V224 M40 171 H790 M44 173 V128 Q44 118 62 118 H718 Q785 118 789 171" fill="none" stroke={day?C.green:C.lilac} strokeWidth="10" strokeLinecap="round"/>
    <rect x="77" y="93" width="180" height="49" rx="22" fill={day?'#cfded0':'#514867'}/><path d="M265 122 Q385 48 510 92 T733 118 L733 171 H267 Z" fill={day?'#d2c5ed':'#8f7bb9'}/>
    <circle cx="292" cy="91" r="30" fill={day?'#cfded0':'#f6f4ed'}/><path d="M323 89 Q390 61 432 103" stroke={day?C.green:C.lilac} strokeWidth="6" fill="none"/>
   </g>
   {day&&<g transform={`translate(670 8) scale(${alarm})`}><circle cx="50" cy="50" r="54" fill={C.paper} stroke={C.green} strokeWidth="7"/><path d="M50 20 V50 L75 66 M0 0 L-12 -16 M100 0 L112 -16" stroke={C.green} strokeWidth="6" strokeLinecap="round" fill="none"/></g>}
   {!day&&[0,1,2].map(i=><text key={i} x={520+i*80} y={30-i*25-Math.sin((f+i*20)/30)*8} fill={C.lilac} fontSize={42+i*8} fontWeight="800" opacity={ease(f,12+i*10,35+i*10)}>{i===0?'z':'Z'}</text>)}
  </svg>
  <SourceNote dark={!day}>The difference is how you feel.</SourceNote>
 </Paper>;
};

export const HookScene=()=>{
 const f=useCurrentFrame();const stacked=f>=120;
 return <Paper dark>
  <SpeakerWindow full={!stacked}><Video name="Hook voice — original source" src={staticFile('ashwagandha/source.mp4')} trimBefore={90} trimAfter={470} muted style={videoStyle}/></SpeakerWindow>
  {!stacked&&<><div style={{position:'absolute',left:74,top:145,width:800}}><Eyebrow color={C.gold}>Better quality sleep?</Eyebrow></div><div style={{position:'absolute',left:74,top:1570,width:790,opacity:ease(f,30,48),color:C.paper,fontSize:44,fontWeight:800}}>Let’s look at the ingredients.</div></>}
  {stacked&&<><div style={{position:'absolute',left:0,top:0,width:1080,height:720,overflow:'hidden'}}><Sequence name="Night to morning illustration" from={120} durationInFrames={260} layout="none"><NightMorning/></Sequence></div><Divider/></>}
 </Paper>;
};

export const ContextScene=()=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();const stress=f>=88;const p=pop(stress?f-88:f,fps);
 return <Paper>
  <SpeakerWindow><Video name="Workout and stressful-day context" src={staticFile('ashwagandha/source.mp4')} trimBefore={704} trimAfter={862} muted style={videoStyle}/></SpeakerWindow>
  <div style={{position:'absolute',left:0,top:0,width:1080,height:720,overflow:'hidden',background:C.paper}}>
   <div style={{position:'absolute',left:74,top:145}}><Eyebrow>The everyday context</Eyebrow><Title style={{marginTop:24}}>{stress?<>High-stress<br/>day?</>:<>Workout<br/>day?</>}</Title></div>
   <div style={{position:'absolute',left:635,top:250,width:300,height:300,borderRadius:160,background:stress?C.lilac:'#dce8db',display:'flex',alignItems:'center',justifyContent:'center',transform:`scale(${p}) rotate(${stress?Math.sin(f/12)*3:-18}deg)`}}>{stress?<Brain size={190} color={C.purple} strokeWidth={1.6}/>:<Dumbbell size={190} color={C.green} strokeWidth={1.8}/>}</div>
   <svg width="900" height="180" style={{position:'absolute',left:74,top:545}}><path d={stress?'M20 90 H180 L230 30 L280 150 L330 60 L380 116 L430 82 H850':'M20 90 H850'} stroke={stress?C.purple:C.green} strokeWidth="5" fill="none" strokeDasharray="1000" strokeDashoffset={1000*(1-ease(stress?f-88:f,0,40))}/></svg>
   <SourceNote>What does your day look like?</SourceNote>
  </div><Divider/>
 </Paper>;
};

export const ProductIntroScene=()=>{
 const f=useCurrentFrame();
 return <Paper>
  <SpeakerWindow><Video name="Product introduction — synced presenter" src={staticFile('ashwagandha/source.mp4')} trimBefore={868} trimAfter={1146} muted style={videoStyle}/></SpeakerWindow>
  <div style={{position:'absolute',left:0,top:0,width:1080,height:720,overflow:'hidden'}}>
   <Sequence name="Upper front bottle insert" from={0} durationInFrames={84} premountFor={60}><Video name="Genuine front bottle B-roll" src={staticFile('ashwagandha/source.mp4')} trimBefore={3960} trimAfter={4044} muted objectFit="cover" style={{position:'absolute',left:0,top:-420,width:1080,height:1920}}/></Sequence>
   <Sequence name="Upper product duo insert" from={84} durationInFrames={114} premountFor={60}><Video name="Genuine two-bottle insert" src={staticFile('ashwagandha/source.mp4')} trimBefore={6786} trimAfter={6900} muted objectFit="cover" style={{position:'absolute',left:0,top:-420,width:1080,height:1920}}/></Sequence>
   <Sequence name="Upper ingredient label insert" from={198} durationInFrames={80} premountFor={60}><Video name="Front-label detail" src={staticFile('ashwagandha/source.mp4')} trimBefore={3960} trimAfter={4040} muted objectFit="cover" style={{position:'absolute',left:0,top:-420,width:1080,height:1920}}/></Sequence>
   <div style={{position:'absolute',inset:0,background:'linear-gradient(0deg,rgba(12,25,17,.65),transparent 48%)'}}/>
   <div style={{position:'absolute',left:74,top:145,fontSize:28,fontWeight:800,color:C.white,background:C.ink,padding:'8px 16px'}}>Dr. Daily</div>
   <div style={{position:'absolute',left:74,top:613,width:830,color:C.white,fontSize:44,fontWeight:800,lineHeight:1.15}}><span style={{display:'inline-block',opacity:ease(f,140,155),transform:`translateY(${ease(f,140,155,18,0)}px)`}}>Ashwagandha</span><span style={{display:'inline-block',marginLeft:15,opacity:ease(f,185,198)}}>+ magnesium</span></div>
  </div><Divider/>
 </Paper>;
};

const Herb=()=>{
 const f=useCurrentFrame();
 return <svg width="290" height="500" viewBox="0 0 290 500" style={{position:'absolute',left:644,top:153,transform:`rotate(${Math.sin(f/60)*2}deg)`}}>
  <path d="M150 410 C122 300 160 220 128 50" stroke={C.green} strokeWidth="8" fill="none" strokeLinecap="round"/>
  {[{x:130,y:70,r:-42},{x:155,y:148,r:42},{x:130,y:217,r:-42},{x:147,y:289,r:42}].map((l,i)=><g key={i} style={{opacity:ease(f,12+i*12,28+i*12),transformOrigin:`${l.x}px ${l.y}px`,transform:`scale(${ease(f,12+i*12,35+i*12)})`}}><path d={`M${l.x} ${l.y} C${l.x+l.r*2} ${l.y-50} ${l.x+l.r*2.7} ${l.y+22} ${l.x} ${l.y+45}Z`} fill={i%2?C.green:'#799879'} stroke={C.green} strokeWidth="3"/><path d={`M${l.x} ${l.y+35} l${l.r*1.8} -35`} stroke={C.paper} strokeWidth="2"/></g>)}
  <path d="M150 410 L85 465 M148 417 L145 486 M151 411 L205 460 M122 434 L107 474 M180 437 L199 477" stroke={C.purple} strokeWidth="6" fill="none" strokeLinecap="round" strokeDasharray="600" strokeDashoffset={600*(1-ease(f,36,65))}/>
 </svg>;
};

export const StressScene=({sourceStartFrame=2326,sourceEndFrame=2553})=>{
 const f=useCurrentFrame();
 return <Paper>
  <SpeakerWindow><Video name="Ashwagandha context — synced presenter" src={staticFile('ashwagandha/source.mp4')} trimBefore={sourceStartFrame} trimAfter={sourceEndFrame} muted style={videoStyle}/></SpeakerWindow>
  <div style={{position:'absolute',left:0,top:0,width:1080,height:720,overflow:'hidden',background:C.paper}}>
   <div style={{position:'absolute',left:74,top:145}}><Eyebrow>Ingredient 02 · herb</Eyebrow><Title size={75} style={{marginTop:25}}>Ashwagandha</Title></div><Herb/>
   <div style={{position:'absolute',left:74,top:342,width:570,height:180}}><SoftBlurIn text="Stress support?" fontSize={62} color={C.green} fontWeight={800}/></div>
   <div style={{position:'absolute',left:74,top:548,width:800,fontSize:42,fontWeight:800,lineHeight:1.16,opacity:ease(f,72,92)}}>May help; research is limited.<br/><span style={{color:C.muted,fontSize:34}}>Ingredient research; results vary.</span></div>
   <SourceNote>Source: NIH ODS</SourceNote>
  </div><Divider/>
 </Paper>;
};

export const PersonalScene=()=>{
 const f=useCurrentFrame();
 return <Paper dark>
  <SpeakerWindow full><Video name="Original personal experience — no invented testimonial" src={staticFile('ashwagandha/source.mp4')} trimBefore={3694} trimAfter={3814} muted style={videoStyle}/></SpeakerWindow>
  <div style={{position:'absolute',left:74,top:147,color:C.paper,background:C.ink,padding:'14px 24px',display:'flex',gap:15,alignItems:'center',fontSize:38,fontWeight:800,opacity:ease(f,0,14)}}><Heart size={40} strokeWidth={2}/>My personal experience</div>
  <div style={{position:'absolute',left:74,top:1460,width:810,height:120,background:C.paper,borderLeft:`8px solid ${C.purple}`,padding:'23px 30px',boxSizing:'border-box',opacity:ease(f,28,44),fontSize:40,fontWeight:800,color:C.ink}}>Individual results vary.</div>
 </Paper>;
};

export const CTAScene=()=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();const p=pop(f,fps,4);
 return <Paper>
  <SpeakerWindow><Video name="Actual Yellow Basket call to action" src={staticFile('ashwagandha/source.mp4')} trimBefore={3466} trimAfter={3567} muted style={videoStyle}/></SpeakerWindow>
  <div style={{position:'absolute',left:0,top:0,width:1080,height:720,overflow:'hidden'}}><Video name="Authentic bottle duo B-roll" src={staticFile('ashwagandha/source.mp4')} trimBefore={6786} trimAfter={6887} muted style={{position:'absolute',top:-420,left:0,width:1080,height:1920}}/><div style={{position:'absolute',inset:0,background:'linear-gradient(0deg,rgba(12,25,17,.75),transparent 75%)'}}/><div style={{position:'absolute',left:74,top:545,width:810,fontSize:48,fontWeight:800,color:C.white}}>Dr. Daily<br/>Ashwagandha + Magnesium</div></div><Divider/>
  <div style={{position:'absolute',left:100,top:1450,width:800,height:138,borderRadius:18,background:C.gold,color:C.ink,display:'flex',alignItems:'center',padding:'0 26px',boxSizing:'border-box',gap:23,transform:`translateY(${(1-p)*50}px)`,opacity:p}}><ShoppingBasket size={68} strokeWidth={2}/><div style={{fontSize:43,fontWeight:800}}>Check the Yellow Basket</div><ArrowDown size={44} strokeWidth={3} style={{transform:`translateY(${Math.sin(f/9)*5}px)`}}/></div>
 </Paper>;
};
