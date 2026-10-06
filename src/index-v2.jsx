import {Composition, registerRoot} from 'remotion';
import editData from './edit-data-v2.json';
import {ATCFishOilEditV2} from './ATCFishOilV2.jsx';
import {ATCFishOilEditV3} from './ATCFishOilV3.jsx';
import {ATCFishOilEditV4} from './ATCFishOilV4.jsx';
import {AshwagandhaEditorial} from './ashwagandha/AshwagandhaEditorial.jsx';
import {AshwagandhaCleanEdit, AshwagandhaGaplessEditV4, CleanPoster, CleanMineral} from './ashwagandha/editorial-clean.jsx';

const RemotionRoot = () => (
  <>
    <Composition id="AshwagandhaEditorialV2" component={AshwagandhaEditorial} durationInFrames={1454} fps={60} width={1080} height={1920}/>
    <Composition id="AshwagandhaEditorial" component={AshwagandhaCleanEdit} durationInFrames={2014} fps={60} width={1080} height={1920}/>
    <Composition id="AshwagandhaEditorialGaplessV4" component={AshwagandhaGaplessEditV4} durationInFrames={1615} fps={60} width={1080} height={1920}/>
    <Composition id="AshwagandhaCover" component={CleanPoster} durationInFrames={6} fps={60} width={1080} height={1920}/>
    <Composition id="AshwagandhaMineralExplainer" component={CleanMineral} durationInFrames={230} fps={60} width={1080} height={1920}/>
    <Composition
      id="ATCFishOilV2"
      component={ATCFishOilEditV2}
      durationInFrames={editData.durationInFrames}
      fps={editData.fps}
      width={1080}
      height={1920}
    />
    <Composition
      id="ATCFishOilV3"
      component={ATCFishOilEditV3}
      durationInFrames={editData.durationInFrames}
      fps={editData.fps}
      width={1080}
      height={1920}
    />
    <Composition
      id="ATCFishOilV4"
      component={ATCFishOilEditV4}
      durationInFrames={2899}
      fps={60}
      width={1080}
      height={1920}
    />
  </>
);

registerRoot(RemotionRoot);
