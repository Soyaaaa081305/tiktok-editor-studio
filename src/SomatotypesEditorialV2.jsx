import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  Sequence,
  Video,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {loadFont} from '@remotion/fonts';
import edit from '../jobs/somatotypes-v2/edit-data.json';

loadFont({family: 'Inter', url: staticFile('ashwagandha/inter-900.woff2'), weight: '900'});
loadFont({family: 'Manrope', url: staticFile('ashwagandha/manrope-800.woff2'), weight: '800'});

const C = {
  ink: '#17221d',
  paper: '#f6f4ed',
  white: '#ffffff',
  green: '#326345',
  green2: '#244d36',
  gold: '#e8c842',
  rose: '#d45b4a',
  mist: '#e5ebe3',
  grey: '#707871',
};
const FONT = 'Manrope, Inter, Arial, sans-serif';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'};
const file = (name) => staticFile(`somatotypes/${name}`);
const TopPanel = ({children, style = {}}) => (
  <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1210, overflow: 'hidden', ...style}}>{children}</div>
);
const lerp = (frame, from, to, start = 0, end = 1) =>
  interpolate(frame, [from, to], [start, end], {...clamp, easing: Easing.bezier(0.18, 0.8, 0.23, 1)});
const pop = (frame, fps, delay = 0) =>
  spring({frame: frame - delay, fps, config: {damping: 18, stiffness: 190, mass: 0.68}});

const Eyebrow = ({children, color = C.green, style = {}}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 14, fontSize: 25, fontWeight: 800, letterSpacing: 2.3, textTransform: 'uppercase', color, ...style}}>
    <span style={{width: 28, height: 4, background: color, borderRadius: 3}} />{children}
  </div>
);

const Title = ({children, size = 76, color = C.ink, style = {}}) => (
  <div style={{fontFamily: FONT, fontSize: size, lineHeight: 0.98, fontWeight: 800, letterSpacing: -2.7, color, ...style}}>{children}</div>
);

const Card = ({children, style = {}}) => (
  <div style={{boxSizing: 'border-box', background: C.paper, borderRadius: 28, boxShadow: '0 18px 58px rgba(15,25,18,.2)', color: C.ink, ...style}}>{children}</div>
);

const SourceLine = ({children, dark = false, style = {}}) => (
  <div style={{fontFamily: 'Inter, Arial, sans-serif', fontSize: 21, fontWeight: 600, lineHeight: 1.35, color: dark ? '#d8ded6' : '#657068', ...style}}>{children}</div>
);

const BrandBug = ({light = false}) => (
  <div style={{position: 'absolute', left: 68, top: 72, zIndex: 15, color: light ? C.paper : C.green, fontSize: 22, letterSpacing: 2.1, fontWeight: 900, fontFamily: 'Inter, Arial, sans-serif'}}>NODA.LIFTS</div>
);

function SpeakerVideo({segment, mode = 'full', sourceOffsetFrames = 0}) {
  const portrait = mode === 'full'
    ? {left: 0, top: 0, width: 1080, height: 1920, objectPosition: '50% 31%'}
    : {left: 0, top: 1210, width: 1080, height: 710, objectPosition: '50% 22.5%'};
  return (
    <div style={{position: 'absolute', overflow: 'hidden', background: C.ink, ...portrait}}>
      <Video
        src={file('main.mp4')}
        trimBefore={segment.sourceStartFrame + sourceOffsetFrames}
        trimAfter={segment.sourceEndFrame + sourceOffsetFrames}
        muted
        style={{position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: portrait.objectPosition}}
      />
      {mode === 'full' ? <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(10,18,13,.35), transparent 39%, transparent 76%, rgba(10,18,13,.12))'}} /> : null}
    </div>
  );
}

function Segment({segment, children, mode = 'full', background = C.ink}) {
  return (
    <Sequence from={segment.outputStartFrame} durationInFrames={segment.durationInFrames} premountFor={60} name={`Speech and picture · ${segment.id}`}>
      <AbsoluteFill style={{background, overflow: 'hidden'}}>
        <SpeakerVideo segment={segment} mode={mode} />
        {children}
      </AbsoluteFill>
    </Sequence>
  );
}

function Cover() {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 5], [1.04, 1.1], clamp);
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: C.ink}}>
      <Img src={file('cover-source.jpg')} style={{position: 'absolute', inset: 0, width: 1080, height: 1920, objectFit: 'cover', objectPosition: '50% 29%', transform: `scale(${scale})`, filter: 'saturate(.88) contrast(1.03)'}} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg,rgba(18,31,23,.86) 0%,rgba(18,31,23,.54) 30%,rgba(18,31,23,.04) 61%,rgba(18,31,23,.55) 100%)'}} />
      <BrandBug light />
      <div style={{position: 'absolute', left: 72, right: 72, top: 192}}>
        <Eyebrow color={C.gold}>Noda.lifts · science-based lifting</Eyebrow>
        <Title color={C.white} size={91} style={{marginTop: 34, maxWidth: 880, textShadow: '0 6px 28px rgba(0,0,0,.3)'}}>
          BAKIT HINDI<br />RELIABLE ANG<br /><span style={{color: C.gold}}>SOMATOTYPES?</span>
        </Title>
      </div>
      <div style={{position: 'absolute', left: 72, bottom: 188, height: 8, width: 182, borderRadius: 8, background: C.gold}} />
    </AbsoluteFill>
  );
}

