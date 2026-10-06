import {Audio, Video} from '@remotion/media';
import {
  AbsoluteFill,
  Freeze,
  Img,
  Sequence,
  Easing,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {loadFont} from '@remotion/fonts';
import editData from './edit-data-v4.json';

const POSTER = editData.posterFrames;
const NAVY = '#171719';
const DEEP = '#171719';
const WHITE = '#F4F3F0';
const MUTED = '#D0CEC9';
const GOLD = '#FFE600';
const CYAN = '#C8BCDB';
const BLUE = '#8793B9';
const FONT = 'FishEditorial, Inter, Arial, sans-serif';
const HEAVY = 'FishEditorial, Inter, Arial, sans-serif';

loadFont({family: 'FishEditorial', url: staticFile('fish-oil-v4/inter-600.woff2'), weight: '600'});
loadFont({family: 'FishEditorial', url: staticFile('fish-oil-v4/inter-700.woff2'), weight: '700'});

const SceneBackground = ({children, accent = GOLD, image = false}) => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, 240], [-12, 8], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: 'linear-gradient(180deg,#1d1d20 0%,#151517 100%)'}}>
      {image ? (
        <Img src={staticFile('product-hero.jpg')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.035) translateY(' + drift + 'px)'}} />
      ) : null}
      <AbsoluteFill style={{background: image ? 'linear-gradient(90deg,rgba(12,12,14,.74) 0%,rgba(12,12,14,.18) 58%,rgba(12,12,14,.1) 100%),linear-gradient(0deg,rgba(12,12,14,.3),transparent 46%)' : 'radial-gradient(ellipse at 80% 4%,rgba(200,188,219,.075),transparent 37%),linear-gradient(180deg,#1d1d20 0%,#151517 100%)'}} />
      {children}
    </AbsoluteFill>
  );
};

const Kicker = ({children, style = {}, color = GOLD}) => (
  <div style={{display: 'inline-flex', alignItems: 'center', gap: 12, padding: '3px 0 3px 13px', borderLeft: '3px solid ' + color, color: WHITE, fontFamily: HEAVY, fontSize: 21, lineHeight: 1.05, letterSpacing: 1.2, textTransform: 'uppercase', ...style}}>
    {children}
  </div>
);

const Headline = ({children, style = {}, color = WHITE}) => (
  <div style={{fontFamily: HEAVY, fontWeight: 700, color, letterSpacing: -2.5, lineHeight: 1.02, textShadow: '0 3px 18px rgba(0,0,0,.2)', ...style}}>
    {children}
  </div>
);

const Poster = () => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, POSTER - 1], [1.015, 1.05], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{overflow: 'hidden', backgroundColor: NAVY}}>
      <Img src={staticFile('product-hero.jpg')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(' + zoom + ')', filter: 'contrast(1.04) saturate(1.05)'}} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg,rgba(8,8,10,.68) 0%,rgba(8,8,10,.19) 44%,rgba(8,8,10,.07) 74%,rgba(8,8,10,.5) 100%)'}} />
      <div style={{position: 'absolute', left: 78, top: 156, width: 820}}>
        <Kicker>ATC Fish Oil · personal experience</Kicker>
        <Headline style={{marginTop: 22, fontSize: 92}}>Why fish oil?</Headline>
        <div style={{marginTop: 17, color: GOLD, fontFamily: HEAVY, fontSize: 41, fontWeight: 600, letterSpacing: -.8}}>3 reasons in my routine</div>
      </div>
    </AbsoluteFill>
  );
};

