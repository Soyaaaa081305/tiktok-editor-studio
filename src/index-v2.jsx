import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {
  UnifiedSplitEditor,
  DEFAULT_SLOT_01_PROPS,
} from './UnifiedSplitEditor.jsx';
import sleepEditData from './sleep-edit-data.json';

const RemotionRoot = () => (
  <>
    {/* Production Edit: Ashwagandha + Magnesium Sleep Video */}
    <Composition
      id="AshwagandhaSleepSplit"
      component={UnifiedSplitEditor}
      durationInFrames={sleepEditData.totalFrames}
      fps={sleepEditData.fps}
      width={1080}
      height={1920}
      defaultProps={sleepEditData}
    />
    {/* Default Parameterized Engine Preview */}
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
