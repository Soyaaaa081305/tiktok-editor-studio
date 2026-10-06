import {Composition, registerRoot} from 'remotion';
import {SomatotypesEditorialV1} from './SomatotypesEditorial.jsx';
import edit from '../jobs/somatotypes-v1/edit-data.json';

const Root = () => (
  <Composition
    id="SomatotypesEditorialV1"
    component={SomatotypesEditorialV1}
    durationInFrames={edit.durationInFrames}
    fps={edit.fps}
    width={edit.width}
    height={edit.height}
  />
);

registerRoot(Root);
