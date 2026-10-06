import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const job = path.dirname(fileURLToPath(import.meta.url));
const edit = JSON.parse(fs.readFileSync(path.join(job, 'edit-data.json'), 'utf8'));
const fps = edit.fps;
const ms = (seconds) => Math.round(seconds * 1000);
const timestamp = (milliseconds) => {
  const hours = Math.floor(milliseconds / 3_600_000);
  const minutes = Math.floor((milliseconds % 3_600_000) / 60_000);
  const seconds = Math.floor((milliseconds % 60_000) / 1000);
  const millis = milliseconds % 1000;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')},${String(millis).padStart(3, '0')}`;
};

const cues = edit.captions.map((caption) => {
  const segment = edit.segments.find((item) => {
    const sourceIn = item.sourceStartFrame / fps;
    const sourceOut = item.sourceEndFrame / fps;
    return caption.startSeconds >= sourceIn && caption.endSeconds <= sourceOut;
  });
  if (!segment) throw new Error(`Caption does not fit inside one retained source segment: ${caption.text}`);
  const outputIn = segment.outputStartFrame / fps + caption.startSeconds - segment.sourceStartFrame / fps;
  const outputOut = segment.outputStartFrame / fps + caption.endSeconds - segment.sourceStartFrame / fps;
  return {start: ms(outputIn), end: ms(outputOut), text: caption.text};
});

for (let index = 0; index < cues.length; index++) {
  if (cues[index].end <= cues[index].start) throw new Error(`Caption ${index + 1} has no display duration.`);
  if (index && cues[index].start < cues[index - 1].end) throw new Error(`Caption ${index + 1} overlaps the previous subtitle.`);
}

const srt = cues.map((cue, index) => `${index + 1}\n${timestamp(cue.start)} --> ${timestamp(cue.end)}\n${cue.text}`).join('\n\n') + '\n';
const output = path.join(job, 'somatotypes-v2-captions.srt');
fs.writeFileSync(output, srt, 'utf8');
console.log(`Wrote ${cues.length} captions mapped to the edited timeline: ${path.basename(output)}`);
