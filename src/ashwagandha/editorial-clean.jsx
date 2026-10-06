import {Audio, Video} from '@remotion/media';
import {AbsoluteFill, Easing, Freeze, Img, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFont} from '@remotion/fonts';
import edit from './edit-clean.json';
import gaplessEdit from './edit-gapless-v4.json';

loadFont({family:'Editorial',url:staticFile('ashwagandha/inter-500.woff2'),weight:'500'});
loadFont({family:'Editorial',url:staticFile('ashwagandha/inter-700.woff2'),weight:'700'});
loadFont({family:'Inter',url:staticFile('ashwagandha/inter-900.woff2'),weight:'900'});
const P={ink:'#18181b',paper:'#f4f3f0',white:'#ffffff',quiet:'#dad8d2',accent:'#c8bcdb',gold:'#ffe600'};
const font='Editorial, Inter, Arial, sans-serif';
const bounds={extrapolateLeft:'clamp',extrapolateRight:'clamp'};
const move=(f,a,b,x=0,y=1)=>interpolate(f,[a,b],[x,y],{...bounds,easing:Easing.bezier(.2,.75,.25,1)});
const photo={width:1080,height:1920,filter:'saturate(.94) contrast(1.025)'};
const heading={fontFamily:font,fontWeight:700,lineHeight:1.03,letterSpacing:-2.5};
const Shade=({top=.45,bottom=.2})=><AbsoluteFill style={{pointerEvents:'none',background:`linear-gradient(180deg,rgba(0,0,0,${top}) 0%,transparent 37%,transparent 65%,rgba(0,0,0,${bottom}) 100%)`}}/>;

const Presenter=({children,stacked=false,scale=1.025})=><div style={{position:'absolute',left:0,top:stacked?720:0,width:1080,height:stacked?1200:1920,overflow:'hidden',background:P.ink}}>
 <div style={{position:'absolute',left:0,top:stacked?-415:-30,width:1080,height:1920,scale,transformOrigin:stacked?'50% 27%':'50% 32%'}}>{children}</div>
 <Shade top={.04} bottom={.18}/>
</div>;
const Seam=()=> <div style={{position:'absolute',left:0,top:718,width:1080,height:4,background:P.paper}}/>;

export const CleanPoster=()=>{
 const f=useCurrentFrame();
 return <AbsoluteFill style={{background:P.ink,fontFamily:font,overflow:'hidden'}}>
  <Img src={staticFile('ashwagandha/creator.jpg')} style={{position:'absolute',inset:0,...photo,scale:1.025+f*.0003,transformOrigin:'50% 32%'}}/>
  <Shade top={.72} bottom={.06}/>
  <div style={{position:'absolute',left:82,top:178,width:790,fontSize:108,color:P.white,...heading}}>Pagod pa rin<br/>pag gising?</div>
 </AbsoluteFill>;
};

const CoverDissolve=()=>{
 const f=useCurrentFrame();
 return <AbsoluteFill style={{pointerEvents:'none',zIndex:40,opacity:interpolate(f,[0,5],[.9,0],{...bounds,easing:Easing.inOut(Easing.cubic)}),scale:interpolate(f,[0,5],[1,1.025],{...bounds,easing:Easing.out(Easing.cubic)}),transformOrigin:'50% 32%'}}><Freeze frame={5}><CleanPoster/></Freeze></AbsoluteFill>;
};

const Hook=()=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();
 const punch=f<120?1.025:f<260?1.075:1.04;
 return <AbsoluteFill style={{background:P.ink}}>
  <Presenter scale={punch}><Video name="Opening speech" src={staticFile('ashwagandha/source.mp4')} trimBefore={90} trimAfter={470} muted premountFor={fps} style={photo}/></Presenter>
 </AbsoluteFill>;
};