function CoverExit() {
  const f = useCurrentFrame();
  const opacity = interpolate(f, [0, 5], [0.94, 0], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const scale = interpolate(f, [0, 5], [1, 1.07], {...clamp, easing: Easing.out(Easing.cubic)});
  return <AbsoluteFill style={{zIndex: 80, pointerEvents: 'none', opacity, transform: `scale(${scale})`}}><Cover /></AbsoluteFill>;
}

function HookLabels() {
  const frame = useCurrentFrame();
  const labels = [
    {at: 215, text: 'ECTOMORPH', tint: C.gold},
    {at: 270, text: 'ENDOMORPH', tint: C.rose},
    {at: 335, text: 'MESOMORPH', tint: C.mist},
  ];
  const active = labels.find((label) => frame >= label.at && frame < label.at + 33);
  if (!active) return null;
  const local = frame - active.at;
  return (
    <div style={{position: 'absolute', left: 70, top: 850, zIndex: 12, transform: `translateX(${interpolate(local, [0, 6, 28, 33], [-70, 0, 0, 28], clamp)}px)`, opacity: interpolate(local, [0, 5, 27, 33], [0, 1, 1, 0], clamp)}}>
      <div style={{background: active.tint, color: C.ink, borderRadius: 12, padding: '13px 24px 12px', fontSize: 39, fontWeight: 900, letterSpacing: 1.8, boxShadow: '0 10px 35px rgba(0,0,0,.25)'}}>{active.text}</div>
    </div>
  );
}

function WeightCard({kind, children, value, durationInFrames}) {
  const picture = kind === '44'
    ? file('44-dog-tuktuk.jpg')
    : kind === '76'
      ? file('76-a-60fps.mp4')
      : file('64.mp4');
  const isVideo = kind !== '44';
  // The 76 kg derivative is pretrimmed to the exact 39-frame montage window.
  const videoStart = kind === '76' ? 0 : 210;
  const videoEnd = videoStart + durationInFrames;
  return (
    <AbsoluteFill style={{background: C.ink, overflow: 'hidden'}}>
      {isVideo
        ? <Video src={picture} trimBefore={videoStart} trimAfter={videoEnd} muted style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', background: C.ink}} />
        : <Img src={picture} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 37%'}} />}
      <AbsoluteFill style={{background: 'linear-gradient(180deg,rgba(10,17,13,.2),transparent 45%,rgba(10,17,13,.62))'}} />
      <div style={{position: 'absolute', left: 30, right: 30, bottom: 28, display: 'flex', alignItems: 'end', justifyContent: 'space-between'}}>
        <div style={{color: C.white, fontSize: 24, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase'}}>{children}</div>
        <div style={{color: C.gold, fontSize: 77, lineHeight: .9, fontWeight: 900, letterSpacing: -3}}>{value}<span style={{fontSize: 34, letterSpacing: 0}}> kg</span></div>
      </div>
    </AbsoluteFill>
  );
}

function WeightTimeline() {
  const frame = useCurrentFrame();
  const phases = [
    {from: 0, duration: 34, kind: '44', label: 'THEN'},
    {from: 34, duration: 39, kind: '76', label: 'LATER'},
    {from: 73, duration: 42, kind: '64', label: 'NOW'},
  ];
  return (
    <TopPanel style={{zIndex: 10}}>
      {phases.map((phase) => {
        const localFrame = frame - phase.from;
        const translate = interpolate(localFrame, [0, 6, phase.duration - 6, phase.duration], [80, 0, 0, -80], clamp);
        return (
          <Sequence key={phase.kind} from={phase.from} durationInFrames={phase.duration} premountFor={60} name={`Weight timeline · ${phase.kind} kg`}>
            <div style={{position: 'absolute', left: 118, right: 118, top: 115, bottom: 180, borderRadius: 28, overflow: 'hidden', border: `2px solid rgba(246,244,237,.72)`, boxShadow: '0 22px 60px rgba(0,0,0,.3)', transform: `translateX(${translate}px)`}}>
              <WeightCard kind={phase.kind} value={phase.kind} durationInFrames={phase.duration}>{phase.label} · PERSONAL EXAMPLE</WeightCard>
            </div>
          </Sequence>
        );
      })}
      <div style={{position: 'absolute', left: 34, right: 34, top: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 13, color: C.white, fontWeight: 900, fontSize: 28, letterSpacing: 1.5, textShadow: '0 2px 12px rgba(0,0,0,.7)'}}>
        <span style={{color: C.gold}}>44</span><span>→</span><span>76</span><span>→</span><span style={{color: C.gold}}>64 KG</span>
      </div>
      <div style={{position: 'absolute', left: 30, bottom: -16, width: 330, height: 8, background: C.gold, borderRadius: 8, transform: `scaleX(${interpolate(frame, [0, 114], [0, 1], clamp)})`, transformOrigin: 'left'}} />
    </TopPanel>
  );
}

function BodyTypesBoard() {
  const frame = useCurrentFrame();
  const rise = (delay) => interpolate(pop(frame, 60, delay), [0, 1], [90, 0], clamp);
  return (
    <TopPanel style={{background: C.paper, color: C.ink}}>
      <div style={{position: 'absolute', left: 48, top: 36}}><Eyebrow>Three labels</Eyebrow><Title size={67} style={{marginTop: 20}}>A useful picture<br />isn't a life sentence.</Title></div>
      <div style={{position: 'absolute', left: 32, right: 32, top: 345, bottom: 36, borderRadius: 24, overflow: 'hidden', background: C.white, boxShadow: '0 14px 42px rgba(25,38,28,.13)'}}>
        <Img src={file('somatotypes.webp')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', transform: `scale(${interpolate(frame, [0, 120], [1.1, 1.02], clamp)})`}} />
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 150, background: 'linear-gradient(0deg,rgba(246,244,237,.95),rgba(246,244,237,0))'}} />
      </div>
      <div style={{position: 'absolute', left: 63, top: 1161, color: C.grey, fontSize: 18, fontWeight: 700, opacity: rise(3)}}>Illustration supplied by the creator · descriptive labels only</div>
    </TopPanel>
  );
}

function SheldonCard() {
  const frame = useCurrentFrame();
  const turn = interpolate(frame, [0, 60], [-3, 0], clamp);
  return (
    <TopPanel style={{background: C.ink}}>
      <Img src={file('sheldon.webp')} style={{position: 'absolute', width: 690, height: 655, right: -12, top: 62, objectFit: 'cover', objectPosition: '50% 35%', filter: 'grayscale(1) contrast(1.08)', transform: `rotate(${turn}deg) scale(${interpolate(frame, [0, 240], [1.04, 1.12], clamp)})`}} />
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(90deg,rgba(23,34,29,1) 0%,rgba(23,34,29,.94) 37%,rgba(23,34,29,.24) 80%,rgba(23,34,29,.1)),linear-gradient(0deg,rgba(23,34,29,.92),transparent 54%)'}} />
      <div style={{position: 'absolute', left: 48, top: 100, width: 530}}>
        <Eyebrow color={C.gold}>1940s · historical claim</Eyebrow>
        <Title color={C.paper} size={75} style={{marginTop: 34}}>William H.<br />Sheldon</Title>
        <div style={{marginTop: 26, color: C.mist, fontSize: 29, lineHeight: 1.3, fontWeight: 700}}>Constitutional psychology tried to connect physique with personality.</div>
      </div>
      <div style={{position: 'absolute', left: 48, bottom: 74, right: 48, borderTop: `2px solid rgba(246,244,237,.22)`, paddingTop: 18}}><SourceLine dark>Portrait supplied by the creator · JAMA record dates the book to 1940</SourceLine></div>
    </TopPanel>
  );
}

function EvidenceExcerpt() {
  const frame = useCurrentFrame();
  const y = interpolate(frame, [0, 22], [80, 0], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <TopPanel style={{background: C.paper}}>
      <div style={{position: 'absolute', top: 42, left: 54, right: 54}}><Eyebrow>Primary historical record</Eyebrow><Title size={63} style={{marginTop: 22}}>The Varieties of<br />Human Physique</Title><div style={{marginTop: 13, color: C.grey, fontSize: 27, fontWeight: 700}}>Sheldon et al. · JAMA · 1940</div></div>
      <Card style={{position: 'absolute', left: 45, right: 45, top: 320 + y, padding: '32px 34px 30px', minHeight: 350, border: `1px solid #d9ded4`}}>
        <div style={{fontFamily: 'Georgia, serif', fontSize: 29, lineHeight: 1.38, color: C.ink}}>“What value ‘somatotyping’ may serve is <span style={{background: C.gold, padding: '0 5px'}}>problematic</span>.”</div>
        <div style={{position: 'absolute', left: 34, right: 34, bottom: 30, height: 2, background: '#d9ded4'}} />
        <SourceLine style={{position: 'absolute', left: 34, bottom: 45, fontSize: 18}}>1940;115(15):1303 · DOI: 10.1001/jama.1940.02810410069045</SourceLine>
      </Card>
      <div style={{position: 'absolute', left: 58, top: 698 + y, fontSize: 18, color: C.green, fontWeight: 900, letterSpacing: 1.2}}>BRITANNICA EXCERPT · CREATOR-SUPPLIED SCREENSHOT</div>
      <div style={{position: 'absolute', left: 50, top: 728 + y, width: 980, height: 268, overflow: 'hidden', borderRadius: 14, border: '2px solid #d6d9d1', background: C.white, boxShadow: '0 10px 30px rgba(20,30,22,.15)'}}>
        <Img src={file('britannica-screenshot.png')} style={{position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', objectFit: 'contain'}} />
      </div>
      <Card style={{position: 'absolute', left: 45, right: 45, bottom: 28, padding: '19px 24px', background: C.green, color: C.paper}}>
        <div style={{fontSize: 20, fontWeight: 900, letterSpacing: 1.25, color: C.gold}}>HISTORICAL BOOK REVIEW · NOT A MODERN TRIAL</div>
      </Card>
    </TopPanel>
  );
}

function ClaimDiagram() {
  const frame = useCurrentFrame();
  const a = interpolate(frame, [10, 40], [0, 1], clamp);
  const b = interpolate(frame, [32, 64], [0, 1], clamp);
  const c = interpolate(frame, [90, 125], [0, 1], clamp);
  return (
    <TopPanel style={{background: C.ink}}>
      <div style={{position: 'absolute', left: 55, right: 55, top: 35}}><Eyebrow color={C.gold}>What Sheldon argued</Eyebrow><Title color={C.paper} size={65} style={{marginTop: 22}}>A theory from<br />constitutional psychology</Title></div>
      <div style={{position: 'absolute', left: 55, right: 55, top: 390, display: 'grid', gridTemplateColumns: '1fr 68px 1fr', alignItems: 'center', gap: 12}}>
        <ClaimNode frame={frame} from={12} title="PHYSIQUE" body="three body-build labels" color={C.mist} />
        <div style={{color: C.gold, fontSize: 55, fontWeight: 900, textAlign: 'center', opacity: a, transform: `scale(${.8 + .2 * a})`}}>→</div>
        <ClaimNode frame={frame} from={24} title="PERSONALITY" body="traits & behaviour" color={C.gold} />
      </div>
      <div style={{position: 'absolute', left: 80, right: 80, top: 710, height: 3, background: 'rgba(246,244,237,.18)'}} />
      <div style={{position: 'absolute', left: 94, right: 94, top: 755, textAlign: 'center', color: C.paper, fontSize: 30, fontWeight: 800, opacity: b}}>The same theory reached into claims about delinquency.</div>
      <div style={{position: 'absolute', left: 75, right: 75, top: 850, height: 260, border: `3px solid rgba(212,91,74,${c})`, borderRadius: 24, transform: `scale(${.96 + .04 * c})`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{color: C.paper, fontSize: 74, fontWeight: 900, letterSpacing: 2, opacity: c}}>DELINQUENCY</div>
        <div style={{position: 'absolute', left: 32, right: 32, height: 12, background: C.rose, borderRadius: 10, transform: `rotate(-6deg) scaleX(${c})`, transformOrigin: 'left'}} />
      </div>
      <div style={{position: 'absolute', left: 80, right: 80, top: 800, color: C.gold, textAlign: 'center', fontSize: 25, fontWeight: 900, letterSpacing: 1.1, opacity: c}}>HISTORICAL CLAIM · SCIENTIFICALLY DISCREDITED</div>
      <SourceLine dark style={{position: 'absolute', left: 60, bottom: 48, right: 60}}>Rafter, Criminology 45(4), 2007/2008 · doi:10.1111/j.1745-9125.2007.00092.x</SourceLine>
    </TopPanel>
  );
}

function ClaimNode({frame, from, title, body, color}) {
  const scale = pop(frame, 60, from);
  return (
    <Card style={{minHeight: 235, padding: '29px 24px', textAlign: 'center', transform: `translateY(${interpolate(scale, [0, 1], [48, 0], clamp)}px) scale(${.94 + .06 * scale})`, opacity: scale}}>
      <div style={{color: C.green, fontSize: 24, fontWeight: 900, letterSpacing: 1.7}}>{title}</div>
      <div style={{color: C.ink, fontSize: 31, lineHeight: 1.13, fontWeight: 800, marginTop: 20}}>{body}</div>
    </Card>
  );
}

function TwoFrameworks() {
  const frame = useCurrentFrame();
  const slide = (delay) => interpolate(pop(frame, 60, delay), [0, 1], [80, 0], clamp);
  return (
    <TopPanel style={{background: C.paper}}>
      <div style={{position: 'absolute', left: 48, top: 40}}><Eyebrow>Important distinction</Eyebrow><Title size={68} style={{marginTop: 24}}>Two different<br />uses of the word.</Title></div>
      <Card style={{position: 'absolute', left: 44, right: 44, top: 355, minHeight: 318, padding: '31px 31px', borderLeft: `12px solid ${C.rose}`, transform: `translateX(${slide(8)}px)`}}>
        <div style={{fontSize: 23, fontWeight: 900, letterSpacing: 1.5, color: C.rose}}>SHELDON · CONSTITUTIONAL PSYCHOLOGY</div>
        <div style={{fontSize: 35, lineHeight: 1.15, fontWeight: 800, marginTop: 17}}>Physique → personality / delinquency</div>
        <div style={{fontSize: 29, color: C.rose, fontWeight: 900, marginTop: 21}}>DISCREDITED historical claim</div>
      </Card>
      <div style={{position: 'absolute', left: 520, top: 685, width: 40, height: 60, background: C.gold, clipPath: 'polygon(50% 100%,0 0,100% 0)', transform: `scaleY(${interpolate(frame, [30, 45], [0, 1], clamp)})`}} />
      <Card style={{position: 'absolute', left: 44, right: 44, top: 755, minHeight: 335, padding: '31px 31px', borderLeft: `12px solid ${C.green}`, transform: `translateX(${slide(28)}px)`}}>
        <div style={{fontSize: 23, fontWeight: 900, letterSpacing: 1.5, color: C.green}}>HEATH–CARTER · MODERN METHOD</div>
        <div style={{fontSize: 34, lineHeight: 1.15, fontWeight: 800, marginTop: 17}}>Descriptive physique assessment</div>
        <div style={{fontSize: 26, color: C.green, fontWeight: 800, marginTop: 18}}>Still used in sports research</div>
      </Card>
      <SourceLine style={{position: 'absolute', left: 56, right: 56, bottom: 165}}>Talluri et al., Sports, 2020 · Martínez-Mireles et al., Sports, 2025 (66-study scoping review)</SourceLine>
      <div style={{position: 'absolute', left: 55, right: 55, bottom: 68, color: C.ink, fontWeight: 900, fontSize: 30, textAlign: 'center'}}>DESCRIBING PHYSIQUE ≠ DEFINING YOUR DESTINY</div>
    </TopPanel>
  );
}

function ComponentSliders() {
  const frame = useCurrentFrame();
  const rows = [
    {name: 'ENDOMORPHY', sub: 'relative fatness', color: C.rose},
    {name: 'MESOMORPHY', sub: 'musculoskeletal robustness', color: C.green},
    {name: 'ECTOMORPHY', sub: 'relative linearity', color: '#8a6ec4'},
  ];
  return (
    <TopPanel style={{background: C.ink}}>
      <div style={{position: 'absolute', left: 52, top: 45}}><Eyebrow color={C.gold}>A descriptive profile</Eyebrow><Title color={C.paper} size={67} style={{marginTop: 23}}>Three components.<br />Not three destinies.</Title></div>
      {rows.map((row, index) => {
        const y = 398 + index * 210;
        const progress = interpolate(frame, [18 + index * 14, 48 + index * 14], [.22, .76], clamp);
        const knobX = 65 + progress * 850;
        return <div key={row.name} style={{position: 'absolute', left: 57, top: y, width: 966, height: 169}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}><div style={{color: C.paper, fontSize: 27, fontWeight: 900, letterSpacing: 1.6}}>{row.name}</div><div style={{color: C.gold, fontSize: 23, fontWeight: 800}}>{row.sub}</div></div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 79, height: 15, borderRadius: 9, background: 'rgba(246,244,237,.2)'}} />
          <div style={{position: 'absolute', left: 0, top: 79, width: progress * 100 + '%', height: 15, borderRadius: 9, background: row.color}} />
          <div style={{position: 'absolute', left: knobX, top: 64, width: 43, height: 43, borderRadius: 50, background: C.paper, border: `6px solid ${row.color}`, boxShadow: '0 5px 18px rgba(0,0,0,.38)'}} />
        </div>;
      })}
      <Card style={{position: 'absolute', left: 50, right: 50, bottom: 50, padding: '26px 30px', background: C.green, color: C.paper}}>
        <div style={{fontSize: 27, fontWeight: 900, color: C.gold}}>A PROFILE, NOT A PERSONALITY TEST</div>
        <div style={{fontSize: 24, marginTop: 8, lineHeight: 1.25, fontWeight: 700}}>Measured body build can change; individual outcomes involve more than three labels.</div>
      </Card>
    </TopPanel>
  );
}

function FactorsScene() {
  const frame = useCurrentFrame();
  const factors = [
    {label: 'ENERGY BALANCE', x: 72, y: 355, rot: -4},
    {label: 'MUSCLE MASS', x: 545, y: 460, rot: 3},
    {label: 'TRAINING', x: 103, y: 650, rot: 2},
    {label: 'LIFESTYLE', x: 520, y: 755, rot: -3},
  ];
  return (
    <TopPanel style={{background: C.paper}}>
      <div style={{position: 'absolute', left: 50, top: 36}}><Eyebrow>What affects the snapshot?</Eyebrow><Title size={66} style={{marginTop: 22}}>More than a<br />three-word label.</Title></div>
      <div style={{position: 'absolute', left: 445, top: 785, width: 190, height: 190, borderRadius: 999, background: C.green, color: C.paper, display: 'grid', placeItems: 'center', textAlign: 'center', fontSize: 25, lineHeight: 1.08, fontWeight: 900, transform: `scale(${interpolate(frame, [0, 30], [.55, 1], {...clamp, easing: Easing.out(Easing.back(1.15))})})`}}>BODY<br />COMPOSITION</div>
      {factors.map((factor, i) => {
        const p = spring({frame: frame - 12 - i * 8, fps: 60, config: {damping: 17, stiffness: 150}});
        return <div key={factor.label} style={{position: 'absolute', left: factor.x, top: factor.y, transform: `rotate(${factor.rot}deg) translateY(${(1 - p) * 80}px)`, opacity: p, borderRadius: 17, padding: '18px 23px', background: i % 2 ? C.mist : C.gold, color: C.ink, fontSize: 24, fontWeight: 900, letterSpacing: .6, boxShadow: '0 12px 25px rgba(23,34,29,.12)'}}>{factor.label}</div>;
      })}
      <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
        <path d="M340 432 C430 500 432 730 500 820" stroke={C.green} strokeWidth="5" strokeDasharray="8 12" fill="none" strokeDashoffset={interpolate(frame, [0, 60], [240, 0], clamp)} />
        <path d="M710 535 C660 620 632 740 580 825" stroke={C.green} strokeWidth="5" strokeDasharray="8 12" fill="none" strokeDashoffset={interpolate(frame, [8, 68], [240, 0], clamp)} />
        <path d="M322 720 C420 768 440 811 490 855" stroke={C.green} strokeWidth="5" strokeDasharray="8 12" fill="none" strokeDashoffset={interpolate(frame, [16, 76], [240, 0], clamp)} />
        <path d="M694 830 C648 842 620 860 595 890" stroke={C.green} strokeWidth="5" strokeDasharray="8 12" fill="none" strokeDashoffset={interpolate(frame, [22, 82], [240, 0], clamp)} />
      </svg>
      <div style={{position: 'absolute', left: 44, right: 44, bottom: 46, color: C.grey, fontSize: 21, fontWeight: 700, textAlign: 'center'}}>Examples, not an exhaustive model or an individual prescription.</div>
    </TopPanel>
  );
}

function ClosingExamples() {
  const frame = useCurrentFrame();
  const phase = frame < 395 ? 'ECTOMORPH' : 'ENDOMORPH';
  const p = spring({frame: frame - (phase === 'ECTOMORPH' ? 16 : 401), fps: 60, config: {damping: 16, stiffness: 155}});
  const word = phase === 'ECTOMORPH' ? 'CAN’T BUILD MUSCLE?' : 'DOOMED TO GAIN FAT?';
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{position: 'absolute', left: 54, top: 122, color: C.gold, fontSize: 24, fontWeight: 900, letterSpacing: 2, textShadow: '0 2px 12px rgba(0,0,0,.5)'}}>A LABEL DOESN'T PREDICT YOUR CEILING</div>
      <Card style={{position: 'absolute', left: 53, top: 185, width: 750, padding: '22px 27px', transform: `translateX(${(1 - p) * -65}px)`, opacity: p}}>
        <div style={{fontSize: 21, fontWeight: 900, letterSpacing: 1.8, color: phase === 'ECTOMORPH' ? C.green : C.rose}}>{phase}</div>
        <div style={{fontSize: 37, lineHeight: 1.08, fontWeight: 900, marginTop: 12}}>{word}</div>
        <div style={{position: 'absolute', left: 23, right: 23, top: 111, height: 6, background: C.rose, borderRadius: 6, transform: `rotate(-4deg) scaleX(${interpolate(phase === 'ECTOMORPH' ? frame : frame - 395, [35, 60], [0, 1], clamp)})`, transformOrigin: 'left'}} />
      </Card>
    </AbsoluteFill>
  );
}

function CreatorSignature() {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, 14], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <div style={{position: 'absolute', left: 50, right: 50, bottom: 210, zIndex: 25, textAlign: 'center', opacity: p, transform: `translateY(${(1 - p) * 20}px)`}}>
      <div style={{display: 'inline-block', color: C.paper, background: C.green, border: `2px solid ${C.gold}`, borderRadius: 18, padding: '17px 21px', fontSize: 26, fontWeight: 900, lineHeight: 1.17, boxShadow: '0 10px 35px rgba(0,0,0,.3)'}}>Like and follow for more science-based lifting advice.<br /><span style={{color: C.gold}}>God bless!</span></div>
    </div>
  );
}

