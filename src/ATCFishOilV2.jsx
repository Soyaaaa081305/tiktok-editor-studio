import {Audio, Video} from '@remotion/media';
import {
  AbsoluteFill,
  Img,
  Sequence,
  Easing,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import editData from './edit-data-v2.json';

const FPS = 60;
const POSTER = 24;
const NAVY = '#06111D';
const PANEL = 'rgba(5, 17, 30, 0.91)';
const WHITE = '#F7FAFF';
const GOLD = '#FFC94A';
const CYAN = '#39D6E8';
const BLUE = '#4287FF';
const MUTED = '#B9C6D3';
const FONT = 'Arial, Inter, sans-serif';
const HEAVY = 'Arial Black, Arial, sans-serif';

const clipVolume = (duration) => (frame) => {
  const fade = 3;
  const fadeIn = interpolate(frame, [0, fade], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const fadeOut = interpolate(frame, [duration - fade, duration - 1], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return Math.min(fadeIn, fadeOut);
};

const fadeUp = (frame, fps = FPS) => spring({
  frame: Math.max(0, frame),
  fps,
  config: {damping: 16, stiffness: 185, mass: 0.5},
});

const RoundedPanel = ({children, style = {}, border = 'rgba(255,255,255,0.16)'}) => (
  <div
    style={{
      boxSizing: 'border-box',
      borderRadius: 28,
      border: '1.5px solid ' + border,
      background: PANEL,
      boxShadow: '0 22px 70px rgba(0,0,0,.38), inset 0 1px 0 rgba(255,255,255,.07)',
      backdropFilter: 'blur(12px)',
      ...style,
    }}
  >
    {children}
  </div>
);

const AccentPill = ({children, color = GOLD, style = {}}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      padding: '10px 16px',
      border: '1px solid ' + color,
      borderRadius: 999,
      color,
      background: 'rgba(4,12,22,.72)',
      fontFamily: HEAVY,
      fontSize: 19,
      lineHeight: 1,
      letterSpacing: 1.5,
      textTransform: 'uppercase',
      ...style,
    }}
  >
    <span style={{width: 8, height: 8, borderRadius: 50, background: color, boxShadow: '0 0 13px ' + color}} />
    {children}
  </div>
);

const Poster = () => {
  const frame = useCurrentFrame();
  const title = 1;
  const glow = interpolate(frame, [0, 23], [0.26, 0.58], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{overflow: 'hidden', backgroundColor: NAVY}}>
      <Img
          src={staticFile('poster-source.jpg')}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'contrast(1.04) saturate(1.07)',
          transform: 'scale(1.035)',
        }}
      />
      <AbsoluteFill
        style={{
          background: 'linear-gradient(180deg, rgba(3,10,20,.72) 0%, rgba(3,10,20,.24) 36%, rgba(3,10,20,.06) 60%, rgba(3,10,20,.72) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 84,
          left: 62,
          width: 956,
          height: 5,
          borderRadius: 10,
          background: 'linear-gradient(90deg,' + GOLD + ' 0%, ' + CYAN + ' 64%, transparent 100%)',
          opacity: 0.9,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 150,
          left: 58,
          opacity: title,
          transform: 'translateY(' + interpolate(title, [0, 1], [28, 0]) + 'px)',
        }}
      >
        <AccentPill color={GOLD}>A QUICK LOOK AT MY ROUTINE</AccentPill>
        <div
          style={{
            marginTop: 24,
            color: WHITE,
            fontFamily: HEAVY,
            fontWeight: 900,
            fontSize: 112,
            lineHeight: 0.92,
            letterSpacing: -4,
            textShadow: '0 10px 38px rgba(0,0,0,.46)',
          }}
        >
          3 REASONS
        </div>
        <div
          style={{
            marginTop: 17,
            color: GOLD,
            fontFamily: HEAVY,
            fontWeight: 900,
            fontSize: 52,
            lineHeight: 1,
            letterSpacing: 1.5,
            textShadow: '0 4px 22px rgba(0,0,0,.6)',
          }}
        >
          I USE ATC FISH OIL
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          right: 56,
          bottom: 96,
          width: 250,
          height: 250,
          border: '2px solid rgba(57,214,232,' + glow + ')',
          borderRadius: '50%',
          boxShadow: '0 0 50px rgba(57,214,232,' + (glow * 0.25) + ')',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 60,
          bottom: 84,
          color: WHITE,
          fontFamily: FONT,
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: 4,
          textTransform: 'uppercase',
          opacity: 0.9,
        }}
      >
        OMEGA-3 • PERSONAL EXPERIENCE • VALUE
      </div>
    </AbsoluteFill>
  );
};