const Context=()=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();const stress=f>=88;const local=stress?f-88:f;
 return <AbsoluteFill style={{background:P.ink}}>
  <Presenter scale={1.045}><Video name="Workout and stress speech" src={staticFile('ashwagandha/source.mp4')} trimBefore={704} trimAfter={862} muted premountFor={fps} style={photo}/></Presenter>
  <Shade top={.33} bottom={.03}/>
  <div style={{position:'absolute',left:82,top:178,width:750,color:P.white,fontSize:96,...heading,opacity:move(local,0,10),translate:`0 ${move(local,0,10,10,0)}px`}}>{stress?'Stress':'Workout'}
   <div style={{height:3,width:interpolate(local,[0,14],[0,stress?245:410],bounds),background:P.gold,marginTop:22}}/>
  </div>
 </AbsoluteFill>;
};

const ProductIntro=()=>{
 const {fps}=useVideoConfig();
 return <AbsoluteFill style={{background:P.ink}}>
  <Presenter stacked><Video name="Product introduction speech" src={staticFile('ashwagandha/source.mp4')} trimBefore={868} trimAfter={1146} muted premountFor={fps} style={photo}/></Presenter>
  <div style={{position:'absolute',left:0,top:0,width:1080,height:720,overflow:'hidden'}}>
   <Sequence name="Bottle close-up" from={0} durationInFrames={84} premountFor={fps}><Video src={staticFile('ashwagandha/source.mp4')} trimBefore={3960} trimAfter={4044} muted premountFor={fps} style={{position:'absolute',left:0,top:-420,...photo}}/></Sequence>
   <Sequence name="Two bottles" from={84} durationInFrames={114} premountFor={fps}><Video src={staticFile('ashwagandha/source.mp4')} trimBefore={6786} trimAfter={6900} muted premountFor={fps} style={{position:'absolute',left:0,top:-420,...photo}}/></Sequence>
   <Sequence name="Ingredient label close-up" from={198} durationInFrames={80} premountFor={fps}><Video src={staticFile('ashwagandha/source.mp4')} trimBefore={3960} trimAfter={4040} muted premountFor={fps} style={{position:'absolute',left:0,top:-420,...photo}}/></Sequence>
  </div><Seam/>
 </AbsoluteFill>;
};

export const CleanMineral=()=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();
 return <AbsoluteFill style={{background:P.ink,color:P.white,fontFamily:font,overflow:'hidden'}}>
  <Video name="Bottle close-up during magnesium explanation" src={staticFile('ashwagandha/source.mp4')} trimBefore={3960} trimAfter={4190} muted premountFor={fps} style={{position:'absolute',left:0,top:0,...photo}}/>
  <Shade top={.78} bottom={.67}/>
  <div style={{position:'absolute',left:82,top:180,width:810,fontSize:86,...heading}}>Magnesium<br/>glycinate</div>
  <div style={{position:'absolute',left:82,top:1405,height:3,width:interpolate(f,[48,82],[0,115],bounds),background:P.accent}}/>
  <div style={{position:'absolute',left:82,top:1455,width:810,opacity:move(f,62,82),translate:`0 ${move(f,62,82,9,0)}px`,fontSize:48,fontWeight:500,lineHeight:1.22}}>
   Supports normal nerve<br/>and muscle function.
  </div>
 </AbsoluteFill>;
};

const Stress=()=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();
 return <AbsoluteFill style={{background:P.ink}}>
  <Presenter stacked><Video name="Ashwagandha speech" src={staticFile('ashwagandha/source.mp4')} trimBefore={2326} trimAfter={2553} muted premountFor={fps} style={photo}/></Presenter>
  <div style={{position:'absolute',left:0,top:0,width:1080,height:720,overflow:'hidden'}}>
   <Sequence name="Front label over ingredient speech" from={0} durationInFrames={114} premountFor={fps}><Video src={staticFile('ashwagandha/source.mp4')} trimBefore={3960} trimAfter={4074} muted premountFor={fps} style={{position:'absolute',left:0,top:-420,...photo}}/></Sequence>
   <Sequence name="Bottle pair over ingredient speech" from={114} durationInFrames={113} premountFor={fps}><Video src={staticFile('ashwagandha/source.mp4')} trimBefore={6786} trimAfter={6899} muted premountFor={fps} style={{position:'absolute',left:0,top:-420,...photo}}/></Sequence>
   <AbsoluteFill style={{background:'linear-gradient(0deg,rgba(0,0,0,.65),transparent 45%)'}}/>
   <div style={{position:'absolute',left:82,top:575,width:780,color:P.white,fontSize:62,...heading,opacity:move(f,8,22)}}>Ashwagandha</div>
  </div><Seam/>
 </AbsoluteFill>;
};

