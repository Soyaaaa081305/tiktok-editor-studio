import {Video} from '@remotion/media';
import {
  AbsoluteFill,
  Composition,
  Sequence,
  interpolate,
  registerRoot,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import editData from './edit-data.json';

const FPS = 60;
const WHITE = '#FFFFFF';
const GOLD = '#FFE600';
const BLACK = '#05070B';

const graphicCards = [
  {from: 0, to: 190, eyebrow: 'ATC FISH OIL', title: '3 REASONS I USE IT'},
  {from: 266, to: 515, eyebrow: 'REASON 01', title: 'OMEGA-3'},
  {from: 556, to: 802, eyebrow: 'EPA', title: 'INFLAMMATORY RESPONSE'},
  {from: 820, to: 1014, eyebrow: 'DHA', title: 'BRAIN + EYES'},
  {from: 1182, to: 1370, eyebrow: 'REASON 02', title: 'MY EXPERIENCE'},
  {from: 1484, to: 1638, eyebrow: 'ACNE', title: ''},
  {from: 1717, to: 1900, eyebrow: 'RECOVERY', title: 'DOMS'},
  {from: 2247, to: 2396, eyebrow: 'REASON 03', title: 'SIMPLE MATH'},
  {from: 2408, to: 2538, eyebrow: 'ONE BOTTLE', title: '100 CAPSULES'},
  {from: 2679, to: 2820, eyebrow: 'COMPARE', title: 'COST PER CAPSULE'},
  {from: 2874, to: 3006, eyebrow: 'GET IT HERE', title: 'YELLOW BASKET'},
];

const getClipVolume = (durationInFrames) => (frame) => {
  const fadeFrames = 3;
  const fadeIn = interpolate(frame, [0, fadeFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - fadeFrames, durationInFrames - 1],
    [1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
  return Math.min(fadeIn, fadeOut);
};

const EditTimeline = () => (
  <>
    {editData.edl.map((clip) => (
      <Sequence
        key={clip.id}
        name={clip.name}
        from={clip.outputStartFrame}
        durationInFrames={clip.durationInFrames}
      >
        <Video
          name={clip.name}
          src={staticFile('source.mp4')}
          trimBefore={clip.sourceStartFrame}
          trimAfter={clip.sourceEndFrame}
          volume={getClipVolume(clip.durationInFrames)}
          objectFit="cover"
          style={{width: '100%', height: '100%'}}
        />
      </Sequence>
    ))}
  </>
);

const ProductCutaway = () => (
  <Sequence
    name="Product cutaway · 100 capsules"
    from={2408}
    durationInFrames={60}
  >
    <Video
      name="ATC Fish Oil bottle close-up"
      src={staticFile('source.mp4')}
      trimBefore={366}
      trimAfter={426}
      muted
      objectFit="cover"
      style={{width: '100%', height: '100%'}}
    />
  </Sequence>
);

const CaptionLayer = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cue = editData.captions.find(
    (caption) => frame >= caption.startFrame && frame < caption.endFrame,
  );

  if (!cue) return null;

  const localFrame = Math.max(0, frame - cue.startFrame);
  const entrance = spring({
    frame: localFrame,
    fps,
    config: {damping: 14, stiffness: 240, mass: 0.42},
  });
  const groupScale = interpolate(entrance, [0, 1], [0.92, 1]);
  let activeWord = cue.words.findIndex(
    (word) => frame >= word.startFrame && frame < word.endFrame,
  );
  if (activeWord < 0) {
    activeWord = cue.words.reduce((last, word, index) => (
      word.startFrame <= frame ? index : last
    ), 0);
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: 38,
        right: 38,
        top: '70%',
        transform: `translateY(-50%) scale(${groupScale})`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 26,
        flexWrap: 'nowrap',
        textAlign: 'center',
        whiteSpace: 'nowrap',
        fontFamily: 'Arial Black, Inter, Arial, sans-serif',
        fontSize: 60,
        fontWeight: 900,
        lineHeight: 1.08,
        letterSpacing: -1.1,
        color: WHITE,
        WebkitTextStroke: '3.5px #05070B',
        paintOrder: 'stroke fill',
        textShadow: '0 4px 11px rgba(0,0,0,0.72)',
        pointerEvents: 'none',
      }}
    >
      {cue.words.map((word, index) => {
        const isActive = index === activeWord;
        const wordSpring = isActive
          ? spring({
              frame: Math.max(0, frame - word.startFrame),
              fps,
              config: {damping: 12, stiffness: 280, mass: 0.36},
            })
          : 1;
        const wordScale = isActive ? interpolate(wordSpring, [0, 1], [1, 1.15]) : 1;
        return (
          <span
            key={`${cue.startFrame}-${index}`}
            style={{
              display: 'inline-block',
              color: isActive ? GOLD : WHITE,
              transform: `scale(${wordScale})`,
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

const GraphicCard = ({card}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const localFrame = frame - card.from;
  const duration = card.to - card.from;
  const pop = spring({
    frame: Math.max(0, localFrame),
    fps,
    config: {damping: 16, stiffness: 170, mass: 0.56},
  });
  const fadeOut = interpolate(
    localFrame,
    [duration - 12, duration],
    [1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
  if (localFrame < 0 || localFrame >= duration) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: 126,
        left: '50%',
        transform: `translate(-50%, ${interpolate(pop, [0, 1], [18, 0])}px) scale(${interpolate(pop, [0, 1], [0.97, 1])})`,
        opacity: fadeOut,
        minWidth: 330,
        maxWidth: 900,
        boxSizing: 'border-box',
        padding: card.title ? '18px 28px 20px' : '17px 30px',
        borderRadius: 18,
        border: '2px solid rgba(255,230,0,0.9)',
        background: 'rgba(5,7,11,0.84)',
        boxShadow: '0 9px 24px rgba(0,0,0,0.32)',
        textAlign: 'center',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          color: GOLD,
          fontFamily: 'Arial Black, Inter, Arial, sans-serif',
          fontWeight: 900,
          fontSize: card.title ? 20 : 26,
          lineHeight: 1.05,
          letterSpacing: 2.2,
          textTransform: 'uppercase',
        }}
      >
        {card.eyebrow}
      </div>
      {card.title ? (
        <div
          style={{
            marginTop: 6,
            color: WHITE,
            fontFamily: 'Arial Black, Inter, Arial, sans-serif',
            fontWeight: 900,
            fontSize: 37,
            lineHeight: 1.05,
            letterSpacing: 0.2,
            textTransform: 'uppercase',
            textShadow: '0 2px 4px rgba(0,0,0,0.45)',
          }}
        >
          {card.title}
        </div>
      ) : null}
    </div>
  );
};

const Edit = () => (
  <AbsoluteFill style={{backgroundColor: BLACK, overflow: 'hidden'}}>
    <EditTimeline />
    <ProductCutaway />
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        background:
          'linear-gradient(180deg, rgba(0,0,0,0.19) 0%, transparent 23%, transparent 70%, rgba(0,0,0,0.08) 100%)',
      }}
    />
    {graphicCards.map((card, index) => (
      <GraphicCard key={`${card.from}-${index}`} card={card} />
    ))}
    <CaptionLayer />
  </AbsoluteFill>
);

const RemotionRoot = () => (
  <Composition
    id="ATCFishOil"
    component={Edit}
    durationInFrames={editData.durationInFrames}
    fps={FPS}
    width={1080}
    height={1920}
  />
);

registerRoot(RemotionRoot);