function MythBubble() {
  const frame = useCurrentFrame();
  const p = spring({frame: frame - 7, fps: 60, config: {damping: 16, stiffness: 160}});
  const strike = interpolate(frame, [55, 75], [0, 1], clamp);
  return (
    <AbsoluteFill style={{background: 'transparent', pointerEvents: 'none'}}>
      <Card style={{position: 'absolute', left: 50, top: 145, width: 770, padding: '25px 30px', transform: `translateX(${(1 - p) * -75}px)`, opacity: p}}>
        <Eyebrow color={C.rose}>The limiting thought</Eyebrow>
        <div style={{fontSize: 40, lineHeight: 1.14, fontWeight: 900, marginTop: 14}}>“Ectomorph ako,<br />kaya hindi ako magkakalaman.”</div>
        <div style={{position: 'absolute', left: 24, right: 24, top: 144, height: 7, borderRadius: 6, background: C.rose, transform: `rotate(-4deg) scaleX(${strike})`, transformOrigin: 'left'}} />
      </Card>
      <div style={{position: 'absolute', right: 75, top: 495, color: C.gold, fontSize: 28, fontWeight: 900, letterSpacing: 2, opacity: interpolate(frame, [40, 55], [0, 1], clamp)}}>LABEL ≠ LIMIT</div>
    </AbsoluteFill>
  );
}