const Evidence=()=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();
 return <AbsoluteFill style={{background:P.ink,color:P.white,fontFamily:font}}>
  <Video name="Bottle pair during evidence qualification" src={staticFile('ashwagandha/source.mp4')} trimBefore={6876} trimAfter={6996} muted premountFor={fps} style={{position:'absolute',inset:0,...photo}}/>
  <Shade top={.78} bottom={.5}/>
  <div style={{position:'absolute',left:82,top:195,width:790,fontSize:81,...heading}}>May help<br/>with stress.</div>
  <div style={{position:'absolute',left:82,top:1455,width:740,fontSize:52,fontWeight:500,opacity:move(f,5,18)}}>Evidence is limited.<br/>Results vary.</div>
 </AbsoluteFill>;
};

const Label=({duration=181})=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();
 return <AbsoluteFill style={{background:P.ink,fontFamily:font,color:P.white}}>
  <Sequence name="Front-bottle detail" from={0} durationInFrames={90} premountFor={fps}><Video src={staticFile('ashwagandha/source.mp4')} trimBefore={3960} trimAfter={4050} muted premountFor={fps} style={{position:'absolute',left:0,top:0,...photo}}/></Sequence>
  <Sequence name="Label still for readability" from={90} durationInFrames={duration-90} premountFor={fps}><Img src={staticFile('ashwagandha/front-still.jpg')} style={{position:'absolute',left:0,top:0,...photo,scale:move(f,90,duration,1,1.02)}}/></Sequence>
  <Shade top={.78} bottom={.12}/>
  <div style={{position:'absolute',left:82,top:185,width:805,opacity:move(f,0,12),translate:`0 ${move(f,0,12,8,0)}px`}}>
   <div style={{fontSize:116,...heading}}>1,400 <span style={{fontSize:62,fontWeight:500}}>mg</span></div>
   <div style={{fontSize:35,fontWeight:500,lineHeight:1.3,marginTop:23}}>Combined blend · per serving</div>
  </div>
 </AbsoluteFill>;
};

const Capsules=({duration=120})=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();
 return <AbsoluteFill style={{background:P.ink,color:P.white,fontFamily:font}}>
  <Video name="Capsule close-up during the spoken directions" src={staticFile('ashwagandha/source.mp4')} trimBefore={5496} trimAfter={5496+duration} muted premountFor={fps} style={{position:'absolute',inset:0,...photo,scale:move(f,0,duration,1.01,1.035),transformOrigin:'50% 55%'}}/>
  <Shade top={.67} bottom={.06}/>
  <div style={{position:'absolute',left:82,top:185,width:805,opacity:move(f,0,12)}}>
   <div style={{fontSize:100,...heading}}>60 <span style={{fontSize:67,fontWeight:500}}>capsules</span></div>
   <div style={{fontSize:35,fontWeight:500,marginTop:20}}>Per bottle</div>
  </div>
 </AbsoluteFill>;
};

const Personal=({sourceStart=3694,sourceEnd=3814})=>{
 const {fps}=useVideoConfig();
 return <AbsoluteFill style={{background:P.ink}}>
  <Presenter scale={1.03}><Video name="Personal experience speech" src={staticFile('ashwagandha/source.mp4')} trimBefore={sourceStart} trimAfter={sourceEnd} muted premountFor={fps} style={photo}/></Presenter>
  <div style={{position:'absolute',left:82,top:1510,color:P.white,fontFamily:font,fontSize:35,fontWeight:500}}>Results vary.</div>
 </AbsoluteFill>;
};

const CTA=()=>{
 const {fps}=useVideoConfig();
 return <AbsoluteFill style={{background:P.ink}}>
  <Presenter stacked><Video name="Closing speech" src={staticFile('ashwagandha/source.mp4')} trimBefore={3466} trimAfter={3567} muted premountFor={fps} style={photo}/></Presenter>
  <div style={{position:'absolute',left:0,top:0,width:1080,height:720,overflow:'hidden'}}><Video name="Bottle pair" src={staticFile('ashwagandha/source.mp4')} trimBefore={6786} trimAfter={6887} muted premountFor={fps} style={{position:'absolute',top:-420,left:0,...photo}}/></div><Seam/>
 </AbsoluteFill>;
};