const CoverDissolve = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 5], [0.92, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const scale = interpolate(frame, [0, 5], [1, 1.025], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  return <AbsoluteFill style={{zIndex: 40, pointerEvents: 'none', opacity, transform: 'scale(' + scale + ')', transformOrigin: '50% 34%'}}><Freeze frame={POSTER - 1}><Poster /></Freeze></AbsoluteFill>;
};

const Presenter = ({sourceStart, sourceEnd, top = 720, height = 1200, scale = 1.035}) => {
  const {fps} = useVideoConfig();
  return <div style={{position: 'absolute', left: 0, top, width: 1080, height, overflow: 'hidden', background: DEEP}}>
    <Video src={staticFile('source.mp4')} trimBefore={sourceStart} trimAfter={sourceEnd} muted premountFor={fps} objectFit="cover" style={{position: 'absolute', left: 0, top: -Math.round(top * 0.58), width: 1080, height: 1920, transform: 'scale(' + scale + ')', transformOrigin: '50% 32%', filter: 'saturate(.94) contrast(1.025)'}} />
    <AbsoluteFill style={{pointerEvents: 'none', background: 'linear-gradient(0deg,rgba(0,0,0,.23),transparent 44%)'}} />
  </div>;
};

const CameraCut = ({name, from, duration, sourceStart, sourceEnd}) => {
  const {fps} = useVideoConfig();
  return (
    <Sequence name={name} from={from} durationInFrames={duration} premountFor={fps}>
      <Video src={staticFile('source.mp4')} trimBefore={sourceStart} trimAfter={sourceEnd} volume={0} objectFit="cover" style={{width: '100%', height: '100%', filter: 'contrast(1.03) saturate(1.04)'}} />
    </Sequence>
  );
};

const HookTakeover = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame: Math.max(0, frame - 2), fps, config: {damping: 18, stiffness: 160, mass: 0.58}});
  const line = interpolate(frame, [0, 28], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <SceneBackground accent={CYAN}>
      <div style={{position: 'absolute', left: 74, right: 208, top: 400}}>
        <Kicker color={CYAN}>The everyday question</Kicker>
        <Headline style={{marginTop: 31, fontSize: 94, opacity: enter, transform: 'translateY(' + interpolate(enter, [0, 1], [42, 0]) + 'px)'}}>Why is it in<br />my routine?</Headline>
        <div style={{marginTop: 42, color: MUTED, fontFamily: FONT, fontSize: 36, lineHeight: 1.2, opacity: line}}>Three reasons, in under a minute.</div>
        <div style={{marginTop: 56, width: 660, height: 8, borderRadius: 8, background: 'rgba(255,255,255,.12)', overflow: 'hidden'}}><div style={{height: '100%', width: (line * 100) + '%', background: GOLD}} /></div>
      </div>
      <div style={{position: 'absolute', left: 72, bottom: 340, color: 'rgba(246,248,250,.7)', fontFamily: FONT, fontSize: 21}}>ATC fish oil · personal experience</div>
    </SceneBackground>
  );
};

const OmegaScene = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const left = spring({frame: Math.max(0, frame - 5), fps, config: {damping: 16, stiffness: 130}});
  const right = spring({frame: Math.max(0, frame - 18), fps, config: {damping: 16, stiffness: 130}});
  const orbit = interpolate(frame, [0, 267], [-22, 338], {extrapolateRight: 'clamp'});
  return (
    <SceneBackground>
      <div style={{position: 'absolute', left: 72, right: 206, top: 320}}>
        <Kicker>Reason 1 · Omega-3</Kicker>
        <Headline style={{marginTop: 25, fontSize: 74}}>Two key fatty acids</Headline>
        <div style={{position: 'absolute', top: 260, left: 10, width: 740, height: 4, background: 'rgba(255,255,255,.13)', transform: 'rotate(-13deg)'}} />
        <div style={{display: 'flex', gap: 25, marginTop: 78}}>
          <div style={{boxSizing: 'border-box', width: 356, minHeight: 390, padding: '31px 28px', border: '1px solid rgba(84,213,228,.48)', background: 'rgba(9,31,45,.85)', transform: 'translateY(' + interpolate(left, [0, 1], [52, 0]) + 'px)', opacity: left}}>
            <div style={{position: 'relative', width: 154, height: 154, borderRadius: 100, border: '2px solid ' + CYAN, marginBottom: 30, overflow: 'hidden'}}><div style={{position: 'absolute', inset: 22, border: '1px dashed rgba(84,213,228,.7)', borderRadius: 100, transform: 'rotate(' + orbit + 'deg)'}} /><div style={{position: 'absolute', width: 25, height: 25, left: 68, top: 68, borderRadius: 40, background: CYAN}} /></div>
            <Headline color={CYAN} style={{fontSize: 62}}>EPA</Headline>
            <div style={{marginTop: 13, color: WHITE, fontFamily: HEAVY, fontSize: 28}}>Signaling pathways</div>
            <div style={{marginTop: 11, color: MUTED, fontFamily: FONT, fontSize: 22, lineHeight: 1.25}}>Involved in the body’s inflammatory response.</div>
          </div>
          <div style={{boxSizing: 'border-box', width: 356, minHeight: 390, padding: '31px 28px', border: '1px solid rgba(255,212,90,.47)', background: 'rgba(9,31,45,.85)', transform: 'translateY(' + interpolate(right, [0, 1], [52, 0]) + 'px)', opacity: right}}>
            <div style={{position: 'relative', width: 154, height: 154, borderRadius: 100, border: '2px solid ' + GOLD, marginBottom: 30, display: 'grid', placeItems: 'center'}}><div style={{width: 86, height: 86, borderRadius: 100, background: 'rgba(255,212,90,.13)', border: '1px solid ' + GOLD, transform: 'scale(' + (0.94 + Math.sin(frame / 12) * 0.04) + ')'}} /><div style={{position: 'absolute', color: GOLD, fontFamily: HEAVY, fontSize: 23}}>B / E</div></div>
            <Headline color={GOLD} style={{fontSize: 62}}>DHA</Headline>
            <div style={{marginTop: 13, color: WHITE, fontFamily: HEAVY, fontSize: 28}}>Brain + retina</div>
            <div style={{marginTop: 11, color: MUTED, fontFamily: FONT, fontSize: 22, lineHeight: 1.25}}>A structural omega-3 found in these tissues.</div>
          </div>
        </div>
      </div>
    </SceneBackground>
  );
};

