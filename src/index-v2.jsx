import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {
  UnifiedSplitEditor,
  DEFAULT_SLOT_01_PROPS,
} from './UnifiedSplitEditor.jsx';

const RemotionRoot = () => (
  <>
    <Composition
      id="UnifiedSplitEditor"
      component={UnifiedSplitEditor}
      durationInFrames={2700}
      fps={60}
      width={1080}
      height={1920}
      defaultProps={DEFAULT_SLOT_01_PROPS}
    />
  </>
);

registerRoot(RemotionRoot);