function FluidLabel() {
  const frame = useCurrentFrame();
  const angle = interpolate(frame, [0, 150], [-7, 7], clamp);
  const line = interpolate(frame, [35, 75], [0, 1], clamp);
  return (
    <AbsoluteFill style={{background: C.green, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 55, top: 88}}><Eyebrow color={C.gold}>A reminder</Eyebrow><Title color={C.paper} size={77} style={{marginTop: 27}}>You are not<br />trapped in a<br />1940s label.</Title></div>
      <div style={{position: 'absolute', right: 45, bottom: 300, width: 475, height: 468, borderRadius: 30, background: C.paper, padding: 30, boxSizing: 'border-box', transform: `rotate(${angle}deg)`, boxShadow: '0 22px 60px rgba(10,25,14,.25)'}}>
        <div style={{fontSize: 25, fontWeight: 900, letterSpacing: 1.6, color: C.rose}}>FIXED TYPE?</div>
        <div style={{display: 'flex', gap: 12, marginTop: 40}}>{['ECTO', 'MESO', 'ENDO'].map((x) => <div key={x} style={{flex: 1, height: 130, borderRadius: 15, background: C.mist, display: 'grid', placeItems: 'center', color: C.ink, fontWeight: 900, fontSize: 18}}>{x}</div>)}</div>
        <div style={{position: 'absolute', left: 20, right: 20, top: 230, height: 9, borderRadius: 8, background: C.rose, transform: `scaleX(${line}) rotate(-5deg)`, transformOrigin: 'left'}} />
        <div style={{marginTop: 48, fontSize: 27, lineHeight: 1.1, fontWeight: 800, color: C.green}}>A descriptive assessment<br />is not your identity.</div>
      </div>
      <div style={{position: 'absolute', left: 58, bottom: 84, color: C.gold, fontSize: 25, fontWeight: 800, letterSpacing: 1.1}}>NUTRITION · TRAINING · TIME · YOUR CONTEXT</div>
    </AbsoluteFill>
  );
}