const EPAScene = () => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [0, 48], [1, 0], {extrapolateRight: 'clamp'});
  const signal = interpolate(frame, [18, 160], [90, 720], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <SceneBackground accent={CYAN}>
      <div style={{position: 'absolute', left: 72, right: 206, top: 300}}>
        <Kicker color={CYAN}>EPA · what it does</Kicker>
        <Headline style={{marginTop: 24, fontSize: 72}}>Part of the body’s<br />signaling system</Headline>
        <svg width="820" height="440" viewBox="0 0 820 440" style={{position: 'absolute', left: -12, top: 285, overflow: 'visible'}}>
          <path d="M35 136 C135 136 130 198 238 198 S340 126 440 126 S552 225 642 225 S725 154 785 154" fill="none" stroke="rgba(84,213,228,.34)" strokeWidth="15" strokeLinecap="round" strokeDasharray="12 20" strokeDashoffset={-frame * 2} />
          <path d="M35 136 C135 136 130 198 238 198 S340 126 440 126 S552 225 642 225 S725 154 785 154" fill="none" stroke={CYAN} strokeWidth="3" strokeDasharray="560" strokeDashoffset={560 * draw} />
          {[80,238,440,642,785].map((cx, index) => <g key={index}><circle cx={cx} cy={[145,190,126,223,155][index]} r={46} fill="#0B2638" stroke={index === 4 ? GOLD : CYAN} strokeWidth="3" /><circle cx={cx} cy={[145,190,126,223,155][index]} r={11 + (index % 2) * 3} fill={index === 4 ? GOLD : CYAN} opacity={0.88} /></g>)}
          <circle cx={signal} cy={140 + Math.sin(frame / 8) * 42} r="12" fill={WHITE} />
          <text x="80" y="335" textAnchor="middle" fill={MUTED} fontSize="21" fontFamily="Arial">EPA</text>
          <text x="440" y="335" textAnchor="middle" fill={MUTED} fontSize="21" fontFamily="Arial">SIGNAL</text>
          <text x="785" y="335" textAnchor="middle" fill={MUTED} fontSize="21" fontFamily="Arial">RESPONSE</text>
        </svg>
        <div style={{position: 'absolute', top: 815, left: 0, maxWidth: 760, color: MUTED, fontFamily: FONT, fontSize: 26, lineHeight: 1.3}}>EPA-derived molecules take part in signaling that influences inflammatory responses.</div>
        <div style={{position: 'absolute', top: 915, left: 0, color: CYAN, fontFamily: HEAVY, fontSize: 19, letterSpacing: 0.3}}>GENERAL OMEGA-3 BIOLOGY · NIH ODS</div>
      </div>
    </SceneBackground>
  );
};

const DHAScene = () => {
  const frame = useCurrentFrame();
  const ring = interpolate(frame, [0, 90], [0.88, 1.08], {extrapolateRight: 'clamp'});
  const draw = interpolate(frame, [0, 44], [560, 0], {extrapolateRight: 'clamp'});
  return (
    <SceneBackground accent={BLUE}>
      <div style={{position: 'absolute', left: 72, right: 206, top: 300}}>
        <Kicker color={GOLD}>DHA · brain + vision</Kicker>
        <Headline style={{marginTop: 24, fontSize: 76}}>A structural omega-3</Headline>
        <svg width="820" height="560" viewBox="0 0 820 560" style={{position: 'absolute', left: -10, top: 270}}>
          <path d="M257 110 C198 65 125 102 134 162 C75 202 106 269 155 291 C126 346 165 408 215 399 C240 456 318 455 352 413 C397 452 463 423 463 376 C516 347 497 283 458 264 C484 207 438 151 392 159 C368 101 306 83 274 122Z" fill="rgba(87,147,230,.15)" stroke={BLUE} strokeWidth="6" strokeDasharray="560" strokeDashoffset={draw} />
          <path d="M255 137 C219 174 280 201 249 235 C214 274 278 300 250 339 M310 122 C276 165 340 195 305 230 C273 269 345 303 310 350 M370 152 C332 188 393 217 362 252 C330 286 391 319 368 362 M202 197 C178 224 222 254 196 282 M410 199 C379 228 426 256 398 286" fill="none" stroke="rgba(84,213,228,.72)" strokeWidth="4" />
          <circle cx="300" cy="260" r={105 * ring} fill="none" stroke="rgba(255,212,90,.46)" strokeWidth="2" />
          <path d="M510 265 C568 197 659 197 717 265 C659 333 568 333 510 265Z" fill="rgba(84,213,228,.12)" stroke={CYAN} strokeWidth="5" />
          <circle cx="613" cy="265" r="33" fill="rgba(255,212,90,.24)" stroke={GOLD} strokeWidth="5" />
          <circle cx="613" cy="265" r="12" fill={WHITE} />
          <path d="M460 256 C481 241 493 232 521 228" fill="none" stroke={GOLD} strokeWidth="3" strokeDasharray="6 11" strokeDashoffset={-frame * 2} />
          <text x="300" y="500" textAnchor="middle" fill={WHITE} fontSize="24" fontWeight="700" fontFamily="Arial">BRAIN</text>
          <text x="613" y="400" textAnchor="middle" fill={WHITE} fontSize="22" fontWeight="700" fontFamily="Arial">RETINA</text>
        </svg>
        <div style={{position: 'absolute', top: 875, left: 0, color: MUTED, fontFamily: FONT, fontSize: 26}}>DHA is especially abundant in brain and retinal tissue.</div>
        <div style={{position: 'absolute', top: 938, left: 0, color: GOLD, fontFamily: HEAVY, fontSize: 19}}>GENERAL OMEGA-3 BIOLOGY · NIH ODS</div>
      </div>
    </SceneBackground>
  );
};

