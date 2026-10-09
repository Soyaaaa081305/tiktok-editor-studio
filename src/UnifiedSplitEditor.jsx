import React from 'react';
import {
  AbsoluteFill,
  Composition,
  Sequence,
  Video,
  Audio,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

// ==========================================
// CONSTANTS & DESIGN TOKENS
// ==========================================
const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1920;
const FPS_DEFAULT = 60;

// Dylan Page News Daddy 55 / 45 Split Dimensions
const TOP_SPLIT_HEIGHT = 1056; // 55% of 1920
const BOTTOM_SPLIT_HEIGHT = 864; // 45% of 1920
const DIVIDER_HEIGHT = 10;
const DIVIDER_Y = TOP_SPLIT_HEIGHT; // Y: 1056px

// Style Tokens
const COLOR_GOLD = '#FFE600';
const COLOR_WHITE = '#FFFFFF';
const COLOR_BLACK = '#0A0D12';
const COLOR_DARK_CARD = 'rgba(12, 17, 24, 0.92)';
const COLOR_RED_ACCENT = '#FF3B30';
const COLOR_GREEN_ACCENT = '#34C759';
const FONT_FAMILY = 'Inter, Arial Black, -apple-system, sans-serif';

// Karaoke Subtitles Safe Center
const CAPTION_CENTER_Y = 1380;

// ==========================================
// SUB-COMPONENTS
// ==========================================

/**
 * 10px Solid Gold Horizontal Divider
 */
export const GoldDivider = ({color = COLOR_GOLD, height = DIVIDER_HEIGHT}) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      top: TOP_SPLIT_HEIGHT - Math.floor(height / 2),
      width: CANVAS_WIDTH,
      height,
      backgroundColor: color,
      boxShadow: `0 0 16px rgba(255, 230, 0, 0.55), 0 3px 8px rgba(0, 0, 0, 0.8)`,
      zIndex: 40,
    }}
  />
);

/**
 * Top 55% Proof / B-Roll / Graphic Zone
 */