function ControlList() {
  const frame = useCurrentFrame();
  const lines = ['TRAIN WITH PROGRESSION', 'EAT FOR YOUR GOAL', 'GIVE IT TIME'];
  return (
    <AbsoluteFill style={{background: C.paper, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 55, top: 40}}><Eyebrow>Actionable takeaway</Eyebrow><Title size={70} style={{marginTop: 23}}>Labels don't<br />do the work.</Title></div>
      {lines.map((line, i) => {
        const p = spring({frame: frame - 8 - i * 14, fps: 60, config: {damping: 16, stiffness: 165}});
        return <div key={line} style={{position: 'absolute', left: 55, top: 430 + i * 182, width: 900, display: 'flex', alignItems: 'center', gap: 22, color: C.ink, transform: `translateX(${(1 - p) * 90}px)`, opacity: p}}>
          <div style={{width: 58, height: 58, borderRadius: 50, background: C.green, color: C.paper, display: 'grid', placeItems: 'center', fontSize: 31, fontWeight: 900}}>✓</div>
          <div style={{fontSize: 32, fontWeight: 900, letterSpacing: .2}}>{line}</div>
        </div>;
      })}
      <Card style={{position: 'absolute', left: 55, right: 55, bottom: 64, padding: '24px 28px', background: C.green, color: C.paper}}><div style={{fontSize: 25, lineHeight: 1.25, fontWeight: 800}}>Practical steps are personal; a body-type label isn't a training prescription.</div></Card>
    </AbsoluteFill>
  );
}