const PersonalScene = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const rise = spring({frame: Math.max(0, frame - 2), fps, config: {damping: 17, stiffness: 145}});
  return (
    <AbsoluteFill style={{background: DEEP, overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, height: 720, background: 'radial-gradient(ellipse at 80% 0%,rgba(200,188,219,.09),transparent 45%),#1d1d20'}} />
      <div style={{position: 'absolute', left: 78, right: 78, top: 165, opacity: rise, transform: 'translateY(' + interpolate(rise, [0, 1], [28, 0]) + 'px)'}}>
        <Kicker>Reason 2 · personal experience</Kicker>
        <Headline style={{marginTop: 30, fontSize: 78}}>My own experience</Headline>
        <div style={{marginTop: 24, color: MUTED, fontFamily: FONT, fontSize: 31}}>Anecdotal. Results vary.</div>
        <div style={{marginTop: 38, height: 3, width: interpolate(frame, [0, 24], [0, 320], {extrapolateRight: 'clamp'}), background: GOLD}} />
      </div>
      <Presenter sourceStart={1450} sourceEnd={1606} top={720} height={1200} scale={1.03} />
      <div style={{position: 'absolute', left: 0, top: 718, width: 1080, height: 4, background: WHITE, opacity: .86}} />
    </AbsoluteFill>
  );
};

const SkinScene = () => {
  const frame = useCurrentFrame();
  return (
    <SceneBackground accent={GOLD}>
      <div style={{position: 'absolute', left: 72, right: 205, top: 300}}>
        <Kicker>My acne experience</Kicker>
        <Headline style={{marginTop: 24, fontSize: 76}}>A personal skin story</Headline>
        <svg width="820" height="600" viewBox="0 0 820 600" style={{position: 'absolute', left: -12, top: 280}}>
          <path d="M15 160 C160 119 244 204 382 161 S627 114 805 161 L805 282 C650 246 512 302 380 271 S126 245 15 284Z" fill="rgba(255,212,90,.13)" stroke="rgba(255,212,90,.72)" strokeWidth="3" />
          <path d="M15 284 C148 245 256 322 391 290 S656 262 805 294 L805 428 C662 392 532 450 386 415 S141 401 15 434Z" fill="rgba(84,213,228,.12)" stroke="rgba(84,213,228,.55)" strokeWidth="3" />
          <path d="M15 434 C143 399 266 465 391 435 S660 408 805 442 L805 550 L15 550Z" fill="rgba(87,147,230,.13)" stroke="rgba(87,147,230,.5)" strokeWidth="3" />
          {Array.from({length: 9}).map((_, index) => {
            const x = 82 + index * 88;
            const y = 213 + Math.sin(frame / 11 + index * 1.2) * 22;
            const size = 15 + (index % 3) * 3;
            return <g key={index}><circle cx={x} cy={y} r={size + 13} fill="rgba(255,212,90,.08)" /><circle cx={x} cy={y} r={size} fill={index % 2 ? CYAN : GOLD} opacity=".78" /></g>;
          })}
          <path d="M92 493 C233 461 341 521 487 488 S693 474 781 500" fill="none" stroke="rgba(255,255,255,.48)" strokeWidth="4" strokeDasharray="8 14" strokeDashoffset={-frame * 2} />
        </svg>
        <div style={{position: 'absolute', top: 864, left: 0, color: GOLD, fontFamily: HEAVY, fontSize: 23}}>PERSONAL EXPERIENCE · NOT A TREATMENT CLAIM</div>
      </div>
    </SceneBackground>
  );
};

