import {AbsoluteFill, Easing, Freeze, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {whipPan} from '../components/remocn/whip-pan.jsx';
import {loadFont} from '@remotion/fonts';
import edit from './edit.json';
loadFont({family:'Inter',url:staticFile('ashwagandha/inter-900.woff2'),weight:'900'});
loadFont({family:'Manrope',url:staticFile('ashwagandha/manrope-800.woff2'),weight:'800'});

export const C={ink:'#17221d',paper:'#f6f4ed',white:'#ffffff',purple:'#7860c4',lilac:'#e6def5',green:'#326345',gold:'#ffe600',muted:'#666d66'};
export const FONT='Manrope, Arial, sans-serif';
export const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'};
export const ease=(frame,start,end,a=0,b=1)=>interpolate(frame,[start,end],[a,b],{...clamp,easing:Easing.bezier(.18,.8,.23,1)});
export const pop=(frame,fps,delay=0)=>spring({frame:frame-delay,fps,config:{damping:18,stiffness:190,mass:.7}});

export const Paper=({children,dark=false,style={}})=><AbsoluteFill style={{background:dark?C.ink:C.paper,color:dark?C.paper:C.ink,overflow:'hidden',fontFamily:FONT,...style}}>
 <AbsoluteFill style={{opacity:dark?.025:.035,backgroundImage:`radial-gradient(${dark?C.paper:C.ink} 1.2px, transparent 1.2px)`,backgroundSize:'24px 24px'}}/>{children}
</AbsoluteFill>;

export const Title=({children,size=80,color=C.ink,style={}})=><div style={{fontFamily:FONT,fontSize:size,fontWeight:800,letterSpacing:-2.8,lineHeight:1.04,color,...style}}>{children}</div>;
export const Eyebrow=({children,color=C.green,style={}})=><div style={{fontFamily:FONT,fontSize:30,fontWeight:800,color,display:'flex',alignItems:'center',gap:12,...style}}><span style={{display:'inline-block',width:22,height:4,background:color}}/>{children}</div>;
export const SourceNote=({children,dark=false,style={}})=><div style={{position:'absolute',left:74,top:672,fontSize:28,lineHeight:1.25,fontWeight:800,color:dark?'#d7ddd6':C.muted,...style}}>{children}</div>;

export const ClipFrame=({children,whip=false})=>{
 const frame=useCurrentFrame();
 if(!whip)return <AbsoluteFill>{children}</AbsoluteFill>;
 const presentation=whipPan({direction:'up',blur:12});
 const Component=presentation.component;
 return <Component presentationDirection="entering" presentationProgress={ease(frame,0,10)} passedProps={presentation.props}>{children}</Component>;
};

export const SpeakerWindow=({children,split=720,full=false,style={}})=>{
 const frame=useCurrentFrame();
 const drift=ease(frame,0,220,1,1.035);
 return <div style={{position:'absolute',left:0,top:full?0:split,width:1080,height:full?1920:1920-split,overflow:'hidden',background:C.ink,...style}}>
  <div style={{position:'absolute',left:0,top:full?-30:-415,width:1080,height:1920,transform:`scale(${drift})`,transformOrigin:full?'50% 32%':'50% 27%'}}>{children}</div>
  <div style={{position:'absolute',inset:0,background:'linear-gradient(0deg, rgba(12,22,16,.34) 0%,transparent 58%)',pointerEvents:'none'}}/>
 </div>;
};

export const Divider=({y=720})=><div style={{position:'absolute',top:y-5,left:0,width:1080,height:9,background:C.paper,boxShadow:'0 3px 20px rgba(0,0,0,.16)'}}/>;

export const Poster=()=>{
 const frame=useCurrentFrame();
 return <Paper dark>
  <Img src={staticFile('ashwagandha/creator.jpg')} style={{position:'absolute',inset:0,width:1080,height:1920,objectFit:'cover',transform:`translate(-120px,220px) scale(${1.19+frame*.0005})`,transformOrigin:'48% 34%',filter:'saturate(.85) contrast(1.025)'}}/>
  <AbsoluteFill style={{background:'linear-gradient(180deg,rgba(17,30,23,.98) 0%,rgba(17,30,23,.90) 21%,rgba(17,30,23,.08) 43%,rgba(17,30,23,.30) 80%,rgba(17,30,23,.86) 100%)'}}/>
  <div style={{position:'absolute',left:80,top:170,width:830}}>
   <Eyebrow color={C.lilac}>Ashwagandha + magnesium</Eyebrow>
   <Title size={104} color={C.paper} style={{marginTop:30}}>Pagod pa rin<br/><span style={{color:C.gold}}>pag gising?</span></Title>
  </div>
  <div style={{position:'absolute',left:610,top:835,width:320,height:740,border:'8px solid #f6f4ed',borderRadius:26,overflow:'hidden',transform:'rotate(5deg)',boxShadow:'0 12px 50px rgba(0,0,0,.22)'}}>
   <Img src={staticFile('ashwagandha/product.jpg')} style={{position:'absolute',left:-68,top:-5,width:490,height:871,objectFit:'cover'}}/>
  </div>
  <svg width="320" height="250" viewBox="0 0 320 250" style={{position:'absolute',left:340,top:1260,transform:'rotate(-8deg)'}}><path d="M15 180 C100 140 130 15 265 70 M227 47 L270 70 L235 99" fill="none" stroke={C.gold} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"/></svg>
  <div style={{position:'absolute',left:80,top:1580,color:C.paper,fontSize:38,fontWeight:800}}>Dr. Daily · What’s inside?</div>
 </Paper>;
};

export const CoverExit=()=>{
 const frame=useCurrentFrame();
 return <AbsoluteFill style={{
  zIndex:44,pointerEvents:'none',transformOrigin:'45% 56%',
  opacity:interpolate(frame,[0,5],[.9,0],{...clamp,easing:Easing.inOut(Easing.cubic)}),
  scale:interpolate(frame,[0,5],[1,1.035],{...clamp,easing:Easing.out(Easing.cubic)})
 }}><Freeze frame={5}><Poster/></Freeze></AbsoluteFill>;
};

export const CaptionLane=()=>{
 const frame=useCurrentFrame();const {fps}=useVideoConfig();const now=frame/fps*1000;
 const page=edit.pages.find(p=>now>=p.startMs&&now<p.endMs);
 if(!page)return null;
 return <div style={{position:'absolute',zIndex:50,left:156,top:1290,width:768,padding:'10px 24px',boxSizing:'border-box',transform:'translateY(-50%)',display:'flex',flexWrap:'wrap',justifyContent:'center',alignItems:'center',gap:'8px 13px',fontFamily:'Inter, Arial, sans-serif',fontSize:58,fontWeight:900,lineHeight:1.1,textAlign:'center',pointerEvents:'none'}}>
  {page.words.map((w,i)=>{const active=now>=w.startMs&&now<w.endMs;const local=frame-w.startMs/1000*fps;const scale=active?1+.12*Math.sin(Math.PI*Math.min(1,Math.max(0,local)/9)):1;
   return <span key={w.startMs+'-'+i} style={{whiteSpace:'pre',display:'inline-block',color:active?C.gold:C.white,WebkitTextStroke:'4px #101810',paintOrder:'stroke fill',textShadow:'0 4px 9px rgba(0,0,0,.36)',transform:`scale(${scale})`,transformOrigin:'center'}}>{w.text.trim().toUpperCase()}</span>;
  })}
 </div>;
};

export const WipeAccent=({color=C.purple})=>{
 const frame=useCurrentFrame();const travel=interpolate(frame,[0,9],[-1140,1220],{...clamp,easing:Easing.inOut(Easing.cubic)});
 return <AbsoluteFill style={{zIndex:44,pointerEvents:'none'}}><div style={{position:'absolute',top:0,left:travel,width:130,height:1920,background:color,transform:'skewX(-9deg)',opacity:.86}}/></AbsoluteFill>;
};