function HistoryBridge() {
  const frame = useCurrentFrame();
  const enter = spring({frame: frame - 4, fps: 60, config: {damping: 18, stiffness: 170}});
  const line = interpolate(frame, [10, 38], [0, 1], clamp);
  return (
    <TopPanel style={{background: C.paper}}>
      <div style={{position: 'absolute', left: 55, top: 85}}><Eyebrow>History · then to modern assessment</Eyebrow></div>
      <div style={{position: 'absolute', left: 58, right: 58, top: 400, textAlign: 'center', opacity: enter, transform: `translateY(${(1 - enter) * 45}px) scale(${.97 + .03 * enter})`}}>
        <Title size={72} style={{lineHeight: 1.05}}>OLD CLAIMS<br /><span style={{color: C.green}}>≠ MODERN ASSESSMENT</span></Title>
      </div>
      <div style={{position: 'absolute', left: 120, right: 120, top: 650, height: 7, borderRadius: 8, background: C.green, transform: `scaleX(${line})`, transformOrigin: 'left'}} />
    </TopPanel>
  );
}

function HistoryPanel({segment}) {
  return (
    <Segment segment={segment} mode="stacked" background={C.paper}>
      <Sequence from={0} durationInFrames={115}><WeightTimeline /></Sequence>
      <Sequence from={115} durationInFrames={201}><BodyTypesBoard /></Sequence>
      <Sequence from={316} durationInFrames={324}><SheldonCard /></Sequence>
      <Sequence from={640} durationInFrames={250}><EvidenceExcerpt /></Sequence>
      <Sequence from={890} durationInFrames={520}><ClaimDiagram /></Sequence>
      <Sequence from={1410} durationInFrames={127}>
        <HistoryBridge />
      </Sequence>
    </Segment>
  );
}