export const TopProofZone = ({asset, currentSegmentIndex}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  if (!asset) {
    return (
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: CANVAS_WIDTH,
          height: TOP_SPLIT_HEIGHT,
          backgroundColor: COLOR_BLACK,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <div style={{color: '#666', fontFamily: FONT_FAMILY, fontSize: 32}}>
          Proof / B-Roll Zone (55%)
        </div>
      </div>
    );
  }

  // Visual Entrance Animation
  const entranceOpacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const entranceScale = interpolate(frame, [0, 12], [1.05, 1.0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: CANVAS_WIDTH,
        height: TOP_SPLIT_HEIGHT,
        backgroundColor: COLOR_BLACK,
        overflow: 'hidden',
        opacity: entranceOpacity,
        zIndex: 20,
      }}
    >
      {/* Background Graphic / Video / Image */}
      {asset.type === 'video' && asset.src && (
        <Video
          src={asset.src.startsWith('http') ? asset.src : staticFile(asset.src)}
          trimBefore={asset.trimBefore || 0}
          volume={asset.volume ?? 0}
          muted={asset.muted ?? true}
          objectFit="cover"
          style={{width: '100%', height: '100%'}}
        />
      )}

      {asset.type === 'image' && asset.src && (
        <Img
          src={asset.src.startsWith('http') ? asset.src : staticFile(asset.src)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: asset.objectFit || 'cover',
            transform: `scale(${entranceScale})`,
          }}
        />
      )}

      {/* Comparison Layout ('Mali To' vs 'Ganito Dapat') */}
      {asset.type === 'comparison' && (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'row',
            position: 'relative',
          }}
        >
          {/* Left: Mali (Red) */}
          <div
            style={{
              flex: 1,
              backgroundColor: 'rgba(255, 59, 48, 0.15)',
              borderRight: '2px solid rgba(255,255,255,0.2)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 30,
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                backgroundColor: COLOR_RED_ACCENT,
                color: COLOR_WHITE,
                fontFamily: FONT_FAMILY,
                fontWeight: 900,
                fontSize: 28,
                padding: '8px 24px',
                borderRadius: 999,
                letterSpacing: 1.5,
                marginBottom: 20,
              }}
            >
              {asset.leftBadge || 'MALI TO ❌'}
            </div>
            <div
              style={{
                color: COLOR_WHITE,
                fontFamily: FONT_FAMILY,
                fontWeight: 800,
                fontSize: 34,
                textAlign: 'center',
                lineHeight: 1.25,
              }}
            >
              {asset.leftText}
            </div>
          </div>

          {/* Right: Ganito Dapat (Green) */}
          <div
            style={{
              flex: 1,
              backgroundColor: 'rgba(52, 199, 89, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 30,
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                backgroundColor: COLOR_GREEN_ACCENT,
                color: COLOR_BLACK,
                fontFamily: FONT_FAMILY,
                fontWeight: 900,
                fontSize: 28,
                padding: '8px 24px',
                borderRadius: 999,
                letterSpacing: 1.5,
                marginBottom: 20,
              }}
            >
              {asset.rightBadge || 'GANITO DAPAT ✅'}
            </div>
            <div
              style={{
                color: COLOR_WHITE,
                fontFamily: FONT_FAMILY,
                fontWeight: 800,
                fontSize: 34,
                textAlign: 'center',
                lineHeight: 1.25,
              }}
            >
              {asset.rightText}
            </div>
          </div>
        </div>
      )}

      {/* Stat Card / Big Evidence Number */}
      {asset.type === 'stat' && (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle at center, #1b2636 0%, #0a0e14 100%)',
            padding: 50,
            boxSizing: 'border-box',
          }}
        >
          {asset.eyebrow && (
            <div
              style={{
                color: COLOR_GOLD,
                fontFamily: FONT_FAMILY,
                fontWeight: 900,
                fontSize: 28,
                letterSpacing: 3,
                textTransform: 'uppercase',
                marginBottom: 16,
              }}
            >
              {asset.eyebrow}
            </div>
          )}
          <div
            style={{
              color: COLOR_WHITE,
              fontFamily: FONT_FAMILY,
              fontWeight: 900,
              fontSize: 110,
              letterSpacing: -2,
              lineHeight: 0.95,
              textShadow: '0 4px 24px rgba(0,0,0,0.6)',
              marginBottom: 16,
            }}
          >
            {asset.statNumber}
          </div>
          {asset.statLabel && (
            <div
              style={{
                color: '#CBD5E1',
                fontFamily: FONT_FAMILY,
                fontWeight: 700,
                fontSize: 36,
                textAlign: 'center',
                lineHeight: 1.2,
                maxWidth: 820,
              }}
            >
              {asset.statLabel}
            </div>
          )}
        </div>
      )}

      {/* Floating Kicker Card / Title Overlay */}
      {asset.cardTitle && (
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            left: 50,
            right: 50,
            backgroundColor: COLOR_DARK_CARD,
            borderLeft: `8px solid ${COLOR_GOLD}`,
            borderRadius: 14,
            padding: '20px 28px',
            boxShadow: '0 12px 36px rgba(0,0,0,0.5)',
          }}
        >
          {asset.cardEyebrow && (
            <div
              style={{
                color: COLOR_GOLD,
                fontFamily: FONT_FAMILY,
                fontWeight: 800,
                fontSize: 22,
                letterSpacing: 2,
                textTransform: 'uppercase',
                marginBottom: 6,
              }}
            >
              {asset.cardEyebrow}
            </div>
          )}
          <div
            style={{
              color: COLOR_WHITE,
              fontFamily: FONT_FAMILY,
              fontWeight: 900,
              fontSize: 36,
              lineHeight: 1.15,
            }}
          >
            {asset.cardTitle}
          </div>
        </div>
      )}

      {/* Dark Edge Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.4) 100%)',
        }}
      />
    </div>
  );
};

/**
 * Bottom 45% Presenter Zone (Chest-up talking head)
 */
export const BottomPresenterZone = ({
  presenterSrc,
  sourceStartFrame = 0,
  sourceEndFrame,
  cropOffsetY = -180, // Default chest-up framing offset
  scale = 1.05,
  durationInFrames = 60,
  volume = 1.0,
}) => {
  const getVolume = (frame) => {
    const fade = 3;
    const fadeIn = interpolate(frame, [0, fade], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    const fadeOut = interpolate(
      frame,
      [durationInFrames - fade, durationInFrames - 1],
      [1, 0],
      {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
    );
    return Math.min(fadeIn, fadeOut) * volume;
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: BOTTOM_SPLIT_HEIGHT + (TOP_SPLIT_HEIGHT - BOTTOM_SPLIT_HEIGHT), // Y: 1056px
        left: 0,
        width: CANVAS_WIDTH,
        height: BOTTOM_SPLIT_HEIGHT,
        backgroundColor: COLOR_BLACK,
        overflow: 'hidden',
        zIndex: 10,
      }}
    >
      {presenterSrc ? (
        <Video
          src={presenterSrc.startsWith('http') ? presenterSrc : staticFile(presenterSrc)}
          startFrom={sourceStartFrame}
          endAt={sourceEndFrame}
          volume={getVolume}
          style={{
            position: 'absolute',
            left: 0,
            top: cropOffsetY,
            width: CANVAS_WIDTH,
            height: CANVAS_HEIGHT,
            objectFit: 'cover',
            transform: `scale(${scale})`,
            transformOrigin: 'center 35%',
          }}
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#111620',
          }}
        >
          <div style={{color: '#888', fontFamily: FONT_FAMILY, fontSize: 32}}>
            Presenter Talking Head Zone (45%)
          </div>
        </div>
      )}

      {/* Subtle Depth Gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, transparent 25%, transparent 75%, rgba(0,0,0,0.5) 100%)',
        }}
      />
    </div>
  );
};

/**
 * Karaoke Subtitles Layer with Gold Word Springs
 * Placed at Center Y: 1380px
 */
export const KaraokeSubtitleLayer = ({captions = []}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Find active caption phrase
  const activeCue = captions.find(
    (c) => frame >= c.startFrame && frame < c.endFrame,
  );

  if (!activeCue) return null;

  const words = activeCue.words || activeCue.text.split(' ').map((w, idx, arr) => {
    const totalFrames = activeCue.endFrame - activeCue.startFrame;
    const wordDur = Math.floor(totalFrames / arr.length);
    return {
      word: w,
      startFrame: activeCue.startFrame + idx * wordDur,
      endFrame: activeCue.startFrame + (idx + 1) * wordDur,
    };
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: CAPTION_CENTER_Y,
        transform: 'translateY(-50%)',
        left: 60,
        right: 60,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        columnGap: 14,
        rowGap: 10,
        zIndex: 50,
        pointerEvents: 'none',
        textAlign: 'center',
      }}
    >
      {words.map((w, index) => {
        const isWordActive = frame >= w.startFrame && frame < w.endFrame;
        const wordFramesActive = frame - w.startFrame;

        // Snappy spring scale pop when word triggers
        const springPop = isWordActive
          ? spring({
              frame: Math.max(0, wordFramesActive),
              fps,
              config: {damping: 14, stiffness: 220, mass: 0.6},
            })
          : 0;

        const scale = isWordActive ? 1.0 + springPop * 0.16 : 1.0;
        const color = isWordActive ? COLOR_GOLD : COLOR_WHITE;

        return (
          <span
            key={`${index}-${w.word}`}
            style={{
              fontFamily: FONT_FAMILY,
              fontWeight: 900,
              fontSize: 52,
              lineHeight: 1.15,
              textTransform: 'uppercase',
              color,
              display: 'inline-block',
              transform: `scale(${scale})`,
              transformOrigin: 'center center',
              textShadow: isWordActive
                ? `0 0 20px rgba(255, 230, 0, 0.75), 0 3px 8px rgba(0, 0, 0, 0.95)`
                : '0 3px 8px rgba(0, 0, 0, 0.95), 0 1px 3px rgba(0, 0, 0, 0.8)',
              WebkitTextStroke: '2px rgba(0, 0, 0, 0.9)',
              letterSpacing: 0.5,
              transition: 'color 0.05s ease-out',
            }}
          >
            {w.word}
          </span>
        );
      })}
    </div>
  );
};

/**
 * Opening 0.1s Cover Hold (Frames 0 to ~6)
 */
export const OpeningCover = ({coverSrc, durationFrames = 6}) => {
  const frame = useCurrentFrame();
  if (frame >= durationFrames || !coverSrc) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 100,
        backgroundColor: COLOR_BLACK,
      }}
    >
      <Img
        src={coverSrc.startsWith('http') ? coverSrc : staticFile(coverSrc)}
        style={{width: '100%', height: '100%', objectFit: 'cover'}}
      />
    </div>
  );
};