const DOMSScene = () => {
  const frame = useCurrentFrame();
  const waves = [0, 1, 2, 3, 4];
  return (
    <AbsoluteFill style={{background: DEEP, overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, height: 720, background: 'radial-gradient(ellipse at 82% 8%,rgba(200,188,219,.09),transparent 42%),#1d1d20'}}>
        <div style={{position: 'absolute', left: 78, top: 94}}>
          <Kicker color={CYAN}>My recovery experience</Kicker>
          <Headline style={{marginTop: 23, fontSize: 88}}>DOMS</Headline>
          <div style={{marginTop: 10, color: WHITE, fontFamily: HEAVY, fontWeight: 600, fontSize: 31}}>Delayed-onset muscle soreness</div>
        </div>
        <svg width="900" height="250" viewBox="0 0 820 250" style={{position: 'absolute', left: 65, top: 405, overflow: 'visible'}}>
          {waves.map((row) => {
            const y = 25 + row * 43;
            const wave = Math.sin(frame / 13 + row * 0.6) * 9;
            return <g key={row}>
              <path d={'M20 ' + y + ' C155 ' + (y - 18 + wave) + ' 232 ' + (y + 21) + ' 366 ' + (y + wave) + ' S592 ' + (y - 19 + wave) + ' 800 ' + (y + 6)} fill="none" stroke={row % 2 ? CYAN : GOLD} strokeWidth="5" strokeLinecap="round" opacity=".72" />
              <path d={'M20 ' + (y + 10) + ' C155 ' + (y - 8 + wave) + ' 232 ' + (y + 31) + ' 366 ' + (y + 10 + wave) + ' S592 ' + (y - 9 + wave) + ' 800 ' + (y + 16)} fill="none" stroke="rgba(255,255,255,.3)" strokeWidth="1.5" strokeDasharray="4 13" strokeDashoffset={-frame * 2} />
            </g>;
          })}
        </svg>
      </div>
      <Presenter sourceStart={1862} sourceEnd={2180} top={720} height={1200} scale={1.04} />
      <div style={{position: 'absolute', left: 0, top: 718, width: 1080, height: 4, background: WHITE, opacity: .86}} />
      <div style={{position: 'absolute', left: 78, top: 1662, color: WHITE, fontFamily: FONT, fontWeight: 600, fontSize: 27, textShadow: '0 2px 12px rgba(0,0,0,.8)'}}>My experience only · individual results vary</div>
    </AbsoluteFill>
  );
};

const ResultsScene = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const first = spring({frame: Math.max(0, frame - 3), fps, config: {damping: 16, stiffness: 145}});
  const second = spring({frame: Math.max(0, frame - 17), fps, config: {damping: 17, stiffness: 135}});
  const line = interpolate(frame, [0, 55], [0, 700], {extrapolateRight: 'clamp'});
  return (
    <SceneBackground>
      <div style={{position: 'absolute', left: 72, right: 205, top: 510}}>
        <Kicker>Personal experience</Kicker>
        <Headline style={{marginTop: 35, fontSize: 92, opacity: first, transform: 'translateX(' + interpolate(first, [0, 1], [-45, 0]) + 'px)'}}>Results vary.</Headline>
        <Headline color={GOLD} style={{marginTop: 8, fontSize: 60, opacity: second, transform: 'translateX(' + interpolate(second, [0, 1], [-45, 0]) + 'px)'}}>This is my story.</Headline>
        <div style={{marginTop: 46, height: 4, width: line, background: GOLD}} />
      </div>
    </SceneBackground>
  );
};

const CapsuleOrbit = () => {
  const frame = useCurrentFrame();
  return (
    <svg width="250" height="170" viewBox="0 0 250 170">
      {[0, 1, 2, 3, 4, 5].map((index) => <g key={index} transform={'translate(' + (22 + index * 39) + ' ' + (44 + Math.sin(frame / 8 + index) * 12) + ') rotate(' + (index % 2 ? 28 : -28) + ')'}><rect x="0" y="0" width="25" height="58" rx="13" fill={index % 2 ? '#F7F8FA' : GOLD} /><path d="M0 29 H25" stroke={NAVY} strokeWidth="2" opacity=".55" /></g>)}
      <path d="M10 142 C65 111 164 165 240 116" fill="none" stroke="rgba(255,212,90,.45)" strokeWidth="2" strokeDasharray="5 10" strokeDashoffset={-frame * 2} />
    </svg>
  );
};

const ProductScene = () => {
  const frame = useCurrentFrame();
  const count = Math.round(interpolate(frame, [0, 100], [0, 100], {extrapolateRight: 'clamp'}));
  const {fps} = useVideoConfig();
  const reveal = spring({frame: Math.max(0, frame - 2), fps, config: {damping: 18, stiffness: 150}});
  return (
    <SceneBackground image accent={GOLD}>
      <div style={{position: 'absolute', left: 72, right: 205, top: 320, opacity: reveal}}>
        <Kicker>Reason 3 · Bottle value</Kicker>
        <div style={{marginTop: 25, display: 'flex', alignItems: 'baseline', gap: 18}}>
          <Headline color={GOLD} style={{fontSize: 110, minWidth: 275}}>{count}</Headline>
          <Headline style={{fontSize: 40}}>softgels<br />in one bottle</Headline>
        </div>
        <div style={{position: 'absolute', top: 550, left: 0, height: 8, width: interpolate(frame, [0, 100], [0, 700], {extrapolateRight: 'clamp'}), background: GOLD}} />
        <div style={{position: 'absolute', top: 585, left: 0, color: WHITE, fontFamily: FONT, fontSize: 27, fontWeight: 600}}>One bottle · 100 softgels</div>
      </div>
    </SceneBackground>
  );
};