function ModernPanel({segment}) {
  return (
    <Segment segment={segment} mode="stacked" background={C.paper}>
      <Sequence from={0} durationInFrames={276}><TwoFrameworks /></Sequence>
      <Sequence from={276} durationInFrames={376}><ComponentSliders /></Sequence>
      <Sequence from={652} durationInFrames={358}><FactorsScene /></Sequence>
    </Segment>
  );
}

function CaptionLane() {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sourceFrame = (frame) => {
    const s = edit.segments.find((segment) => frame >= segment.outputStartFrame && frame < segment.outputStartFrame + segment.durationInFrames);
    return s ? s.sourceStartFrame + frame - s.outputStartFrame : null;
  };
  const srcFrame = sourceFrame(frame);
  if (srcFrame === null) return null;
  const sourceTime = srcFrame / fps;
  const caption = edit.captions.find((c) => sourceTime >= c.startSeconds && sourceTime < c.endSeconds);
  if (!caption) return null;
  const segment = edit.segments.find((s) => frame >= s.outputStartFrame && frame < s.outputStartFrame + s.durationInFrames);
  const stacked = segment?.id === 'sheldon' || segment?.id === 'modern';
  const inWeightTimeline = segment?.id === 'sheldon' && frame - segment.outputStartFrame < 115;
  const y = inWeightTimeline ? 1065 : stacked ? 1190 : 1485;
  const age = frame - Math.round((caption.startSeconds * fps) - (segment.sourceStartFrame - segment.outputStartFrame));
  const appear = interpolate(age, [0, 6], [0, 1], clamp);
  return (
    <div style={{position: 'absolute', zIndex: 60, left: 80, right: 80, top: y, minHeight: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: appear, transform: `translateY(${(1 - appear) * 12}px)`, pointerEvents: 'none'}}>
      <div style={{maxWidth: 920, padding: stacked ? '6px 14px 7px' : '9px 17px 11px', borderRadius: 14, background: 'rgba(16,27,20,.72)', color: C.white, fontFamily: 'Inter, Arial, sans-serif', fontSize: stacked ? 36 : 43, lineHeight: 1.08, fontWeight: 800, textAlign: 'center', textShadow: '0 2px 8px rgba(0,0,0,.5)', boxDecorationBreak: 'clone'}}>{caption.text}</div>
    </div>
  );
}