const OpeningWipe = () => {
  const frame = useCurrentFrame() - POSTER;
  if (frame < 0 || frame >= 9) return null;
  const x = interpolate(frame, [0, 8], [0, 1180], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opacity = interpolate(frame, [0, 6, 8], [1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill
      style={{
        zIndex: 12,
        pointerEvents: 'none',
        opacity,
        background: 'linear-gradient(115deg, ' + NAVY + ' 0%, #0A2438 65%, ' + CYAN + ' 100%)',
        clipPath: 'polygon(' + x + 'px 0, ' + (x + 220) + 'px 0, ' + (x - 400) + 'px 100%, ' + (x - 620) + 'px 100%)',
      }}
    />
  );
};

const ClipPicture = ({duration, sourceStart, sourceEnd, zoomIn, zoomOut, origin}) => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, Math.max(1, duration - 1)], [zoomIn, zoomOut], {
    easing: Easing.inOut(Easing.quad),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{overflow: 'hidden', backgroundColor: NAVY}}>
      <AbsoluteFill
        style={{
          transform: 'scale(' + zoom + ')',
          transformOrigin: origin,
          filter: 'contrast(1.035) saturate(1.045)',
        }}
      >
        <Video
          src={staticFile('source.mp4')}
          trimBefore={sourceStart}
          trimAfter={sourceEnd}
          volume={clipVolume(duration)}
          objectFit="cover"
          style={{width: '100%', height: '100%'}}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Clip = ({name, from, duration, sourceStart, sourceEnd, zoomIn = 1.02, zoomOut = 1.065, origin = '50% 42%'}) => (
  <Sequence name={name} from={POSTER + from} durationInFrames={duration} premountFor={FPS}>
    <ClipPicture
      duration={duration}
      sourceStart={sourceStart}
      sourceEnd={sourceEnd}
      zoomIn={zoomIn}
      zoomOut={zoomOut}
      origin={origin}
    />
  </Sequence>
);

const HookGraphic = () => {
  const frame = useCurrentFrame();
  const enter = fadeUp(frame);
  const pulse = interpolate(frame, [0, 70, 140, 236], [0.3, 1, 0.55, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div style={{position: 'absolute', top: 208, left: 58, width: 740, opacity: enter, transform: 'translateX(' + interpolate(enter, [0, 1], [-48, 0]) + 'px)'}}>
      <AccentPill color={CYAN}>THE DAILY ROUTINE</AccentPill>
      <div style={{marginTop: 20, color: WHITE, fontFamily: HEAVY, fontSize: 49, fontWeight: 900, lineHeight: 0.98, letterSpacing: -1.4, textShadow: '0 5px 26px rgba(0,0,0,.5)'}}>
        ONE BOTTLE.<br />THREE REASONS.
      </div>
      <div style={{marginTop: 24, display: 'flex', alignItems: 'center', gap: 12}}>
        {['01  OMEGA-3', '02  MY EXPERIENCE', '03  VALUE'].map((item, index) => (
          <div key={item} style={{padding: '11px 14px', borderRadius: 13, border: '1px solid rgba(255,255,255,.32)', background: 'rgba(3,12,22,.68)', color: index === 0 && pulse > 0.7 ? GOLD : WHITE, fontFamily: HEAVY, fontSize: 15, letterSpacing: 0.4}}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

const OmegaIntro = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const left = spring({frame: Math.max(0, frame - 8), fps, config: {damping: 14, stiffness: 190}});
  const right = spring({frame: Math.max(0, frame - 22), fps, config: {damping: 14, stiffness: 190}});
  const spin = interpolate(frame, [0, 266], [0, 360], {extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', top: 225, left: 40, right: 40, height: 420}}>
      <AccentPill color={CYAN}>01 / OMEGA-3</AccentPill>
      <div style={{marginTop: 13, color: WHITE, fontFamily: HEAVY, fontSize: 38, lineHeight: 1, letterSpacing: -1.1}}>TWO KEY FATTY ACIDS</div>
      <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 22}}>
        <RoundedPanel border={'rgba(57,214,232,.72)'} style={{width: 330, height: 218, padding: '20px 20px', transform: 'translateX(' + interpolate(left, [0, 1], [-340, 0]) + 'px)', opacity: left}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div style={{fontFamily: HEAVY, fontSize: 58, color: CYAN, lineHeight: 1}}>EPA</div>
            <div style={{width: 58, height: 58, borderRadius: 50, border: '2px solid ' + CYAN, transform: 'rotate(' + spin + 'deg)', display: 'grid', placeItems: 'center', color: CYAN, fontFamily: HEAVY, fontSize: 24}}>↗</div>
          </div>
          <div style={{marginTop: 16, color: WHITE, fontFamily: HEAVY, fontSize: 20, letterSpacing: 0.5}}>CELL SIGNALING</div>
          <div style={{marginTop: 8, color: MUTED, fontFamily: FONT, fontSize: 16}}>Part of body pathways</div>
          <div style={{marginTop: 15, height: 3, width: 140, background: 'linear-gradient(90deg,' + CYAN + ', transparent)', borderRadius: 4}} />
        </RoundedPanel>
        <RoundedPanel border={'rgba(255,201,74,.72)'} style={{width: 330, height: 218, padding: '20px 20px', transform: 'translateX(' + interpolate(right, [0, 1], [340, 0]) + 'px)', opacity: right}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div style={{fontFamily: HEAVY, fontSize: 58, color: GOLD, lineHeight: 1}}>DHA</div>
            <div style={{width: 58, height: 58, borderRadius: 50, border: '2px solid ' + GOLD, display: 'grid', placeItems: 'center', color: GOLD, fontFamily: HEAVY, fontSize: 16}}>B / E</div>
          </div>
          <div style={{marginTop: 16, color: WHITE, fontFamily: HEAVY, fontSize: 20, letterSpacing: 0.5}}>BRAIN + RETINA</div>
          <div style={{marginTop: 8, color: MUTED, fontFamily: FONT, fontSize: 16}}>Structural omega-3</div>
          <div style={{marginTop: 15, height: 3, width: 140, background: 'linear-gradient(90deg,' + GOLD + ', transparent)', borderRadius: 4}} />
        </RoundedPanel>
      </div>
    </div>
  );
};

const EpaDiagram = () => {
  const frame = useCurrentFrame();
  const line = interpolate(frame, [8, 60], [180, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const signalX = interpolate(frame, [25, 150], [90, 340], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const signalY = 230 + Math.sin(frame / 9) * 10;
  return (
    <div style={{position: 'absolute', left: 48, top: 155, width: 390, height: 530}}>
      <AccentPill color={CYAN}>EPA • SIGNALING</AccentPill>
      <RoundedPanel border={'rgba(57,214,232,.66)'} style={{marginTop: 14, padding: '19px 19px', height: 435}}>
        <div style={{color: WHITE, fontFamily: HEAVY, fontSize: 24, letterSpacing: 0.2}}>INFLAMMATORY RESPONSE</div>
        <svg width="350" height="196" viewBox="0 0 420 235" style={{marginTop: 7}}>
          <defs>
            <linearGradient id="epa-line" x1="0" x2="1">
              <stop offset="0%" stopColor={CYAN} />
              <stop offset="100%" stopColor={BLUE} />
            </linearGradient>
          </defs>
          <path d="M24 76 C105 76 116 76 175 76" fill="none" stroke="rgba(57,214,232,.5)" strokeWidth="10" strokeLinecap="round" />
          <path d="M24 103 C105 103 116 103 175 103" fill="none" stroke="rgba(57,214,232,.5)" strokeWidth="10" strokeLinecap="round" />
          <path d="M175 89 C228 89 234 32 303 32 C348 32 360 69 380 69" fill="none" stroke="url(#epa-line)" strokeWidth="4" strokeDasharray="7 9" strokeDashoffset={line} />
          <path d="M175 89 C228 89 234 147 303 147 C348 147 360 109 380 109" fill="none" stroke="rgba(255,201,74,.67)" strokeWidth="3" strokeDasharray="5 11" strokeDashoffset={line * 0.7} />
          <circle cx="70" cy="89" r="28" fill="#0B2940" stroke={CYAN} strokeWidth="3" />
          <text x="70" y="96" textAnchor="middle" fill={WHITE} fontSize="16" fontFamily="Arial" fontWeight="700">EPA</text>
          <circle cx={signalX} cy={signalY} r="10" fill={CYAN} />
          <circle cx="380" cy="69" r="16" fill="rgba(57,214,232,.18)" stroke={CYAN} strokeWidth="3" />
          <circle cx="380" cy="109" r="16" fill="rgba(255,201,74,.12)" stroke={GOLD} strokeWidth="3" />
          <text x="285" y="21" fill={MUTED} fontSize="13" fontFamily="Arial" letterSpacing="1">SIGNALS</text>
          <text x="285" y="183" fill={MUTED} fontSize="13" fontFamily="Arial" letterSpacing="1">PATHWAYS</text>
        </svg>
        <div style={{height: 1, background: 'rgba(255,255,255,.17)', margin: '0 0 11px'}} />
        <div style={{color: MUTED, fontFamily: FONT, fontSize: 15, lineHeight: 1.3}}>EPA-derived molecules take part in signaling that influences inflammatory responses.</div>
        <div style={{marginTop: 8, color: CYAN, fontFamily: HEAVY, fontSize: 11, letterSpacing: 1}}>GENERAL OMEGA-3 BIOLOGY · NIH ODS</div>
      </RoundedPanel>
    </div>
  );
};

const DhaDiagram = () => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [0, 42], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const ring = interpolate(frame, [0, 100], [0.88, 1.08], {extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', right: 28, top: 160, width: 400}}>
      <AccentPill color={GOLD}>DHA • STRUCTURAL OMEGA-3</AccentPill>
      <RoundedPanel border={'rgba(255,201,74,.65)'} style={{marginTop: 18, padding: '23px 24px 19px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{color: WHITE, fontFamily: HEAVY, fontSize: 28}}>BRAIN + EYES</div>
          <div style={{width: 48, height: 4, borderRadius: 5, background: GOLD, opacity: draw}} />
        </div>
        <svg width="340" height="283" viewBox="0 0 420 350" style={{marginTop: 12}}>
          <path d="M136 84 C105 65 71 86 77 116 C48 137 63 172 89 183 C72 213 92 242 119 241 C132 274 173 269 188 246 C210 265 243 248 244 222 C271 207 260 173 239 163 C256 133 235 103 210 104 C198 72 164 66 146 88" fill="rgba(66,135,255,.18)" stroke={BLUE} strokeWidth="5" strokeDasharray="540" strokeDashoffset={540 * draw} />
          <path d="M144 90 C129 117 157 130 140 151 C126 173 159 183 145 211 M176 80 C158 111 197 124 174 148 C157 170 196 187 178 221 M207 105 C184 123 220 145 198 163 C182 181 217 202 199 229" fill="none" stroke="rgba(57,214,232,.77)" strokeWidth="3" />
          <circle cx="160" cy="165" r={68 * ring} fill="none" stroke="rgba(255,201,74,.48)" strokeWidth="2" />
          <path d="M274 165 C302 132 343 132 371 165 C344 198 302 198 274 165Z" fill="rgba(57,214,232,.12)" stroke={CYAN} strokeWidth="4" />
          <circle cx="323" cy="165" r="18" fill="rgba(255,201,74,.28)" stroke={GOLD} strokeWidth="4" />
          <circle cx="323" cy="165" r="7" fill={WHITE} />
          <path d="M242 152 C259 145 263 139 278 137" fill="none" stroke={GOLD} strokeWidth="3" strokeDasharray="4 7" strokeDashoffset={-frame * 2} />
          <text x="157" y="300" textAnchor="middle" fill={MUTED} fontSize="17" fontFamily="Arial" fontWeight="700" letterSpacing="2">BRAIN</text>
          <text x="322" y="220" textAnchor="middle" fill={MUTED} fontSize="15" fontFamily="Arial" fontWeight="700" letterSpacing="1.5">RETINA</text>
        </svg>
        <div style={{height: 1, background: 'rgba(255,255,255,.17)', margin: '0 0 11px'}} />
        <div style={{color: MUTED, fontFamily: FONT, fontSize: 16, lineHeight: 1.3}}>DHA is especially abundant in brain and retinal tissue.</div>
        <div style={{marginTop: 8, color: GOLD, fontFamily: HEAVY, fontSize: 11, letterSpacing: 1}}>GENERAL OMEGA-3 BIOLOGY · NIH ODS</div>
      </RoundedPanel>
    </div>
  );
};

const PersonalBadge = () => {
  const frame = useCurrentFrame();
  const entrance = fadeUp(frame);
  return (
    <div style={{position: 'absolute', left: 54, top: 230, opacity: entrance, transform: 'translateY(' + interpolate(entrance, [0, 1], [-18, 0]) + 'px)'}}>
      <AccentPill color={GOLD}>02 / PERSONAL EXPERIENCE</AccentPill>
      <div style={{marginTop: 13, display: 'inline-flex', padding: '9px 15px', borderRadius: 10, background: GOLD, color: NAVY, fontFamily: HEAVY, fontSize: 16, letterSpacing: 1.5}}>MY EXPERIENCE</div>
    </div>
  );
};

const SkinMotif = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{position: 'absolute', right: 42, top: 300, width: 390, height: 320, opacity: 0.88}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: 28, background: 'linear-gradient(145deg, rgba(27,39,55,.84), rgba(10,21,34,.25))', border: '1px solid rgba(255,201,74,.5)'}} />
      <svg width="390" height="320" viewBox="0 0 410 350" style={{position: 'absolute', inset: 0}}>
        {[0,1,2,3,4,5].map((index) => {
          const x = 65 + index * 57;
          const y = 86 + Math.sin(frame / 14 + index * 1.3) * 11;
          return <circle key={index} cx={x} cy={y} r={19 + (index % 2) * 4} fill="rgba(255,201,74,.08)" stroke="rgba(255,201,74,.8)" strokeWidth="2" />;
        })}
        <path d="M36 162 C92 147 134 180 197 164 C252 150 304 178 371 156 M35 206 C100 193 148 219 210 204 C273 189 325 214 379 195 M36 250 C92 239 141 259 198 246 C269 230 321 258 377 241" fill="none" stroke="rgba(255,255,255,.58)" strokeWidth="3" strokeDasharray="3 9" />
        <text x="36" y="318" fill={WHITE} fontSize="15" fontFamily="Arial" fontWeight="700" letterSpacing="2">ABSTRACT SKIN-CELL MOTIF</text>
      </svg>
      <div style={{position: 'absolute', top: 18, left: 22, color: GOLD, fontFamily: HEAVY, fontSize: 22, letterSpacing: 1}}>PERSONAL ANECDOTE</div>
    </div>
  );
};

const MuscleDiagram = () => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [0, 32], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', right: 26, top: 255, width: 420}}>
      <RoundedPanel border={'rgba(57,214,232,.58)'} style={{padding: '18px 19px 19px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
          <div style={{color: CYAN, fontFamily: HEAVY, fontSize: 36, letterSpacing: 1}}>DOMS</div>
          <div style={{color: MUTED, fontFamily: HEAVY, fontSize: 13, letterSpacing: 0.5}}>DELAYED ONSET MUSCLE SORENESS</div>
        </div>
        <svg width="380" height="188" viewBox="0 0 425 210" style={{marginTop: 15}}>
          <path d="M20 40 C86 20 132 62 199 41 C265 20 315 62 404 37 M18 81 C92 61 132 104 202 82 C277 58 331 101 406 78 M19 126 C89 107 138 147 203 127 C275 104 322 147 405 122 M21 170 C83 151 139 190 205 170 C280 149 333 189 402 164" fill="none" stroke="rgba(57,214,232,.7)" strokeWidth="4" strokeDasharray="1200" strokeDashoffset={1200 * draw} />
          <path d="M47 36 L57 56 M117 70 L126 91 M194 118 L205 141 M282 37 L291 59 M341 116 L350 138" stroke={GOLD} strokeWidth="4" strokeLinecap="round" opacity={0.7} />
          <path d="M27 190 C129 177 255 204 397 185" fill="none" stroke="rgba(255,201,74,.8)" strokeWidth="3" strokeDasharray="7 10" strokeDashoffset={-frame * 3} />
        </svg>
        <div style={{color: MUTED, fontFamily: FONT, fontSize: 14, lineHeight: 1.3}}>Illustrative muscle-fiber graphic · personal experience</div>
      </RoundedPanel>
    </div>
  );
};

const IndividualResults = () => {
  const frame = useCurrentFrame();
  const entrance = fadeUp(frame);
  const width = interpolate(frame, [0, 24], [0, 760], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', left: 54, right: 54, top: 230, opacity: entrance, transform: 'scale(' + interpolate(entrance, [0, 1], [0.96, 1]) + ')'}}>
      <RoundedPanel border={'rgba(255,201,74,.8)'} style={{padding: '29px 31px 27px', background: 'rgba(5,15,26,.88)'}}>
        <div style={{color: GOLD, fontFamily: HEAVY, fontSize: 19, letterSpacing: 2}}>A REMINDER, NOT A PROMISE</div>
        <div style={{marginTop: 11, color: WHITE, fontFamily: HEAVY, fontSize: 48, lineHeight: 1.02, letterSpacing: -0.7}}>INDIVIDUAL<br />RESULTS VARY</div>
        <div style={{marginTop: 19, height: 5, width, background: 'linear-gradient(90deg,' + GOLD + ', ' + CYAN + ')', borderRadius: 10}} />
      </RoundedPanel>
    </div>
  );
};

const CapsuleGrid = ({frame}) => {
  const count = Math.round(interpolate(frame, [42, 155], [0, 100], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  }));
  return (
    <div style={{display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 7, marginTop: 18, width: 260}}>
      {Array.from({length: 100}, (_, index) => (
        <div
          key={index}
          style={{
            height: 14,
            borderRadius: 99,
            transform: 'rotate(-24deg)',
            background: index < count ? 'linear-gradient(90deg,' + GOLD + ' 50%, #FFF3C4 50%)' : 'rgba(255,255,255,.08)',
            border: '1px solid ' + (index < count ? 'rgba(255,201,74,.9)' : 'rgba(255,255,255,.2)'),
            boxShadow: index < count ? '0 0 8px rgba(255,201,74,.3)' : 'none',
          }}
        />
      ))}
    </div>
  );
};

const ProductValue = () => {
  const frame = useCurrentFrame();
  const enter = fadeUp(frame);
  const number = Math.round(interpolate(frame, [46, 155], [0, 100], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  }));
  const bottleScale = interpolate(frame, [0, 72, 220], [0.96, 1.015, 1], {extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', inset: 0, opacity: enter}}>
      <AccentPill color={GOLD} style={{position: 'absolute', top: 238, left: 48}}>03 / SIMPLE MATH</AccentPill>
      <RoundedPanel border={'rgba(255,201,74,.6)'} style={{position: 'absolute', top: 300, left: 42, width: 300, height: 535, padding: 8, overflow: 'hidden', transform: 'scale(' + bottleScale + ')'}}>
        <Img src={staticFile('product-hero.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', borderRadius: 20}} />
      </RoundedPanel>
      <RoundedPanel border={'rgba(57,214,232,.56)'} style={{position: 'absolute', top: 300, right: 40, width: 320, height: 535, padding: '22px 19px'}}>
        <div style={{color: MUTED, fontFamily: HEAVY, fontSize: 16, letterSpacing: 1.5}}>ONE BOTTLE</div>
        <div style={{marginTop: 8, color: GOLD, fontFamily: HEAVY, fontSize: 116, lineHeight: 0.95, letterSpacing: -5}}>{number}</div>
        <div style={{marginTop: 6, color: WHITE, fontFamily: HEAVY, fontSize: 24, letterSpacing: 0.5}}>CAPSULES</div>
        <div style={{height: 1, background: 'rgba(255,255,255,.16)', marginTop: 15}} />
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 14, color: MUTED, fontFamily: HEAVY, fontSize: 12, letterSpacing: 0.8}}>
          <span>COUNT-UP</span><span>10 × 10</span>
        </div>
        <div style={{transform: 'scale(.82)', transformOrigin: 'top left', width: 260, marginTop: 2}}><CapsuleGrid frame={frame} /></div>
      </RoundedPanel>
    </div>
  );
};

const BlisterVisual = () => {
  const frame = useCurrentFrame();
  const enter = fadeUp(frame);
  const shift = interpolate(enter, [0, 1], [90, 0]);
  return (
    <div style={{position: 'absolute', right: 56, top: 300, width: 488, opacity: enter, transform: 'translateX(' + shift + 'px)'}}>
      <AccentPill color={CYAN}>THE COMPARISON FORMAT</AccentPill>
      <RoundedPanel border={'rgba(57,214,232,.65)'} style={{marginTop: 18, padding: '22px 24px 24px'}}>
        <div style={{color: WHITE, fontFamily: HEAVY, fontSize: 29}}>BLISTER PACKETS</div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginTop: 22}}>
          {Array.from({length: 10}, (_, index) => (
            <div key={index} style={{height: 57, borderRadius: '50%', border: '2px solid rgba(57,214,232,.78)', background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,.4), rgba(57,214,232,.12) 45%, rgba(4,15,25,.85) 80%)', boxShadow: 'inset 0 2px 9px rgba(255,255,255,.15)'}} />
          ))}
        </div>
        <div style={{marginTop: 21, color: MUTED, fontFamily: FONT, fontSize: 17}}>Generic format illustration · no competing brand shown</div>
      </RoundedPanel>
    </div>
  );
};

const PricePerCapsule = () => {
  const {fps} = useVideoConfig();
  const enter = fadeUp(useCurrentFrame());
  const step1 = spring({frame: Math.max(0, useCurrentFrame() - 4), fps, config: {damping: 15, stiffness: 180}});
  const step2 = spring({frame: Math.max(0, useCurrentFrame() - 13), fps, config: {damping: 15, stiffness: 180}});
  const step3 = spring({frame: Math.max(0, useCurrentFrame() - 23), fps, config: {damping: 15, stiffness: 180}});
  const steps = [step1, step2, step3];
  const cards = [
    {title: 'BOTTLE', sub: '100 capsules', color: GOLD},
    {title: 'COMPARE', sub: 'with blister packs', color: CYAN},
    {title: 'PER CAPSULE', sub: 'simple unit math', color: WHITE},
  ];
  return (
    <div style={{position: 'absolute', left: 46, right: 46, top: 190, opacity: enter}}>
      <AccentPill color={GOLD}>PRICE-PER-CAPSULE COMPARISON</AccentPill>
      <div style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: 21}}>
        {cards.map((card, index) => (
          <div key={card.title} style={{display: 'flex', alignItems: 'center', gap: 10}}>
            <RoundedPanel border={'rgba(255,255,255,.23)'} style={{width: 285, height: 150, padding: '20px 15px', textAlign: 'center', opacity: steps[index], transform: 'translateY(' + interpolate(steps[index], [0, 1], [24, 0]) + 'px)'}}>
              <div style={{color: card.color, fontFamily: HEAVY, fontSize: 23, letterSpacing: 0.6}}>{card.title}</div>
              <div style={{marginTop: 12, color: MUTED, fontFamily: FONT, fontSize: 17, lineHeight: 1.2}}>{card.sub}</div>
            </RoundedPanel>
            {index < cards.length - 1 ? <div style={{color: GOLD, fontFamily: HEAVY, fontSize: 38, opacity: steps[index + 1]}}>→</div> : null}
          </div>
        ))}
      </div>
    </div>
  );
};

const BasketIcon = ({progress}) => (
  <svg width="125" height="125" viewBox="0 0 125 125">
    <path d="M18 48 H107 L97 104 H29 Z" fill="rgba(255,201,74,.12)" stroke={GOLD} strokeWidth="5" strokeLinejoin="round" strokeDasharray="300" strokeDashoffset={300 * (1 - progress)} />
    <path d="M37 47 L54 20 M88 47 L71 20 M38 61 L44 89 M62 61 L62 91 M86 61 L80 89" fill="none" stroke={GOLD} strokeWidth="5" strokeLinecap="round" strokeDasharray="120" strokeDashoffset={120 * (1 - progress)} />
    <circle cx="40" cy="111" r="5" fill={GOLD} opacity={progress} />
    <circle cx="87" cy="111" r="5" fill={GOLD} opacity={progress} />
  </svg>
);

const CallToAction = () => {
  const frame = useCurrentFrame();
  const enter = fadeUp(frame);
  const draw = interpolate(frame, [2, 22], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const shine = interpolate(frame, [0, 120], [0, 980], {extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', left: 60, right: 60, top: 185, opacity: enter, transform: 'scale(' + interpolate(enter, [0, 1], [0.92, 1]) + ')'}}>
      <RoundedPanel border={'rgba(255,201,74,.86)'} style={{padding: '32px 35px 36px', background: 'rgba(5,15,25,.89)'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 25}}>
          <BasketIcon progress={draw} />
          <div>
            <div style={{color: MUTED, fontFamily: HEAVY, fontSize: 19, letterSpacing: 2}}>PRODUCT LINK</div>
            <div style={{marginTop: 8, color: GOLD, fontFamily: HEAVY, fontSize: 50, letterSpacing: -0.6}}>YELLOW BASKET</div>
          </div>
        </div>
        <div style={{marginTop: 20, height: 4, borderRadius: 8, background: 'rgba(255,255,255,.14)', overflow: 'hidden'}}>
          <div style={{height: '100%', width: 230, transform: 'translateX(' + (shine - 260) + 'px)', background: 'linear-gradient(90deg, transparent, ' + GOLD + ', transparent)'}} />
        </div>
        <div style={{marginTop: 18, color: WHITE, fontFamily: FONT, fontSize: 20}}>ATC Fish Oil · spoken CTA preserved</div>
      </RoundedPanel>
    </div>
  );
};

const DiagonalWipe = ({color}) => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [0, 7], [-720, 1220], {easing: Easing.inOut(Easing.cubic), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const opacity = interpolate(frame, [0, 2, 6, 7], [0, 0.58, 0.58, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{zIndex: 10, pointerEvents: 'none', opacity}}>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(110deg, transparent 20%, ' + color + ' 48%, rgba(255,255,255,.8) 52%, transparent 80%)', transform: 'translateX(' + x + 'px)'}} />
    </AbsoluteFill>
  );
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
  if (activeWord < 0) {
    activeWord = cue.words.reduce((last, word, index) => word.startFrame <= bodyFrame ? index : last, 0);
  }
  const important = ['epa', 'dha', '100', 'doms', 'individual', 'results', 'yellow', 'basket', 'atc'];
  return (
    <div
      style={{
        position: 'absolute',
        zIndex: 14,
        left: 62,
        right: 62,
        top: '65.5%',
        minHeight: 94,
        boxSizing: 'border-box',
        padding: '12px 18px 14px',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        gap: '7px 16px',
        borderRadius: 18,
        background: 'rgba(3, 9, 17, .31)',
        transform: 'translateY(-50%) scale(' + interpolate(entry, [0, 1], [0.96, 1]) + ')',
        opacity: interpolate(entry, [0, 0.15, 1], [0, 1, 1]),
        textAlign: 'center',
        fontFamily: HEAVY,
        fontSize: 51,
        fontWeight: 900,
        lineHeight: 1.04,
        letterSpacing: -0.6,
        pointerEvents: 'none',
      }}
    >
      {cue.words.map((word, index) => {
        const lower = word.text.toLowerCase().replace(/[^a-z0-9]/g, '');
        const selected = important.includes(lower);
        const active = index === activeWord;
        const pop = active ? spring({frame: Math.max(0, bodyFrame - word.startFrame), fps, config: {damping: 12, stiffness: 260, mass: 0.38}}) : 1;
        return (
          <span
            key={cue.startFrame + '-' + index}
            style={{
              display: 'inline-block',
              whiteSpace: 'pre',
              color: selected || active ? GOLD : WHITE,
              WebkitTextStroke: '3px rgba(2,7,12,.95)',
              paintOrder: 'stroke fill',
              textShadow: '0 4px 12px rgba(0,0,0,.86)',
              transform: 'scale(' + (active ? interpolate(pop, [0, 1], [0.9, 1.08]) : 1) + ')',
              transformOrigin: 'center center',
            }}
          >
            {word.text.toUpperCase()}
          </span>
        );
      })}
    </div>
  );
};

const SourceTag = () => {
  const frame = useCurrentFrame();
  if (frame < POSTER) return null;
  return (
    <div style={{position: 'absolute', zIndex: 13, right: 46, top: 113, padding: '7px 11px', borderRadius: 9, border: '1px solid rgba(255,255,255,.22)', background: 'rgba(4,12,22,.44)', color: 'rgba(255,255,255,.76)', fontFamily: FONT, fontSize: 12, letterSpacing: 0.6}}>
      PERSONAL ROUTINE · TAGLISH
    </div>
  );
};

const Sfx = ({from, file, volume = 0.14, name}) => (
  <Sequence name={name} from={from} durationInFrames={Math.ceil(FPS * 0.55)}>
    <Audio src={staticFile('sfx/' + file)} volume={volume} />
  </Sequence>
);

export const ATCFishOilEditV2 = () => (
  <AbsoluteFill style={{overflow: 'hidden', backgroundColor: NAVY}}>
    <Sequence name="Real-frame thumbnail poster · 0.4 seconds" from={0} durationInFrames={POSTER}>
      <Poster />
    </Sequence>

    <Clip name="01 · Hook / daily routine" from={0} duration={237} sourceStart={191} sourceEnd={428} zoomIn={1.015} zoomOut={1.075} origin="50% 39%" />
    <Clip name="02 · Omega-3 / EPA + DHA" from={237} duration={267} sourceStart={455} sourceEnd={722} zoomIn={1.025} zoomOut={1.07} origin="53% 40%" />
    <Clip name="03 · EPA / inflammatory signaling" from={504} duration={261} sourceStart={736} sourceEnd={997} zoomIn={1.03} zoomOut={1.075} origin="50% 43%" />
    <Clip name="04 · DHA / brain + eyes" from={765} duration={427} sourceStart={997} sourceEnd={1424} zoomIn={1.02} zoomOut={1.065} origin="48% 42%" />
    <Clip name="05 · Personal experience" from={1192} duration={156} sourceStart={1450} sourceEnd={1606} zoomIn={1.025} zoomOut={1.06} origin="51% 41%" />
    <Clip name="06 · Acne anecdote" from={1348} duration={238} sourceStart={1624} sourceEnd={1862} zoomIn={1.015} zoomOut={1.075} origin="50% 41%" />
    <Clip name="07 · DOMS anecdote" from={1586} duration={318} sourceStart={1862} sourceEnd={2180} zoomIn={1.025} zoomOut={1.07} origin="50% 41%" />
    <Clip name="08 · Individual-results caveat" from={1904} duration={295} sourceStart={2392} sourceEnd={2687} zoomIn={1.015} zoomOut={1.055} origin="51% 40%" />
    <Clip name="09 · 100 capsules / value" from={2199} duration={352} sourceStart={2826} sourceEnd={3178} zoomIn={1.015} zoomOut={1.065} origin="50% 42%" />
    <Clip name="10 · Blister-pack comparison" from={2551} duration={66} sourceStart={3334} sourceEnd={3400} zoomIn={1.02} zoomOut={1.05} origin="50% 42%" />
    <Clip name="11 · Cost per capsule" from={2617} duration={185} sourceStart={3521} sourceEnd={3706} zoomIn={1.02} zoomOut={1.065} origin="50% 42%" />
    <Clip name="12 · Yellow Basket CTA" from={2802} duration={121} sourceStart={4123} sourceEnd={4244} zoomIn={1.02} zoomOut={1.055} origin="50% 42%" />

    <AbsoluteFill style={{zIndex: 4, pointerEvents: 'none', background: 'linear-gradient(180deg, rgba(1,8,16,.28) 0%, transparent 21%, transparent 61%, rgba(2,8,16,.16) 100%)'}} />
    <SourceTag />

    <Sequence name="Hook typography / chapter rail" from={POSTER} durationInFrames={237}>
      <HookGraphic />
    </Sequence>
    <Sequence name="Omega-3 EPA + DHA molecule cards" from={POSTER + 237} durationInFrames={267}>
      <OmegaIntro />
    </Sequence>
    <Sequence name="EPA signaling diagram" from={POSTER + 504} durationInFrames={261}>
      <EpaDiagram />
    </Sequence>
    <Sequence name="DHA brain + retina diagram" from={POSTER + 765} durationInFrames={427}>
      <DhaDiagram />
    </Sequence>
    <Sequence name="Personal experience marker" from={POSTER + 1192} durationInFrames={394}>
      <PersonalBadge />
    </Sequence>
    <Sequence name="Abstract personal acne motif" from={POSTER + 1348} durationInFrames={238}>
      <SkinMotif />
    </Sequence>
    <Sequence name="DOMS muscle-fiber diagram" from={POSTER + 1586} durationInFrames={318}>
      <MuscleDiagram />
    </Sequence>
    <Sequence name="Individual results qualifier" from={POSTER + 1904} durationInFrames={295}>
      <IndividualResults />
    </Sequence>
    <Sequence name="Authentic ATC bottle + 100 capsule count" from={POSTER + 2199} durationInFrames={352}>
      <ProductValue />
    </Sequence>
    <Sequence name="Generic blister-pack illustration" from={POSTER + 2551} durationInFrames={66}>
      <BlisterVisual />
    </Sequence>
    <Sequence name="Qualitative per-capsule comparison" from={POSTER + 2617} durationInFrames={185}>
      <PricePerCapsule />
    </Sequence>
    <Sequence name="Verified spoken CTA / Yellow Basket" from={POSTER + 2802} durationInFrames={121}>
      <CallToAction />
    </Sequence>

    <OpeningWipe />
    <Sequence name="Chapter transition · omega-3" from={POSTER + 237} durationInFrames={8}><DiagonalWipe color={CYAN} /></Sequence>
    <Sequence name="Chapter transition · personal experience" from={POSTER + 1192} durationInFrames={8}><DiagonalWipe color={GOLD} /></Sequence>
    <Sequence name="Chapter transition · product value" from={POSTER + 2199} durationInFrames={8}><DiagonalWipe color={BLUE} /></Sequence>
    <Sequence name="Chapter transition · CTA" from={POSTER + 2802} durationInFrames={8}><DiagonalWipe color={GOLD} /></Sequence>

    <Sfx name="Intro impact" from={POSTER} file="soft-impact.wav" volume={0.14} />
    <Sfx name="Omega chapter sweep" from={POSTER + 237} file="soft-whoosh.wav" volume={0.12} />
    <Sfx name="EPA diagram tick" from={POSTER + 504} file="soft-tick.wav" volume={0.1} />
    <Sfx name="DHA reveal" from={POSTER + 765} file="soft-whoosh.wav" volume={0.09} />
    <Sfx name="Personal marker tap" from={POSTER + 1192} file="soft-tick.wav" volume={0.09} />
    <Sfx name="Muscle diagram tap" from={POSTER + 1586} file="soft-impact.wav" volume={0.08} />
    <Sfx name="100 capsule count resolve" from={POSTER + 2354} file="soft-impact.wav" volume={0.1} />
    <Sfx name="Yellow Basket CTA tap" from={POSTER + 2802} file="soft-tick.wav" volume={0.11} />

    <Captions />
  </AbsoluteFill>
);