const BlisterScene = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const scale = spring({frame: Math.max(0, frame - 2), fps, config: {damping: 13, stiffness: 185}});
  return (
    <SceneBackground accent={GOLD} image>
      <AbsoluteFill style={{background: 'rgba(3,10,17,.62)'}} />
      <div style={{position: 'absolute', left: 64, right: 210, top: 470, display: 'flex', gap: 22, alignItems: 'center'}}>
        <div style={{width: 360, height: 310, boxSizing: 'border-box', padding: 24, border: '1px solid rgba(255,255,255,.38)', background: 'rgba(5,14,22,.82)', transform: 'scale(' + scale + ')'}}>
          <div style={{color: GOLD, fontFamily: HEAVY, fontSize: 27}}>ONE BOTTLE</div>
          <div style={{marginTop: 13, color: WHITE, fontFamily: HEAVY, fontSize: 48}}>100</div>
          <CapsuleOrbit />
        </div>
        <div style={{width: 360, height: 310, boxSizing: 'border-box', padding: 24, border: '1px solid rgba(84,213,228,.44)', background: 'rgba(5,14,22,.82)', transform: 'scale(' + interpolate(scale, [0, 1], [0.92, 1]) + ')'}}>
          <div style={{color: CYAN, fontFamily: HEAVY, fontSize: 27}}>BLISTER PACKS</div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 46px)', gap: 12, marginTop: 25}}>
            {Array.from({length: 12}).map((_, index) => <div key={index} style={{height: 58, border: '1px solid rgba(84,213,228,.62)', borderRadius: 24, display: 'grid', placeItems: 'center', transform: 'translateY(' + Math.sin(frame / 7 + index) * 5 + 'px)'}}><div style={{width: 18, height: 38, borderRadius: 20, background: 'linear-gradient(180deg,#F5F7F9 0 48%, #AAB8C1 49% 100%)'}} /></div>)}
          </div>
          <div style={{marginTop: 24, color: MUTED, fontFamily: FONT, fontSize: 18}}>Compare your own cost per capsule.</div>
        </div>
      </div>
    </SceneBackground>
  );
};

const CostScene = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const grow = spring({frame: Math.max(0, frame - 4), fps, config: {damping: 17, stiffness: 120}});
  const bar = interpolate(frame, [12, 86], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <SceneBackground>
      <div style={{position: 'absolute', left: 72, right: 205, top: 360}}>
        <Kicker>Simple comparison</Kicker>
        <Headline style={{marginTop: 28, fontSize: 74}}>Compare the cost<br />per capsule</Headline>
        <div style={{marginTop: 66, display: 'flex', alignItems: 'center', gap: 18, opacity: grow}}>
          <div style={{width: 244, height: 205, border: '1px solid rgba(255,255,255,.24)', background: 'rgba(7,25,38,.86)', padding: 20, boxSizing: 'border-box'}}>
            <div style={{color: GOLD, fontFamily: HEAVY, fontSize: 25}}>BOTTLE</div>
            <div style={{marginTop: 15, color: WHITE, fontFamily: HEAVY, fontSize: 43}}>100</div>
            <div style={{color: MUTED, fontFamily: FONT, fontSize: 18}}>softgels</div>
          </div>
          <div style={{color: GOLD, fontFamily: HEAVY, fontSize: 42}}>VS</div>
          <div style={{width: 244, height: 205, border: '1px solid rgba(84,213,228,.32)', background: 'rgba(7,25,38,.86)', padding: 20, boxSizing: 'border-box'}}>
            <div style={{color: CYAN, fontFamily: HEAVY, fontSize: 25}}>BLISTER PACK</div>
            <div style={{marginTop: 15, color: WHITE, fontFamily: HEAVY, fontSize: 34}}>PER UNIT</div>
            <div style={{color: MUTED, fontFamily: FONT, fontSize: 18}}>check local price</div>
          </div>
        </div>
        <div style={{marginTop: 40, color: WHITE, fontFamily: HEAVY, fontSize: 31}}>Lower cost per capsule, based on your comparison.</div>
        <div style={{marginTop: 23, width: 700, height: 8, background: 'rgba(255,255,255,.14)'}}><div style={{height: '100%', width: (bar * 100) + '%', background: GOLD}} /></div>
      </div>
    </SceneBackground>
  );
};

