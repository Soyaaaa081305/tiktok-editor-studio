import {Config} from '@remotion/cli/config';

// Make the current, motion-graphics-focused edit the default for Studio and CLI.
Config.setEntryPoint('./src/index-v2.jsx');
Config.setStudioPort(3000);
Config.setDefaultCodingAgent('codex');

// First-party Remotion Elements are built into Studio. These are additional
// third-party libraries exposed in Browse Elements for on-demand use.
Config.addElementLibrary({
  url: 'https://remocn.dev/docs/components',
  displayName: 'Remocn',
});
