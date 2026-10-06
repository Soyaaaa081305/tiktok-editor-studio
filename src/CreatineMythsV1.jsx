import {Audio, Video} from '@remotion/media';
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
import edit from '../jobs/creatine-v1/edit-plan.json';
import captions from '../jobs/creatine-v1/captions.json';
import {loadFont} from '@remotion/fonts';

const C = {
  ink: '#17221d',
  paper: '#f6f4ed',
  green: '#326345',
  gold: '#F1C75B',
  muted: '#677067',
  purple: '#7052a6',
};
const FONT = 'Inter, Arial, sans-serif';
const SOURCE = staticFile('creatine/source-recording.mp4');
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'};
loadFont({family: 'Inter', url: staticFile('ashwagandha/inter-900.woff2'), weight: '900'});
const timedCaptions = captions.map((caption) => {
  const segment = edit.segments.find((item) => item.id === caption.segmentId);
  if (!segment) throw new Error(`Caption references missing segment: ${caption.segmentId}`);
  return {
    ...caption,
    startFrame: segment.timelineStartFrame + caption.sourceStartFrame - segment.sourceStartFrame,
    endFrame: segment.timelineStartFrame + caption.sourceEndFrame - segment.sourceStartFrame,
  };
});

const eased = (frame, end = 18) => interpolate(frame, [0, end], [24, 0], {...clamp});

const CaptionLane = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const line = timedCaptions.find((caption) => frame >= caption.startFrame && frame < caption.endFrame);
  if (!line) return null;
  return (
    <div
      style={{
        position: 'absolute',
        zIndex: 40,
        left: 88,
        right: 88,
        bottom: 250,
        minHeight: 112,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '12px 24px',
        borderRadius: 18,
        background: 'rgba(18, 27, 22, .76)',
        color: C.paper,
        fontFamily: FONT,
        fontSize: 43,
        lineHeight: 1.13,
        fontWeight: 800,
        textAlign: 'center',
        textShadow: '0 2px 10px rgba(0,0,0,.4)',
        transform: `translateY(${eased(frame - line.startFrame, 10)}px)`,
      }}
    >
      {line.text}
    </div>
  );
};

const Presenter = ({segment, split = false}) => (
  <>
    <Video
      name={`Original camera · source frame ${segment.sourceStartFrame}`}
      src={SOURCE}
      trimBefore={segment.sourceStartFrame}
      muted
      premountFor={60}
      style={{position: 'absolute', inset: 0, width: 1080, height: 1920, objectFit: 'cover'}}
    />
    {split ? (
      <div style={{position: 'absolute', left: 0, right: 0, top: 940, height: 980, overflow: 'hidden', borderTop: `8px solid ${C.paper}`}}>
        <Video
          name={`Presenter close crop · source frame ${segment.sourceStartFrame}`}
          src={SOURCE}
          trimBefore={segment.sourceStartFrame}
          muted
          premountFor={60}
          style={{position: 'absolute', left: 0, top: -270, width: 1080, height: 1920, objectFit: 'cover'}}
        />
        <AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(12,18,15,.24), transparent 65%)'}} />
      </div>
    ) : null}
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(9,15,12,.28), transparent 43%, rgba(9,15,12,.12) 72%, rgba(9,15,12,.40))', pointerEvents: 'none'}} />
  </>
);

const Kicker = ({children, color = C.green}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 14, color, fontSize: 27, fontWeight: 800, letterSpacing: 1.3, textTransform: 'uppercase'}}>
    <span style={{height: 5, width: 32, background: color}} />{children}
  </div>
);

const Title = ({children, size = 70, color = C.ink, style = {}}) => (
  <div style={{fontFamily: FONT, fontSize: size, lineHeight: 1.02, fontWeight: 900, letterSpacing: -2.4, color, ...style}}>{children}</div>
);

const PaperPanel = ({children, top = 68, left = 54, width = 972, height = 800}) => (
  <PaperPanelContent top={top} left={left} width={width} height={height}>{children}</PaperPanelContent>
);