const Outro=()=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();
 return <AbsoluteFill style={{background:P.ink,color:P.white,fontFamily:font}}>
  <Video name="Final bottle pair" src={staticFile('ashwagandha/source.mp4')} trimBefore={6876} trimAfter={6969} muted premountFor={fps} style={{position:'absolute',inset:0,...photo,scale:move(f,0,93,1,1.025)}}/>
  <Shade top={.77} bottom={.6}/>
  <div style={{position:'absolute',left:82,top:184,width:800}}><div style={{fontSize:35,fontWeight:500,marginBottom:22}}>Dr. Daily</div><div style={{fontSize:65,...heading}}>Ashwagandha<br/>+ Magnesium</div></div>
  <div style={{position:'absolute',left:82,top:1460,width:790,fontSize:53,fontWeight:700}}>Yellow basket <span style={{color:P.gold}}>↓</span></div>
  <div style={{position:'absolute',left:82,top:1570,width:770,fontSize:32,fontWeight:500,color:P.quiet}}>Food supplement · Results vary.</div>
 </AbsoluteFill>;
};

const Captions=()=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();const now=f/fps*1000;
 const page=edit.pages.find(p=>now>=p.startMs&&now<p.endMs);
 if(!page)return null;
 return <div style={{position:'absolute',zIndex:50,left:156,top:1290,width:768,padding:'10px 24px',boxSizing:'border-box',translate:'0 -50%',display:'flex',flexWrap:'wrap',justifyContent:'center',alignItems:'center',gap:'8px 13px',fontFamily:'Inter, Arial, sans-serif',fontSize:58,fontWeight:900,lineHeight:1.1,textAlign:'center',pointerEvents:'none'}}>
  {page.words.map(w=><span key={w.startMs} style={{whiteSpace:'pre',color:now>=w.startMs&&now<w.endMs?P.gold:P.white,WebkitTextStroke:'3px #151515',paintOrder:'stroke fill',textShadow:'0 2px 5px rgba(0,0,0,.25)'}}>{w.text.trim().toUpperCase()}</span>)}
 </div>;
};

const GaplessCaptions=()=>{
 const f=useCurrentFrame(),{fps}=useVideoConfig(),now=f/fps*1000;
 const page=gaplessEdit.pages.find(p=>now>=p.startMs&&now<p.endMs);
 if(!page)return null;
 return <div style={{position:'absolute',zIndex:50,left:156,top:1290,width:768,padding:'10px 24px',boxSizing:'border-box',translate:'0 -50%',display:'flex',flexWrap:'wrap',justifyContent:'center',alignItems:'center',gap:'8px 13px',fontFamily:'Inter, Arial, sans-serif',fontSize:58,fontWeight:900,lineHeight:1.1,textAlign:'center',pointerEvents:'none'}}>
  {page.words.map(w=><span key={`${w.clipId}-${w.startMs}`} style={{whiteSpace:'pre',color:now>=w.startMs&&now<w.endMs?P.gold:P.white,WebkitTextStroke:'3px #151515',paintOrder:'stroke fill',textShadow:'0 2px 5px rgba(0,0,0,.25)'}}>{w.text.trim().toUpperCase()}</span>)}
 </div>;
};

const TrademarkDuringSpeech=()=>{
 const f=useCurrentFrame(),{fps}=useVideoConfig();
 const enter=interpolate(f,[0,10],[0,1],{...bounds});
 return <div style={{position:'absolute',left:68,top:570,width:944,boxSizing:'border-box',padding:'12px 15px',fontFamily:font,fontWeight:700,fontSize:31,lineHeight:1.1,color:P.white,textShadow:'0 2px 7px rgba(0,0,0,.82)',opacity:enter,translate:`0 ${(1-enter)*9}px`,textAlign:'left',pointerEvents:'none'}}>
  Like and follow for more<br/><span style={{color:P.gold}}>science-based lifting advice. God bless!</span>
 </div>;
};

