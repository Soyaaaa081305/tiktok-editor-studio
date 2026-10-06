import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {getFfmpegPath} from './runtime-paths.mjs';
const ffmpeg = getFfmpegPath();

const project=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const output=path.join(project,'outputs');
const report=path.join(output,'ashwagandha-production-v2');
const work=path.join(project,'work-render/ashwagandha-v2');
const pub=path.join(project,'public/ashwagandha');
const edit=JSON.parse(fs.readFileSync(path.join(project,'src/ashwagandha/edit.json'),'utf8'));
const sound=JSON.parse(fs.readFileSync(path.join(project,'src/ashwagandha/sound-design.json'),'utf8'));
const fps=edit.fps, duration=edit.durationInFrames/fps;
const seconds=f=>(f/fps).toFixed(8);
fs.mkdirSync(work,{recursive:true});fs.mkdirSync(output,{recursive:true});fs.mkdirSync(report,{recursive:true});
const run=(args,capture=false)=>{
 const r=spawnSync(ffmpeg,['-hide_banner','-y',...args],{cwd:project,encoding:'utf8',stdio:capture?'pipe':'inherit',maxBuffer:16*1024*1024});
 if(r.error)throw r.error;if(r.status!==0)throw new Error(`Media processing failed: ${r.stderr||r.status}`);return r;
};
const parseStats=stderr=>{const m=stderr.match(/\{\s*"input_i"[\s\S]*?\}/);if(!m)throw new Error('Missing audio measurement');return JSON.parse(m[0]);};
const measure=file=>parseStats(run(['-i',file,'-af','loudnorm=I=-14.5:TP=-1.6:LRA=9:print_format=json','-f','null','-'],true).stderr);
const normalize=(input,target,i,tp)=>{
 const first=run(['-i',input,'-af',`loudnorm=I=${i}:TP=${tp}:LRA=9:print_format=json`,'-f','null','-'],true);
 const m=parseStats(first.stderr);
 const filter=`loudnorm=I=${i}:TP=${tp}:LRA=9:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true:print_format=json`;
 run(['-loglevel','error','-i',input,'-af',filter,'-ar','48000','-ac','2','-c:a',target.endsWith('.m4a')?'aac':'pcm_s24le',...(target.endsWith('.m4a')?['-b:a','256k']:[]),target]);
 return m;
};

const writeAmbient=()=>{
 const rate=48000,count=Math.round(duration*rate),buf=Buffer.alloc(44+count*4);
 buf.write('RIFF',0);buf.writeUInt32LE(buf.length-8,4);buf.write('WAVE',8);buf.write('fmt ',12);buf.writeUInt32LE(16,16);buf.writeUInt16LE(1,20);buf.writeUInt16LE(2,22);buf.writeUInt32LE(rate,24);buf.writeUInt32LE(rate*4,28);buf.writeUInt16LE(4,32);buf.writeUInt16LE(16,34);buf.write('data',36);buf.writeUInt32LE(count*4,40);
 const chords=[[220,261.626,329.628],[174.614,220,261.626],[164.814,196,261.626],[196,246.942,293.665]];
 for(let n=0;n<count;n++){
  const t=n/rate,idx=Math.floor(t/4.8)%4,age=t%4.8, chord=chords[idx];
  const fade=Math.min(1,t/.7,(duration-t)/1.2);const edge=Math.min(1,age/.14,(4.8-age)/.28);
  let l=0,r=0;
  for(let j=0;j<3;j++){
   const amp=.0075*edge*fade;
   l+=amp*(Math.sin(2*Math.PI*chord[j]*t)+.2*Math.sin(2*Math.PI*chord[j]*2*t));
   r+=amp*(Math.sin(2*Math.PI*(chord[j]+.10)*t)+.2*Math.sin(2*Math.PI*(chord[j]*2+.09)*t));
  }
  const arpAge=t%.6,note=chord[Math.floor(t/.6)%3]*2;
  const arp=.008*Math.min(1,arpAge/.005)*Math.exp(-arpAge/0.12)*fade*edge*Math.sin(2*Math.PI*note*t);
  l+=arp;r+=arp*.9;
  buf.writeInt16LE(Math.round(Math.max(-1,Math.min(1,l))*32767),44+n*4);buf.writeInt16LE(Math.round(Math.max(-1,Math.min(1,r))*32767),46+n*4);
 }
 fs.writeFileSync(path.join(pub,'original-ambient.wav'),buf);
};