const BasketIcon = ({progress}) => (
  <svg width="76" height="76" viewBox="0 0 80 80" style={{transform: 'scale(' + (0.9 + progress * 0.1) + ')'}}>
    <path d="M15 31 H65 L59 64 H21Z" fill="none" stroke={NAVY} strokeWidth="5" strokeLinejoin="round" />
    <path d="M28 31 L40 14 L52 31 M28 40 V56 M40 40 V56 M52 40 V56" fill="none" stroke={NAVY} strokeWidth="5" strokeLinecap="round" />
  </svg>
);

const CTAOverlay = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame: Math.max(0, frame - 8), fps, config: {damping: 14, stiffness: 180}});
  const shine = interpolate(frame, [12, 58], [-240, 870], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(180deg,rgba(2,9,15,.18),rgba(2,9,15,.36) 52%,rgba(2,9,15,.62))'}} />
      <div style={{position: 'absolute', left: 66, right: 205, top: 880, height: 150, overflow: 'hidden', background: GOLD, color: NAVY, boxShadow: '0 18px 52px rgba(0,0,0,.3)', display: 'flex', alignItems: 'center', gap: 22, padding: '0 28px', boxSizing: 'border-box', opacity: enter, transform: 'translateX(' + interpolate(enter, [0, 1], [-62, 0]) + 'px)'}}>
        <BasketIcon progress={enter} />
        <div>
          <div style={{fontFamily: FONT, fontSize: 18, fontWeight: 700}}>Available in the</div>
          <div style={{fontFamily: HEAVY, fontSize: 42, lineHeight: 1}}>Yellow Basket</div>
        </div>
        <div style={{position: 'absolute', top: 0, bottom: 0, left: shine, width: 130, transform: 'skewX(-18deg)', background: 'rgba(255,255,255,.32)'}} />
      </div>
      <div style={{position: 'absolute', left: 70, right: 205, top: 1498, color: WHITE, fontFamily: FONT, fontSize: 26, fontWeight: 600, lineHeight: 1.22, textShadow: '0 2px 12px rgba(0,0,0,.9)', opacity: enter}}>
        <span style={{fontWeight: 700, color: GOLD}}>Like and follow</span> for more science-based lifting advice. God bless!
      </div>
    </AbsoluteFill>
  );
};