const PaperPanelContent = ({children, top, left, width, height}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 14], [0, 1], {...clamp});
  const rise = interpolate(frame, [0, 18], [34, 0], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <div style={{position: 'absolute', top, left, width, minHeight: height, boxSizing: 'border-box', padding: '48px 54px', borderRadius: 26, background: C.paper, color: C.ink, boxShadow: '0 20px 55px rgba(0,0,0,.24)', fontFamily: FONT, opacity, transform: `translateY(${rise}px)`}}>
      {children}
    </div>
  );
};

const Cover = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const opacity = interpolate(frame, [5, 8], [1, 0], {...clamp});
  const scale = spring({frame: frame - 1, fps, config: {damping: 22, stiffness: 125, mass: 0.7}});
  return (
    <AbsoluteFill style={{zIndex: 20, opacity, transform: `scale(${1 + scale * .01})`, transformOrigin: '50% 45%', overflow: 'hidden'}}>
      <Img src={staticFile('creatine/creator-poster-frame.jpg')} style={{width: 1080, height: 1920, objectFit: 'cover'}} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(17,30,23,.91) 0%, rgba(17,30,23,.28) 38%, rgba(17,30,23,.05) 68%, rgba(17,30,23,.68) 100%)'}} />
      <div style={{position: 'absolute', left: 66, top: 150, width: 885}}>
        <Kicker color={C.gold}>Creatine · 3 myths checked</Kicker>
        <Title size={102} color={C.paper} style={{marginTop: 24}}>Nakakalbo?<br/>Nakakasira ng bato?</Title>
      </div>
      <div style={{position: 'absolute', left: 70, bottom: 165, color: C.paper, fontFamily: FONT, fontSize: 27, fontWeight: 800}}>Ano ba talaga ang ipinapakita ng studies?</div>
    </AbsoluteFill>
  );
};

const HookTitle = () => (
  <div style={{position: 'absolute', top: 112, left: 62, width: 860, color: C.paper, fontFamily: FONT, fontWeight: 900, lineHeight: 1.06, fontSize: 67, letterSpacing: -1.7, textShadow: '0 3px 16px rgba(0,0,0,.8)'}}>
    Creatine myths,<br/><span style={{color: C.gold}}>what does evidence say?</span>
  </div>
);

const ChapterCard = ({number, title, accent = C.gold}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{position: 'absolute', left: 56, top: 190 + eased(frame), width: 850, padding: '28px 34px', boxSizing: 'border-box', background: 'rgba(23,34,29,.92)', borderLeft: `10px solid ${accent}`, color: C.paper, fontFamily: FONT, boxShadow: '0 12px 32px rgba(0,0,0,.3)'}}>
      <Kicker color={accent}>Myth {number} / 3</Kicker>
      <Title size={66} color={C.paper} style={{marginTop: 18}}>{title}</Title>
    </div>
  );
};

const HairOrigin = () => (
  <PaperPanel height={820}>
    <Kicker>Hair loss · where it started</Kicker>
    <Title size={58} style={{marginTop: 27}}>A 2009 rugby study<br/>measured DHT</Title>
    <div style={{display: 'flex', gap: 22, marginTop: 32}}>
      <div style={{flex: 1, padding: 24, background: '#e6def5', borderRadius: 16}}>
        <div style={{fontSize: 24, fontWeight: 800, color: C.purple}}>TRIAL</div>
        <div style={{fontSize: 39, fontWeight: 900, marginTop: 10}}>20 enrolled</div>
        <div style={{fontSize: 24, lineHeight: 1.2, marginTop: 9}}>16 completed · college rugby · 3 weeks</div>
      </div>
      <div style={{flex: 1, padding: 24, background: '#fff', borderRadius: 16}}>
        <div style={{fontSize: 24, fontWeight: 800, color: C.green}}>WHAT IT DIDN'T TEST</div>
        <div style={{fontSize: 35, fontWeight: 900, marginTop: 10}}>Hair loss</div>
        <div style={{fontSize: 25, lineHeight: 1.2, marginTop: 9}}>It measured hormone levels.</div>
      </div>
    </div>
    <div style={{position: 'absolute', left: 54, right: 54, bottom: 32, color: C.muted, fontSize: 21, fontWeight: 700}}>van der Merwe et al. · Clin J Sport Med · 2009 · PMID 19741313</div>
  </PaperPanel>
);