// ==========================================
// UNIFIED SPLIT EDITOR ENGINE (MAIN COMPONENT)
// ==========================================

export const UnifiedSplitEditor = ({
  presenterSrc = 'newvid.mp4',
  coverSrc = 'product-hero.jpg',
  segments = [],
  topSegments = [],
  presenterClips = [],
  captions = [],
  sfxCues = [],
  presenterOffsetY = -150,
  presenterScale = 1.15,
}) => {
  const hasIndependentTracks = topSegments.length > 0 || presenterClips.length > 0;

  return (
    <AbsoluteFill style={{backgroundColor: COLOR_BLACK, overflow: 'hidden'}}>
      {/* 1. Opening Cover Hold (~0.1s / 6 frames) */}
      <OpeningCover coverSrc={coverSrc} durationFrames={6} />

      {/* 2. Timeline Tracks */}
      {hasIndependentTracks ? (
        <>
          {/* Top 55% Proof Track */}
          {topSegments.map((seg, idx) => (
            <Sequence
              key={seg.id || `top-seg-${idx}`}
              from={seg.timelineStartFrame}
              durationInFrames={seg.durationInFrames}
              name={seg.name || `Top Proof Beat ${idx + 1}`}
            >
              <TopProofZone asset={seg.topAsset} currentSegmentIndex={idx} />
            </Sequence>
          ))}

          {/* Bottom 45% Presenter Track */}
          {presenterClips.map((clip, idx) => (
            <Sequence
              key={clip.id || `pres-clip-${idx}`}
              from={clip.timelineStartFrame}
              durationInFrames={clip.durationInFrames}
              name={clip.name || `Presenter Speech ${idx + 1}`}
            >
              <BottomPresenterZone
                presenterSrc={presenterSrc}
                sourceStartFrame={clip.sourceStartFrame}
                sourceEndFrame={clip.sourceEndFrame}
                cropOffsetY={clip.presenterOffsetY ?? presenterOffsetY}
                scale={clip.presenterScale ?? presenterScale}
                durationInFrames={clip.durationInFrames}
              />
            </Sequence>
          ))}
        </>
      ) : (
        // Combined Segments Mode
        segments.map((seg, idx) => (
          <Sequence
            key={seg.id || `seg-${idx}`}
            from={seg.timelineStartFrame}
            durationInFrames={seg.durationInFrames}
            name={seg.name || `Segment ${idx + 1}`}
          >
            <TopProofZone asset={seg.topAsset} currentSegmentIndex={idx} />
            <BottomPresenterZone
              presenterSrc={presenterSrc}
              sourceStartFrame={seg.sourceStartFrame}
              sourceEndFrame={seg.sourceEndFrame}
              cropOffsetY={seg.presenterOffsetY ?? presenterOffsetY}
              scale={seg.presenterScale ?? presenterScale}
              durationInFrames={seg.durationInFrames}
            />
          </Sequence>
        ))
      )}

      {/* 3. News Daddy 10px Gold Divider Bar */}
      <GoldDivider />

      {/* 4. Smartfit Karaoke Subtitles at Center Y: 1380px */}
      <KaraokeSubtitleLayer captions={captions} />

      {/* 5. Sound Effects Layer (No added music) */}
      {sfxCues.map((sfx, idx) => (
        <Sequence
          key={`sfx-${idx}`}
          from={sfx.frame}
          durationInFrames={sfx.durationInFrames || 45}
          name={`SFX: ${sfx.name || 'Effect'}`}
        >
          <Audio
            src={sfx.src.startsWith('http') ? sfx.src : staticFile(sfx.src)}
            volume={sfx.volume ?? 0.35}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// ==========================================
// DEMO / FALLBACK DATA (2026-10-09 Slot 01 Creatine)
// ==========================================

export const DEFAULT_SLOT_01_PROPS = {
  presenterSrc: 'source.mp4',
  coverSrc: 'product-hero.jpg',
  presenterOffsetY: -220,
  presenterScale: 1.08,
  segments: [
    {
      id: 'hook',
      timelineStartFrame: 0,
      durationInFrames: 360, // 0 - 6s
      sourceStartFrame: 0,
      sourceEndFrame: 360,
      topAsset: {
        type: 'stat',
        eyebrow: 'CREATINE MYTH CHECK',
        statNumber: '₱2,000',
        statLabel: 'Fancy marketing vs ₱600 pure monohydrate',
        cardEyebrow: 'WAG MAGPAUTO',
        cardTitle: 'Most expensive is NOT most effective',
      },
    },
    {
      id: 'science-meta',
      timelineStartFrame: 360,
      durationInFrames: 540, // 6 - 15s
      sourceStartFrame: 360,
      sourceEndFrame: 900,
      topAsset: {
        type: 'stat',
        eyebrow: 'PUBMED META-ANALYSIS',
        statNumber: '500+',
        statLabel: 'Peer-reviewed studies on Monohydrate efficacy',
        cardEyebrow: 'SCIENCE TRUTH',
        cardTitle: 'Pure Monohydrate is still #1 worldwide',
      },
    },
    {
      id: 'comparison',
      timelineStartFrame: 900,
      durationInFrames: 600, // 15 - 25s
      sourceStartFrame: 900,
      sourceEndFrame: 1500,
      topAsset: {
        type: 'comparison',
        leftBadge: 'FANCY HCL ❌',
        leftText: 'Overpriced, zero extra muscle gain, masakit sa bulsa',
        rightBadge: 'PURE MONO ✅',
        rightText: 'Proven saturation, 100% absorption, budget-friendly',
      },
    },
    {
      id: 'dose-protocol',
      timelineStartFrame: 1500,
      durationInFrames: 600, // 25 - 35s
      sourceStartFrame: 1500,
      sourceEndFrame: 2100,
      topAsset: {
        type: 'stat',
        eyebrow: 'DAILY PROTOCOL',
        statNumber: '5g / DAY',
        statLabel: 'Consistent muscle saturation, no loading required',
        cardEyebrow: 'RECOMMENDATION',
        cardTitle: 'Consistency beats fancy formulas every time',
      },
    },
    {
      id: 'cta',
      timelineStartFrame: 2100,
      durationInFrames: 600, // 35 - 45s
      sourceStartFrame: 2100,
      sourceEndFrame: 2700,
      topAsset: {
        type: 'stat',
        eyebrow: 'CERTIFIED & LEGIT',
        statNumber: 'YELLOW BASKET',
        statLabel: 'Check the yellow basket sa baba for pure certified creatine',
        cardEyebrow: 'NODA.LIFTS',
        cardTitle: 'Like & follow for more science advice. God bless!',
      },
    },
  ],
  captions: [
    {
      id: 'c1',
      startFrame: 0,
      endFrame: 120,
      text: 'Wag kang magpauto sa mamahaling creatine',
    },
    {
      id: 'c2',
      startFrame: 120,
      endFrame: 240,
      text: 'na umaabot ng dalawang libong piso',
    },
    {
      id: 'c3',
      startFrame: 240,
      endFrame: 360,
      text: 'para lang sa advanced marketing.',
    },
    {
      id: 'c4',
      startFrame: 360,
      endFrame: 540,
      text: 'Ayon sa research at global meta-analyses,',
    },
    {
      id: 'c5',
      startFrame: 540,
      endFrame: 720,
      text: 'pure Creatine Monohydrate pa rin',
    },
    {
      id: 'c6',
      startFrame: 720,
      endFrame: 900,
      text: 'ang most effective form sa buong mundo.',
    },
    {
      id: 'c7',
      startFrame: 900,
      endFrame: 1200,
      text: 'Walang dagdag na muscle growth sa HCL,',
    },
    {
      id: 'c8',
      startFrame: 1200,
      endFrame: 1500,
      text: 'mas masakit lang talaga siya sa bulsa.',
    },
    {
      id: 'c9',
      startFrame: 1500,
      endFrame: 1800,
      text: 'Five grams of pure monohydrate every day',
    },
    {
      id: 'c10',
      startFrame: 1800,
      endFrame: 2100,
      text: 'ang kailangan for total muscle saturation.',
    },
    {
      id: 'c11',
      startFrame: 2100,
      endFrame: 2400,
      text: 'Check out the yellow basket sa baba.',
    },
    {
      id: 'c12',
      startFrame: 2400,
      endFrame: 2700,
      text: 'Like and follow for science-based advice. God bless!',
    },
  ],
  sfxCues: [
    {frame: 0, src: 'sfx/soft-whoosh.wav', name: 'Hook Whoosh'},
    {frame: 360, src: 'sfx/production-pop.wav', name: 'Stat Pop'},
    {frame: 900, src: 'sfx/soft-whoosh.wav', name: 'Comparison Whoosh'},
    {frame: 1500, src: 'sfx/production-tick.wav', name: 'Dose Tick'},
    {frame: 2100, src: 'sfx/production-chime.wav', name: 'CTA Chime'},
  ],
};

// ==========================================
// REMOTION COMPOSITION EXPORT
// ==========================================

export const UnifiedSplitComposition = () => (
  <Composition
    id="UnifiedSplitEditor"
    component={UnifiedSplitEditor}
    durationInFrames={2700} // 45 seconds @ 60fps
    fps={FPS_DEFAULT}
    width={CANVAS_WIDTH}
    height={CANVAS_HEIGHT}
    defaultProps={DEFAULT_SLOT_01_PROPS}
  />
);

export default UnifiedSplitEditor;