export const AshwagandhaCleanEdit=()=>{
 const {fps}=useVideoConfig();
 return <AbsoluteFill style={{background:P.ink,overflow:'hidden',fontFamily:font}}>
  <Audio name="Dialogue, restrained music and selective SFX" src={staticFile('ashwagandha/soundtrack-clean.m4a')} premountFor={fps}/>
  <Sequence name="Thumbnail · 0.1s" from={0} durationInFrames={6} premountFor={fps}><CleanPoster/></Sequence>
  <Sequence name="Hook" from={6} durationInFrames={380} premountFor={fps}><Hook/></Sequence>
  <Sequence name="Workout and stress" from={386} durationInFrames={158} premountFor={fps}><Context/></Sequence>
  <Sequence name="Product introduction" from={544} durationInFrames={278} premountFor={fps}><ProductIntro/></Sequence>
  <Sequence name="Magnesium explanation" from={822} durationInFrames={230} premountFor={fps}><CleanMineral/></Sequence>
  <Sequence name="Ashwagandha" from={1052} durationInFrames={227} premountFor={fps}><Stress/></Sequence>
  <Sequence name="Evidence qualification" from={1279} durationInFrames={120} premountFor={fps}><Evidence/></Sequence>
  <Sequence name="Blend amount" from={1399} durationInFrames={181} premountFor={fps}><Label/></Sequence>
  <Sequence name="Capsules" from={1580} durationInFrames={120} premountFor={fps}><Capsules/></Sequence>
  <Sequence name="Personal experience" from={1700} durationInFrames={120} premountFor={fps}><Personal/></Sequence>
  <Sequence name="CTA" from={1820} durationInFrames={101} premountFor={fps}><CTA/></Sequence>
  <Sequence name="Ending" from={1921} durationInFrames={93} premountFor={fps}><Outro/></Sequence>
  <Sequence name="Quick cover dissolve" from={6} durationInFrames={6} premountFor={fps}><CoverDissolve/></Sequence>
  <Captions/>
 </AbsoluteFill>;
};

export const AshwagandhaGaplessEditV4=()=>{
 const {fps}=useVideoConfig();
 return <AbsoluteFill style={{background:P.ink,overflow:'hidden',fontFamily:font}}>
  <Audio name="Continuous original dialogue + 12 purposeful SFX, no music" src={staticFile('ashwagandha/soundtrack-gapless-v4.m4a')} premountFor={fps}/>
  <Sequence name="Real-frame cover · 0.1 sec" from={0} durationInFrames={6} premountFor={fps}><CleanPoster/></Sequence>
  <Sequence name="Highest effort first ten seconds · running speech" from={6} durationInFrames={380} premountFor={fps}><Hook/></Sequence>
  <Sequence name="Word-led camera section · recorded speech" from={386} durationInFrames={158} premountFor={fps}><Context/></Sequence>
  <Sequence name="Full-screen authentic product B-roll + voice" from={544} durationInFrames={278} premountFor={fps}><ProductIntro/></Sequence>
  <Sequence name="Magnesium glycinate · word-sized speech beat" from={822} durationInFrames={47} premountFor={fps}><CleanMineral/></Sequence>
  <Sequence name="Ashwagandha stress line · full relevant insert" from={869} durationInFrames={227} premountFor={fps}><Stress/></Sequence>
  <Sequence name="1,400 mg per serving · real label footage" from={1096} durationInFrames={177} premountFor={fps}><Label duration={177}/></Sequence>
  <Sequence name="Spoken capsule directions over full-screen capsules" from={1273} durationInFrames={148} premountFor={fps}><Capsules duration={148}/></Sequence>
  <Sequence name="Complete personal experience · original voice" from={1421} durationInFrames={93} premountFor={fps}><Personal sourceStart={3716} sourceEnd={3809}/></Sequence>
  <Sequence name="Recorded yellow-basket CTA · audible to final frame" from={1514} durationInFrames={101} premountFor={fps}><CTA/><TrademarkDuringSpeech/></Sequence>
  <Sequence name="6-frame zoom dissolve over already moving footage" from={6} durationInFrames={6} premountFor={fps}><CoverDissolve/></Sequence>
  <GaplessCaptions/>
 </AbsoluteFill>;
};