const Wipe = ({color}) => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [0, 8], [-1120, 1560], {easing: Easing.inOut(Easing.cubic), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const opacity = interpolate(frame, [0, 2, 5, 8], [0, 0.78, 0.78, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{zIndex: 20, pointerEvents: 'none', opacity}}><div style={{position: 'absolute', inset: 0, background: 'linear-gradient(110deg, transparent 31%, ' + color + ' 48%, rgba(255,255,255,.9) 51%, transparent 70%)', transform: 'translateX(' + x + 'px)'}} /></AbsoluteFill>;
};

const Captions = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const bodyFrame = frame - POSTER;
  const cue = editData.captions.find((caption) => bodyFrame >= caption.startFrame && bodyFrame < caption.endFrame);
  if (!cue) return null;
  const local = Math.max(0, bodyFrame - cue.startFrame);
  const entry = spring({frame: local, fps, config: {damping: 15, stiffness: 230, mass: 0.42}});
  let activeWord = cue.words.findIndex((word) => bodyFrame >= word.startFrame && bodyFrame < word.endFrame);
  if (activeWord < 0) activeWord = cue.words.reduce((last, word, index) => word.startFrame <= bodyFrame ? index : last, 0);
  const important = ['epa', 'dha', '100', 'doms', 'individual', 'results', 'yellow', 'basket', 'atc'];
  return (
    <div style={{position: 'absolute', zIndex: 30, left: 78, right: 78, top: '67%', minHeight: 82, boxSizing: 'border-box', display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start', alignContent: 'center', alignItems: 'center', gap: '1px 12px', transform: 'translateY(-50%)', opacity: interpolate(entry, [0, 0.15, 1], [0, 1, 1]), textAlign: 'left', fontFamily: FONT, fontSize: 46, fontWeight: 600, lineHeight: 1.12, letterSpacing: -0.8, pointerEvents: 'none'}}>
      {cue.words.map((word, index) => {
        const lower = word.text.toLowerCase().replace(/[^a-z0-9]/g, '');
        const selected = important.includes(lower);
        return <span key={cue.startFrame + '-' + index} style={{display: 'inline-block', whiteSpace: 'pre', color: selected ? GOLD : WHITE, WebkitTextStroke: '1.2px rgba(12,12,14,.88)', paintOrder: 'stroke fill', textShadow: '0 2px 10px rgba(0,0,0,.82)'}}>{word.text}</span>;
      })}
    </div>
  );
};

export const ATCFishOilEditV4 = () => {
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill style={{overflow: 'hidden', backgroundColor: DEEP}}>
      <Sequence name="Real thumbnail poster · 0.1 seconds" from={0} durationInFrames={POSTER} premountFor={fps}><Poster /></Sequence>

      <CameraCut name="Opening direct-to-camera hook" from={POSTER} duration={237} sourceStart={191} sourceEnd={428} />
      <CameraCut name="Product held for Yellow Basket CTA" from={POSTER + 2772} duration={121} sourceStart={4123} sourceEnd={4244} />
      {/* One finished mix keeps Studio playback and the exported soundtrack identical.
          Individual SFX cues remain editable in sound-design-v3.json. */}
      <Audio name="Taglish voice + selective synchronized sound effects" src={staticFile('sound-track-v4-sfx.m4a')} premountFor={fps} />

      <Sequence name="Hook · fullscreen question + title" from={POSTER + 66} durationInFrames={171} premountFor={fps}><HookTakeover /></Sequence>
      <Sequence name="Omega-3 · EPA and DHA full-screen explainer" from={POSTER + 237} durationInFrames={267} premountFor={fps}><OmegaScene /></Sequence>
      <Sequence name="EPA · full-screen signaling diagram" from={POSTER + 504} durationInFrames={261} premountFor={fps}><EPAScene /></Sequence>
      <Sequence name="DHA · full-screen brain + retina illustration" from={POSTER + 765} durationInFrames={427} premountFor={fps}><DHAScene /></Sequence>
      <Sequence name="Personal experience · full-screen chapter card" from={POSTER + 1192} durationInFrames={156} premountFor={fps}><PersonalScene /></Sequence>
      <Sequence name="Acne · full-screen skin-layer motion graphic" from={POSTER + 1348} durationInFrames={238} premountFor={fps}><SkinScene /></Sequence>
      <Sequence name="DOMS · full-screen muscle-fiber motion graphic" from={POSTER + 1586} durationInFrames={318} premountFor={fps}><DOMSScene /></Sequence>
      <Sequence name="Personal results · full-screen qualifier" from={POSTER + 1904} durationInFrames={265} premountFor={fps}><ResultsScene /></Sequence>
      <Sequence name="Product · authentic full-screen close-up + 100 counter" from={POSTER + 2169} durationInFrames={352} premountFor={fps}><ProductScene /></Sequence>
      <Sequence name="Packaging · full-screen bottle versus blister visual" from={POSTER + 2521} durationInFrames={66} premountFor={fps}><BlisterScene /></Sequence>
      <Sequence name="Value · full-screen cost-per-capsule comparison" from={POSTER + 2587} durationInFrames={185} premountFor={fps}><CostScene /></Sequence>
      <Sequence name="CTA · original camera take + Yellow Basket graphic" from={POSTER + 2772} durationInFrames={121} premountFor={fps}>
        <CTAOverlay />
      </Sequence>

      <Sequence name="Chapter wipe · omega-3" from={POSTER + 237} durationInFrames={9} premountFor={fps}><Wipe color={CYAN} /></Sequence>
      <Sequence name="Chapter wipe · EPA" from={POSTER + 504} durationInFrames={9} premountFor={fps}><Wipe color={CYAN} /></Sequence>
      <Sequence name="Chapter wipe · DHA" from={POSTER + 765} durationInFrames={9} premountFor={fps}><Wipe color={BLUE} /></Sequence>
      <Sequence name="Chapter wipe · personal experience" from={POSTER + 1192} durationInFrames={9} premountFor={fps}><Wipe color={GOLD} /></Sequence>
      <Sequence name="Chapter wipe · skin story" from={POSTER + 1348} durationInFrames={9} premountFor={fps}><Wipe color={GOLD} /></Sequence>
      <Sequence name="Chapter wipe · DOMS" from={POSTER + 1586} durationInFrames={9} premountFor={fps}><Wipe color={CYAN} /></Sequence>
      <Sequence name="Chapter wipe · results vary" from={POSTER + 1904} durationInFrames={9} premountFor={fps}><Wipe color={GOLD} /></Sequence>
      <Sequence name="Chapter wipe · 100 softgels" from={POSTER + 2169} durationInFrames={9} premountFor={fps}><Wipe color={GOLD} /></Sequence>
      <Sequence name="Chapter wipe · packaging" from={POSTER + 2521} durationInFrames={9} premountFor={fps}><Wipe color={CYAN} /></Sequence>
      <Sequence name="Chapter wipe · cost comparison" from={POSTER + 2587} durationInFrames={9} premountFor={fps}><Wipe color={GOLD} /></Sequence>
      <Sequence name="Chapter wipe · Yellow Basket CTA" from={POSTER + 2772} durationInFrames={9} premountFor={fps}><Wipe color={GOLD} /></Sequence>

      <Sequence name="Cover dissolves into the moving hook" from={POSTER} durationInFrames={6} premountFor={fps}><CoverDissolve /></Sequence>
      <Captions />
    </AbsoluteFill>
  );
};