const HairEvidence = () => (
  <PaperPanel height={800}>
    <Kicker>Direct hair measurements · 2025</Kicker>
    <Title size={60} style={{marginTop: 24}}>No significant<br/>group differences</Title>
    <div style={{display: 'flex', alignItems: 'baseline', gap: 18, marginTop: 25}}>
      <div style={{fontSize: 72, fontWeight: 900, color: C.green}}>38</div>
      <div style={{fontSize: 28, fontWeight: 800}}>completed · 12 weeks · 5 g/day</div>
    </div>
    <div style={{marginTop: 15, padding: 24, borderRadius: 16, background: '#fff', fontSize: 28, lineHeight: 1.2, fontWeight: 700}}>
      DHT and measured hair outcomes were similar between creatine and placebo groups.
    </div>
    <div style={{position: 'absolute', left: 54, right: 54, bottom: 32, color: C.muted, fontSize: 21, fontWeight: 700}}>One small, short trial in healthy young men · Lak et al. · PMID 40265319</div>
  </PaperPanel>
);

const CreatinineDiagram = () => {
  const frame = useCurrentFrame();
  const arrowNudge = Math.sin(frame / 6) * 6;
  return (
    <PaperPanel top={52} height={815}>
      <Kicker color={C.green}>Kidney myth · understand the marker</Kicker>
      <Title size={58} style={{marginTop: 24}}>Creatine → creatinine</Title>
      <div style={{display: 'flex', gap: 14, alignItems: 'center', marginTop: 31}}>
        <div style={{flex: 1, borderRadius: 17, background: '#fff', padding: 24, fontSize: 32, fontWeight: 900}}>Creatine</div>
        <div style={{fontSize: 42, color: C.green, fontWeight: 900, transform: `translateX(${arrowNudge}px)`}}>→</div>
        <div style={{flex: 1.3, borderRadius: 17, background: '#e5ecdf', padding: 24, fontSize: 30, fontWeight: 900}}>Creatinine</div>
      </div>
      <div style={{marginTop: 23, fontSize: 26, lineHeight: 1.22, fontWeight: 700}}>Creatinine is a blood-test marker. Creatine can raise it without proving kidney injury.</div>
      <div style={{marginTop: 24, padding: '18px 22px', borderRadius: 16, background: C.ink, color: C.paper, fontSize: 24, lineHeight: 1.2, fontWeight: 700}}>
        In one 12-week trial, measured GFR did not significantly change in 26 healthy resistance-trained men on a high-protein diet.
      </div>
      <div style={{position: 'absolute', left: 54, right: 54, bottom: 25, color: C.muted, fontSize: 19, fontWeight: 700}}>Lugaresi et al. · JISSN · 2013 · PMID 23680457 · Does not establish safety for kidney disease.</div>
    </PaperPanel>
  );
};

const MuscleWaterDiagram = () => {
  const frame = useCurrentFrame();
  const particles = [0, 1, 2, 3, 4].map((index) => {
    const progress = ((frame / 120 + index * 0.21) % 1);
    return {x: 78 + progress * 360, y: 46 + (index % 3) * 28, opacity: progress > 0.82 ? 0.25 : 0.85};
  });
  return (
    <div style={{position: 'absolute', left: 58, top: 552, width: 856, height: 232}}>
      <svg width="856" height="166" viewBox="0 0 856 166" role="img" aria-label="Conceptual water movement into a muscle fiber">
        <rect x="330" y="14" width="475" height="132" rx="66" fill="#e5ecdf" stroke="#326345" strokeWidth="6" />
        <text x="567" y="94" textAnchor="middle" fontFamily={FONT} fontSize="28" fontWeight="800" fill="#17221d">MUSCLE FIBER</text>
        <text x="72" y="151" fontFamily={FONT} fontSize="18" fontWeight="700" fill="#677067">H₂O · conceptual</text>
        {particles.map((particle, index) => (
          <circle key={index} cx={particle.x} cy={particle.y + 40} r="10" fill={C.gold} stroke={C.green} strokeWidth="3" opacity={particle.opacity}/>
        ))}
      </svg>
      <div style={{position: 'absolute', left: 4, right: 4, bottom: 0, color: C.muted, fontSize: 19, fontWeight: 700}}>Illustration only; the 2003 trial measured total body water, not intracellular distribution.</div>
    </div>
  );
};

