import {Video} from '@remotion/media';
import {AbsoluteFill, Img, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Brain, Activity, ShoppingBasket, ArrowDown} from 'lucide-react';
import {MarkerHighlight} from '../components/remocn/marker-highlight.jsx';
import {C, Paper, Title, Eyebrow, SourceNote, ClipFrame, ease, pop, clamp} from './shared.jsx';

export const MineralScene=()=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();const p=pop(f,fps,6);
 const nerve=ease(f,55,78),muscle=ease(f,82,105);
 const orbitAngle=f*.0025;
 return <ClipFrame whip><Paper>
  <div style={{position:'absolute',left:74,top:170}}><Eyebrow>Ingredient 01 · mineral</Eyebrow><Title size={82} style={{marginTop:22}}>Magnesium<br/>glycinate</Title></div>
  <svg width="960" height="660" viewBox="0 0 960 660" style={{position:'absolute',left:15,top:420}}>
   <ellipse cx="480" cy="260" rx="285" ry="145" transform={`rotate(${orbitAngle*180/Math.PI} 480 260)`} fill="none" stroke="#d4c6e6" strokeWidth="3" strokeDasharray="10 12" opacity={p}/>
   <ellipse cx="480" cy="260" rx="285" ry="145" transform={`rotate(${60+orbitAngle*180/Math.PI} 480 260)`} fill="none" stroke="#d4c6e6" strokeWidth="3" opacity={p*.5}/>
   <g transform={`translate(480 260) scale(${p})`}><circle r="132" fill={C.lilac}/><circle r="113" fill={C.paper} stroke={C.purple} strokeWidth="4"/><text y="28" textAnchor="middle" fill={C.purple} fontSize="99" fontFamily="Manrope" fontWeight="800">Mg</text><text y="73" textAnchor="middle" fill={C.muted} fontSize="27" fontFamily="Manrope" fontWeight="800">magnesium</text></g>
   {[0,1].map((i)=>{const a=orbitAngle+Math.PI*i;const x=480+285*Math.cos(a),y=260+145*Math.sin(a);return <g key={i} transform={`translate(${x} ${y})`} opacity={ease(f,20+i*13,40+i*13)}><rect x="-94" y="-33" width="188" height="66" rx="33" fill={C.green}/><text y="10" textAnchor="middle" fill={C.white} fontSize="29" fontFamily="Manrope" fontWeight="800">glycine</text></g>;})}
   <path d="M390 365 Q330 457 205 485" stroke={C.purple} strokeWidth="5" fill="none" strokeDasharray="300" strokeDashoffset={300*(1-nerve)}/>
   <path d="M570 365 Q630 457 755 485" stroke={C.green} strokeWidth="5" fill="none" strokeDasharray="300" strokeDashoffset={300*(1-muscle)}/>
   {f>105&&f<200&&<circle cx={390-(f-105)%65*2.65} cy={368+(f-105)%65*1.8} r="9" fill={C.purple} opacity={nerve}/>}
  </svg>
  <div style={{position:'absolute',left:94,top:1050,width:360,textAlign:'center',opacity:nerve,transform:`translateY(${(1-nerve)*20}px)`}}><Brain size={100} color={C.purple} strokeWidth={1.5}/><Title size={48} style={{marginTop:18}}>Nerve function</Title></div>
  <div style={{position:'absolute',left:540,top:1050,width:360,textAlign:'center',opacity:muscle,transform:`translateY(${(1-muscle)*20}px)`}}><Activity size={100} color={C.green} strokeWidth={1.8}/><Title size={48} style={{marginTop:18}}>Muscle function</Title></div>
  <div style={{position:'absolute',left:90,top:1410,width:820,textAlign:'center',fontSize:43,fontWeight:800,lineHeight:1.2,color:C.ink,opacity:ease(f,86,106)}}>Magnesium supports<br/>normal nerve and muscle function.</div>
  <SourceNote style={{top:1540,fontSize:30}}>NIH ODS · ingredient fact<br/>Schematic illustration · not to scale</SourceNote>
 </Paper></ClipFrame>;
};

export const EvidenceScene=()=>{
 const f=useCurrentFrame();
 return <ClipFrame whip><Paper>
  <div style={{position:'absolute',left:74,top:190}}><Eyebrow>Ashwagandha research</Eyebrow><Title size={94} style={{marginTop:32}}>Early evidence.</Title></div>
  <div style={{position:'absolute',left:64,top:630,width:920,height:170}}><MarkerHighlight highlight="Results vary." markerColor={C.lilac} baseColor={C.ink} highlightedTextColor={C.ink} fontSize={88} fontWeight={800} speed={1.3}/></div>
  <div style={{position:'absolute',left:100,top:976,width:790,fontSize:54,fontWeight:800,lineHeight:1.2,color:C.green,opacity:ease(f,12,28)}}>Different preparations.<br/>Different results.</div>
  <SourceNote style={{top:1560,fontSize:32}}>Source: NIH Office of Dietary Supplements</SourceNote>
 </Paper></ClipFrame>;
};