function MainHook({segment}) {
  return <Segment segment={segment}>
    <BrandBug light />
    <HookLabels />
    <div style={{position: 'absolute', left: 65, top: 750, zIndex: 4, color: C.paper, fontSize: 24, fontWeight: 900, letterSpacing: 2, opacity: .95}}>THREE LABELS. ONE REAL PERSON.</div>
  </Segment>;
}

function RealityBeat({segment}) {
  return <Segment segment={segment}>
    <div style={{position: 'absolute', left: 64, right: 64, top: 188, zIndex: 10, color: C.paper}}>
      <Eyebrow color={C.gold}>The reality</Eyebrow>
      <Title color={C.white} size={90} style={{marginTop: 25, textShadow: '0 4px 22px rgba(0,0,0,.35)'}}>YOUR BODY<br />ISN'T A BOX.</Title>
    </div>
  </Segment>;
}

function TakeawayBeat({segment}) {
  return <Segment segment={segment}>
    <div style={{position: 'absolute', left: 70, top: 158, zIndex: 10}}><Eyebrow color={C.gold}>Mindset reset</Eyebrow><Title color={C.white} size={82} style={{marginTop: 27, textShadow: '0 3px 16px rgba(0,0,0,.46)'}}>STOP LIMITING<br />YOURSELF.</Title></div>
  </Segment>;
}

function BeliefBeat({segment}) {
  const f = useCurrentFrame();
  return <Segment segment={segment}>
    <div style={{position: 'absolute', left: 50, top: 120, zIndex: 15, color: C.paper, fontSize: 23, letterSpacing: 1.6, fontWeight: 900}}>A LABEL ISN'T A FORECAST</div>
    <MythBubble />
    <div style={{position: 'absolute', right: 42, bottom: 245, zIndex: 16, fontSize: 25, color: C.gold, fontWeight: 900, letterSpacing: 1.7, opacity: interpolate(f, [115, 150], [0, 1], clamp)}}>THEN · LATER · NOW</div>
  </Segment>;
}

function ClosingPanel({segment}) {
  const f = useCurrentFrame();
  return <Segment segment={segment}>
    <Sequence from={125} durationInFrames={435}><ClosingExamples /></Sequence>
    <Sequence from={560} durationInFrames={230}><FluidLabel /></Sequence>
    <Sequence from={790} durationInFrames={276}><ControlList /></Sequence>
    <Sequence from={815} durationInFrames={166}><CreatorSignature /></Sequence>
    <div style={{position: 'absolute', left: 66, top: 80, zIndex: 10, opacity: interpolate(f, [0, 24], [0, .92], clamp), color: C.paper, fontSize: 22, fontWeight: 900, letterSpacing: 2}}>NODA.LIFTS</div>
  </Segment>;
}

export const SomatotypesEditorialV2 = () => {
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill style={{background: C.ink, overflow: 'hidden', fontFamily: FONT}}>
      <style>{`@font-face{font-family:Inter;src:url('${staticFile('ashwagandha/inter-900.woff2')}') format('woff2');font-weight:900;font-display:block;}@font-face{font-family:Manrope;src:url('${staticFile('ashwagandha/manrope-800.woff2')}') format('woff2');font-weight:800;font-display:block;}`}</style>
      <Audio name="Continuous original voice, requested original music and selective SFX" src={file('soundtrack-v2.m4a')} premountFor={fps} />
      <Sequence from={0} durationInFrames={edit.coverFrames} name="Real creator frame · 0.1s cover"><Cover /></Sequence>
      <MainHook segment={edit.segments[0]} />
      <RealityBeat segment={edit.segments[1]} />
      <HistoryPanel segment={edit.segments[2]} />
      <ModernPanel segment={edit.segments[3]} />
      <ClosingPanel segment={edit.segments[4]} />
      <Sequence from={6} durationInFrames={6} name="Quick zoom dissolve from authentic cover"><CoverExit /></Sequence>
      <CaptionLane />
    </AbsoluteFill>
  );
};
