import {Composition, registerRoot} from 'remotion';
import {SomatotypesEditorialV2} from './SomatotypesEditorialV2.jsx';
import edit from '../jobs/somatotypes-v2/edit-data.json';

const Root = () => (
  <Composition
    id="SomatotypesEditorialV2"
    component={SomatotypesEditorialV2}
    durationInFrames={edit.durationInFrames}
    fps={edit.fps}
    width={edit.width}
    height={edit.height}
  />
);

registerRoot(Root);