export const LabelScene=()=>{
 const f=useCurrentFrame();const counter=Math.round(ease(f,16,95,0,1400));
 return <Paper dark>
  <Sequence name="Live front-bottle detail" from={0} durationInFrames={90} premountFor={60}><Video name="Full-screen genuine front bottle footage" src={staticFile('ashwagandha/source.mp4')} trimBefore={3960} trimAfter={4050} muted style={{position:'absolute',left:170,top:-50,width:1080,height:1920,transform:`scale(${1+ease(f,0,181,0,.06)})`,transformOrigin:'50% 37%'}}/></Sequence>
  <Sequence name="Authentic label freeze for readability" from={90} durationInFrames={91} premountFor={60}><Img src={staticFile('ashwagandha/front-still.jpg')} style={{position:'absolute',left:170,top:-50,width:1080,height:1920,transform:`scale(${1+ease(f,90,181,.025,.055)})`,transformOrigin:'50% 37%'}}/></Sequence>
  <AbsoluteFill style={{background:'linear-gradient(180deg,rgba(15,30,21,.84),transparent 29%,transparent 63%,rgba(15,30,21,.90) 90%)'}}/>
  <div style={{position:'absolute',left:74,top:155}}><Eyebrow color={C.lilac}>Per serving · on the label</Eyebrow></div>
  <div style={{position:'absolute',left:74,top:300,transform:`translateX(${ease(f,0,20,-45,0)}px)`,opacity:ease(f,0,15),color:C.paper}}><Title size={152} color={C.paper}>{counter.toLocaleString('en-US')}<span style={{fontSize:54,marginLeft:20}}>mg</span></Title><div style={{marginTop:14,fontSize:52,fontWeight:800,color:C.gold}}>TOTAL PER SERVING</div></div>
  <div style={{position:'absolute',left:74,top:1450,width:810,fontSize:40,lineHeight:1.25,fontWeight:800,color:C.paper}}>This is the combined blend total.</div>
 </Paper>;
};

export const CapsulesScene=()=>{
 const f=useCurrentFrame();
 return <ClipFrame whip><Paper dark>
  <Video name="User's own capsule close-up B-roll" src={staticFile('ashwagandha/source.mp4')} trimBefore={5496} trimAfter={5616} muted style={{position:'absolute',inset:0,width:1080,height:1920,transform:`scale(${ease(f,0,120,1.02,1.07)})`,transformOrigin:'50% 55%'}}/>
  <AbsoluteFill style={{background:'linear-gradient(180deg,rgba(15,30,21,.88),transparent 38%,transparent 65%,rgba(15,30,21,.80))'}}/>
  <div style={{position:'absolute',left:74,top:160}}><Eyebrow color={C.lilac}>Inside the bottle</Eyebrow><Title size={142} color={C.paper} style={{marginTop:30}}>60<span style={{fontSize:68,marginLeft:18}}>capsules</span></Title><div style={{marginTop:15,fontSize:42,fontWeight:800,color:C.paper}}>Per bottle · as stated on the label</div></div>
  <div style={{position:'absolute',left:74,top:1530,width:820,fontSize:40,fontWeight:800,color:C.paper}}>Check the label for serving directions.</div>
 </Paper></ClipFrame>;
};

export const OutroScene=()=>{
 const f=useCurrentFrame();
 return <Paper dark>
  <Video name="Final actual product duo" src={staticFile('ashwagandha/source.mp4')} trimBefore={6876} trimAfter={6969} muted style={{position:'absolute',left:0,top:0,width:1080,height:1920,transform:`scale(${1+f*.00035})`}}/>
  <AbsoluteFill style={{background:'linear-gradient(180deg,rgba(15,30,21,.93),transparent 38%,rgba(15,30,21,.55) 72%,rgba(15,30,21,.96))'}}/>
  <div style={{position:'absolute',left:74,top:164,width:830}}><Eyebrow color={C.gold}>Dr. Daily</Eyebrow><Title size={82} color={C.paper} style={{marginTop:25}}>Ashwagandha<br/>+ Magnesium</Title></div>
  <div style={{position:'absolute',left:100,top:1450,width:800,height:138,borderRadius:18,background:C.gold,color:C.ink,display:'flex',alignItems:'center',padding:'0 26px',boxSizing:'border-box',gap:23}}><ShoppingBasket size={68} strokeWidth={2}/><div style={{fontSize:43,fontWeight:800}}>Check the Yellow Basket</div><ArrowDown size={44} strokeWidth={3}/></div>
  <div style={{position:'absolute',left:100,top:1600,width:790,fontSize:30,fontWeight:800,color:C.paper,lineHeight:1.25}}>Food supplement · Results vary.</div>
 </Paper>;
};