const WaterWeight = () => (
  <PaperPanel height={840}>
    <Kicker color={C.green}>Body weight ≠ body fat</Kicker>
    <Title size={59} style={{marginTop: 25}}>Water can move<br/>the scale</Title>
    <div style={{display: 'flex', gap: 18, marginTop: 30}}>
      <div style={{flex: 1, padding: 25, background: '#e4ecdf', borderRadius: 16}}>
        <div style={{fontSize: 25, fontWeight: 800}}>4-WEEK TRIAL</div>
        <div style={{fontSize: 61, color: C.green, fontWeight: 900, marginTop: 8}}>17</div>
        <div style={{fontSize: 23, lineHeight: 1.2, fontWeight: 700}}>active men · small sample</div>
      </div>
      <div style={{flex: 1.1, padding: 25, background: '#fff', borderRadius: 16}}>
        <div style={{fontSize: 27, fontWeight: 900}}>↑ body water</div>
        <div style={{fontSize: 27, fontWeight: 900, marginTop: 18}}>↔ body-fat %</div>
        <div style={{fontSize: 21, lineHeight: 1.18, marginTop: 15, color: C.muted}}>No significant change in this short, high-dose study.</div>
      </div>
    </div>
    <MuscleWaterDiagram/>
    <div style={{position: 'absolute', left: 54, right: 54, bottom: 30, color: C.muted, fontSize: 20, fontWeight: 700}}>Kutz & Gunter · 2003 · PMID 14636103 · 30 g/day, then 15 g/day</div>
  </PaperPanel>
);