const prepareAudio=()=>{
 const filters=[];const labels=[];
 for(const [i,clip]of edit.edl.entries()){
  const label=`v${i}`;const d=seconds(clip.durationInFrames);
  if(clip.sourceStartFrame===null)filters.push(`anullsrc=r=48000:cl=stereo,atrim=duration=${d},asetpts=PTS-STARTPTS[${label}]`);
  else filters.push(`[0:a]atrim=start=${seconds(clip.sourceStartFrame)}:duration=${d},asetpts=PTS-STARTPTS,afade=t=in:st=0:d=0.018,afade=t=out:st=${Math.max(0,clip.durationInFrames/fps-.025).toFixed(8)}:d=0.025[${label}]`);
  labels.push(`[${label}]`);
 }
 filters.push(`${labels.join('')}concat=n=${labels.length}:v=0:a=1,highpass=f=85,lowpass=f=14500,afftdn=nr=7:nf=-35,equalizer=f=320:t=q:w=1:g=-1.5,equalizer=f=2700:t=q:w=1:g=1.0,acompressor=threshold=0.125:ratio=2:attack=12:release=120:makeup=1[voice]`);
 const raw=path.join(work,'voice-cut.wav'),voice=path.join(pub,'voice.wav');
 run(['-loglevel','error','-i',path.join(pub,'source.mp4'),'-filter_complex',filters.join(';'),'-map','[voice]','-ar','48000','-ac','2','-c:a','pcm_s24le',raw]);
 const voiceBefore=normalize(raw,voice,-15,-2.4);
 writeAmbient();
 const names=[...new Set(sound.cues.map(c=>c.src))];
 const inputs=['-i',voice,'-i',path.join(pub,'original-ambient.wav')];
 for(const name of names){const p=path.join(project,'public',name);if(!fs.existsSync(p))throw new Error(`Missing sound ${name}`);inputs.push('-i',p);}
 const chains=['[0:a]aresample=48000,aformat=channel_layouts=stereo[voice]','[1:a]aresample=48000,volume=0.72[bed]'];
 const sfxLabels=[];
 for(const [i,cue]of sound.cues.entries()){
  if(cue.frame<0||cue.frame+cue.durationInFrames>edit.durationInFrames)throw new Error(`Invalid cue ${cue.id}`);
  const index=names.indexOf(cue.src)+2;
  chains.push(`[${index}:a]aresample=48000,aformat=channel_layouts=stereo,atrim=start=${seconds(cue.trimBefore??0)}:duration=${seconds(cue.durationInFrames)},asetpts=PTS-STARTPTS,volume=${cue.volume},adelay=${Math.round(cue.frame/fps*48000)}S:all=1[s${i}]`);
  sfxLabels.push(`[s${i}]`);
 }
 chains.push(`${sfxLabels.join('')}amix=inputs=${sfxLabels.length}:normalize=0:duration=longest,apad=whole_dur=${duration},atrim=duration=${duration},asplit=2[sfx][sfxproof]`);
 chains.push(`[voice][bed][sfx]amix=inputs=3:normalize=0:duration=first,alimiter=limit=0.79:level=false:latency=true,atrim=duration=${duration},asetpts=PTS-STARTPTS[mix]`);
 const mix=path.join(work,'mix-pre-master.wav');
 run(['-loglevel','error',...inputs,'-filter_complex',chains.join(';'),'-map','[mix]','-ar','48000','-ac','2','-c:a','pcm_s24le',mix,'-map','[sfxproof]','-ar','48000','-ac','2','-c:a','pcm_s24le',path.join(work,'sfx-stem.wav')]);
 // Leave encoding headroom beneath the -1.5 dBTP delivery ceiling.
 const mixBefore=normalize(mix,path.join(pub,'soundtrack.m4a'),-14.5,-1.8);
 const final=measure(path.join(pub,'soundtrack.m4a'));
 fs.writeFileSync(path.join(report,'audio-measurements.json'),JSON.stringify({voiceBefore,mixBefore,final,cues:sound.cues.length,originalAmbient:'Locally composed soft sine-pad / arpeggio; no reference soundtrack used.'},null,2));
 console.log(`Prepared the common Studio/export soundtrack: ${sound.cues.length} SFX cues. Integrated ${final.input_i} LUFS; true peak ${final.input_tp} dBTP.`);
};

if(!process.argv.includes('--skip-audio'))prepareAudio();
if(process.argv.includes('--audio-only'))process.exit(0);
const cli=path.join(project,'node_modules/@remotion/cli/remotion-cli.js');
const picture=path.join(work,'picture-v2.mp4');
const r=spawnSync(process.execPath,[cli,'render','AshwagandhaEditorialV2',picture,'--muted','--codec=h264','--crf=17','--pixel-format=yuv420p','--color-space=bt709',`--concurrency=${process.env.REMOTION_CONCURRENCY || 4}`,'--overwrite'],{cwd:project,stdio:'inherit'});
if(r.error)throw r.error;if(r.status!==0)throw new Error(`Render failed ${r.status}`);
const final=path.join(output,'ashwagandha-tiktok-editorial-v2.mp4');
run(['-loglevel','error','-i',picture,'-i',path.join(pub,'soundtrack.m4a'),'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','copy','-color_primaries','bt709','-color_trc','bt709','-colorspace','bt709','-movflags','+faststart',final]);
console.log(`Finished: ${final}`);