const DoseCard = () => (
  <PaperPanel top={56} height={850}>
    <Kicker>Simple maintenance dose</Kicker>
    <Title size={58} style={{marginTop: 20}}>3–5 g daily</Title>
    <div style={{marginTop: 15, width: 545, fontSize: 27, fontWeight: 700, lineHeight: 1.22}}>A common maintenance range in the 2021 review. Your product label says 5 g per serving.</div>
    <div style={{position: 'absolute', top: 34, right: 29, width: 308, height: 530, overflow: 'hidden', borderRadius: 18, border: `4px solid ${C.paper}`, boxShadow: '0 4px 15px rgba(0,0,0,.19)'}}>
      <Img src={staticFile('creatine/package-frame.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
    </div>
    <div style={{position: 'absolute', left: 54, right: 54, bottom: 31, color: C.muted, fontSize: 21, fontWeight: 700}}>Label information is a product fact, not a medical endorsement · Antonio et al. · 2021 · PMID 33557850</div>
  </PaperPanel>
);

const ProductCTA = () => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 24) * 5;
  return (
  <>
    <div style={{position: 'absolute', top: 102, left: 54, width: 570, padding: '34px 38px', background: C.paper, borderRadius: 24, color: C.ink, fontFamily: FONT, boxShadow: '0 15px 45px rgba(0,0,0,.28)'}}>
      <Kicker color={C.green}>Creator's personal pick</Kicker>
      <Title size={54} style={{marginTop: 22}}>Link in the comments</Title>
      <div style={{fontSize: 26, lineHeight: 1.25, fontWeight: 700, marginTop: 17}}>Dr. Daily · Creatine Monohydrate<br/>150 g · 30 servings · 5 g per serving</div>
      <div style={{marginTop: 18, color: C.muted, fontSize: 19, fontWeight: 700}}>No approved therapeutic claims</div>
    </div>
    <div style={{position: 'absolute', right: 48, top: 790, width: 360, height: 720, border: `7px solid ${C.paper}`, borderRadius: 24, overflow: 'hidden', boxShadow: '0 12px 44px rgba(0,0,0,.3)', transform: 'rotate(2deg)'}}>
      <Img src={staticFile('creatine/package-frame.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(1.02) translateY(${drift}px)`}} />
    </div>
  </>
  );
};

const Outro = () => (
  <div style={{position: 'absolute', left: 65, top: 160, width: 860, fontFamily: FONT, fontSize: 58, lineHeight: 1.05, fontWeight: 900, color: C.paper, textShadow: '0 3px 16px rgba(0,0,0,.8)'}}>
    Science-based lifting advice.<br/><span style={{color: C.gold}}>God bless!</span>
  </div>
);

const VisualForSegment = ({segment, index}) => {
  switch (index) {
    case 0:
      return <><Presenter segment={segment}/><HookTitle/></>;
    case 1:
      return <><Presenter segment={segment}/><ChapterCard number="1" title="Hair loss"/></>;
    case 2:
      return <><Presenter segment={segment} split/><HairOrigin/></>;
    case 3:
      return <><Presenter segment={segment} split/><HairEvidence/></>;
    case 4:
      return <><Presenter segment={segment}/><ChapterCard number="2" title="Kidney damage" accent={C.gold}/></>;
    case 5:
    case 6:
      return <Presenter segment={segment} split/>;
    case 7:
      return <><Presenter segment={segment}/><ChapterCard number="3" title="Weight & bloating"/></>;
    case 8:
      return <><Presenter segment={segment} split/><WaterWeight/></>;
    case 9:
      return <><Presenter segment={segment} split/><DoseCard/></>;
    case 10:
    case 11:
      return <><Presenter segment={segment}/><ProductCTA/></>;
    default:
      return <><Presenter segment={segment}/><Outro/></>;
  }
};

export const CreatineMythsV1 = () => {
  const {fps} = useVideoConfig();
  const sfx = [
    {from: edit.segments[2].timelineStartFrame, file: 'whoosh.wav', volume: 0.14},
    {from: edit.segments[3].timelineStartFrame, file: 'mouseClick.wav', volume: 0.11},
    {from: edit.segments[5].timelineStartFrame, file: 'mouseClick.wav', volume: 0.10},
    {from: edit.segments[8].timelineStartFrame, file: 'mouseClick.wav', volume: 0.10},
  ];
  return (
    <AbsoluteFill style={{background: C.ink, overflow: 'hidden', fontFamily: FONT}}>
      <Audio name="Edited original Taglish voice · no music" src={staticFile('creatine/voice-edit.wav')} volume={1} premountFor={fps}/>
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
      <Sequence name="Kidney evidence graphic spans both recorded clauses" from={edit.segments[5].timelineStartFrame} durationInFrames={edit.segments[5].durationInFrames + edit.segments[6].durationInFrames} premountFor={fps}><CreatinineDiagram/></Sequence>
      <Sequence name="Sound cue 1" from={sfx[0].from} durationInFrames={60} premountFor={fps}><Audio src={staticFile(`sfx/remotion/${sfx[0].file}`)} volume={sfx[0].volume}/></Sequence>
      <Sequence name="Sound cue 2" from={sfx[1].from} durationInFrames={60} premountFor={fps}><Audio src={staticFile(`sfx/remotion/${sfx[1].file}`)} volume={sfx[1].volume}/></Sequence>
      <Sequence name="Sound cue 3" from={sfx[2].from} durationInFrames={60} premountFor={fps}><Audio src={staticFile(`sfx/remotion/${sfx[2].file}`)} volume={sfx[2].volume}/></Sequence>
      <Sequence name="Sound cue 4" from={sfx[3].from} durationInFrames={60} premountFor={fps}><Audio src={staticFile(`sfx/remotion/${sfx[3].file}`)} volume={sfx[3].volume}/></Sequence>
      <Sequence name="Real-footage cover · first 0.1 second" from={0} durationInFrames={6} premountFor={fps}>
        <Cover/>
      </Sequence>
      <CaptionLane/>
    </AbsoluteFill>
  );
};

export const CREATINE_DURATION_IN_FRAMES = edit.durationInFrames;
