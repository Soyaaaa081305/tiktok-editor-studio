import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {path as ffprobe} from 'ffprobe-static';
import {getFfmpegPath} from './runtime-paths.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const ffmpeg=getFfmpegPath(),node=process.execPath;
const run=(command,args,cwd=root,capture=false)=>{
 const r=spawnSync(command,args,{cwd,encoding:'utf8',stdio:capture?'pipe':'inherit',windowsHide:true,maxBuffer:32*1024*1024});
 if(r.error)throw r.error;
 if(r.status!==0)throw new Error(`${path.basename(command)} failed (${r.status}): ${r.stderr||''}`);
 return r;
};
run(node,['scripts/prepare-ashwagandha-v4.mjs']);
const edit=JSON.parse(fs.readFileSync(path.join(root,'src/ashwagandha/edit-gapless-v4.json'),'utf8'));
const sound=JSON.parse(fs.readFileSync(path.join(root,'src/ashwagandha/sound-design-gapless-v4.json'),'utf8'));
const job=path.join(root,'jobs/ashwagandha-gapless-v4'),work=path.join(root,'work-render/ashwagandha-gapless-v4');
fs.mkdirSync(job,{recursive:true});fs.mkdirSync(work,{recursive:true});
const secs=f=>(f/edit.fps).toFixed(8),rate=48000;
const source=path.join(root,'public/ashwagandha/source.mp4');
if(!fs.existsSync(source))throw new Error('Ashwagandha source recording is not restored.');

const audioGraph=[],audioLabels=[];
for(const [i,c] of edit.edl.entries()){
 const label=`v${i}`,dur=secs(c.durationInFrames);
 if(c.sourceStartFrame===null){
  audioGraph.push(`anullsrc=r=${rate}:cl=stereo,atrim=duration=${dur},asetpts=PTS-STARTPTS[${label}]`);
 }else{
  if(c.sourceEndFrame-c.sourceStartFrame!==c.durationInFrames)throw new Error(`Source audio duration mismatch: ${c.id}`);
  audioGraph.push(`[0:a]atrim=start=${secs(c.sourceStartFrame)}:duration=${dur},asetpts=PTS-STARTPTS,afade=t=in:st=0:d=0.018,afade=t=out:st=${Math.max(0,c.durationInFrames/edit.fps-.025).toFixed(8)}:d=0.025[${label}]`);
 }
 audioLabels.push(`[${label}]`);
}
const joined=path.join(work,'voice-cut-unprocessed.wav');
const concat=`${audioLabels.join('')}concat=n=${audioLabels.length}:v=0:a=1,highpass=f=85,lowpass=f=14500,afftdn=nr=7:nf=-35,equalizer=f=320:t=q:w=1:g=-1.5,equalizer=f=2700:t=q:w=1:g=1.0,acompressor=threshold=0.125:ratio=2:attack=12:release=120:makeup=1[voice]`;
run(ffmpeg,['-hide_banner','-loglevel','error','-y','-i',source,'-filter_complex',`${audioGraph.join(';')};${concat}`,'-map','[voice]','-ar',String(rate),'-ac','2','-c:a','pcm_s24le',joined]);
const voice=path.join(work,'voice-normalized.wav');
const probe=run(ffmpeg,['-hide_banner','-i',joined,'-af','loudnorm=I=-15:TP=-2.4:LRA=9:print_format=json','-f','null','-'],root,true);
const parseLoudness=s=>{const m=s.match(/\{\s*"input_i"[\s\S]*?\}/);if(!m)throw new Error('FFmpeg did not report loudness.');return JSON.parse(m[0]);};
const stats=parseLoudness(probe.stderr);
const voiceFilter=`loudnorm=I=-15:TP=-2.4:LRA=9:measured_I=${stats.input_i}:measured_TP=${stats.input_tp}:measured_LRA=${stats.input_lra}:measured_thresh=${stats.input_thresh}:offset=${stats.target_offset}:linear=true:print_format=json`;
run(ffmpeg,['-hide_banner','-loglevel','error','-y','-i',joined,'-af',voiceFilter,'-ar',String(rate),'-ac','2','-c:a','pcm_s24le',voice]);

const sources=[...new Set(sound.cues.map(c=>c.src))],inputs=['-i',voice];
for(const name of sources){const p=path.join(root,'public',name);if(!fs.existsSync(p))throw new Error(`Missing selected SFX: ${name}`);inputs.push('-i',p);}
const mixGraph=['[0:a]aresample=48000,aformat=channel_layouts=stereo[voice]'],cueLabels=[];
for(const [i,c] of sound.cues.entries()){
 const srcIndex=sources.indexOf(c.src)+1,dur=secs(c.durationInFrames),delay=Math.round(c.frame*rate/edit.fps);
 mixGraph.push(`[${srcIndex}:a]aresample=48000,aformat=channel_layouts=stereo,atrim=start=${secs(c.trimBefore??0)}:duration=${dur},asetpts=PTS-STARTPTS,apad=whole_dur=${dur},atrim=duration=${dur},volume=${c.volume},afade=t=in:st=0:d=0.02,afade=t=out:st=${Math.max(0,c.durationInFrames/edit.fps-.05).toFixed(8)}:d=0.05,adelay=${delay}S:all=1[s${i}]`);
 cueLabels.push(`[s${i}]`);
}
const duration=edit.durationInFrames/edit.fps;
mixGraph.push(`${cueLabels.join('')}amix=inputs=${cueLabels.length}:normalize=0:duration=longest,apad=whole_dur=${duration},atrim=duration=${duration},asplit=2[sfxForMix][sfxReview]`);
mixGraph.push(`[voice][sfxForMix]amix=inputs=2:normalize=0:duration=first,alimiter=limit=0.92:level=false:latency=true,atrim=duration=${duration},asetpts=PTS-STARTPTS[mix]`);
const preMaster=path.join(work,'mix-pre-master.wav'),sfxStem=path.join(job,'sfx-stem.wav');
run(ffmpeg,['-hide_banner','-loglevel','error','-y',...inputs,'-filter_complex',mixGraph.join(';'),'-map','[mix]','-ar',String(rate),'-ac','2','-c:a','pcm_s24le',preMaster,'-map','[sfxReview]','-ar',String(rate),'-ac','2','-c:a','pcm_s24le',sfxStem]);
const master=path.join(job,'soundtrack-gapless-v4.m4a');
const finalStats=parseLoudness(run(ffmpeg,['-hide_banner','-i',preMaster,'-af','loudnorm=I=-14.5:TP=-1.8:LRA=9:print_format=json','-f','null','-'],root,true).stderr);
const mastering=`loudnorm=I=-14.5:TP=-1.8:LRA=9:measured_I=${finalStats.input_i}:measured_TP=${finalStats.input_tp}:measured_LRA=${finalStats.input_lra}:measured_thresh=${finalStats.input_thresh}:offset=${finalStats.target_offset}:linear=true:print_format=json`;
run(ffmpeg,['-hide_banner','-loglevel','error','-y','-i',preMaster,'-af',mastering,'-ar',String(rate),'-ac','2','-c:a','aac','-b:a','256k','-movflags','+faststart',master]);
const masterMeasure=parseLoudness(run(ffmpeg,['-hide_banner','-i',master,'-af','loudnorm=I=-14.5:TP=-1.8:LRA=9:print_format=json','-f','null','-'],root,true).stderr);
const silence=run(ffmpeg,['-hide_banner','-i',voice,'-af','silencedetect=noise=-42dB:d=0.35','-f','null','-'],root,true).stderr;
const silenceEvents=[...silence.matchAll(/silence_(start|end):\s*([\d.]+)/g)].map(m=>({type:m[1],seconds:Number(m[2])}));
const silenceRanges=[];let silenceStart=null;
for(const event of silenceEvents){if(event.type==='start')silenceStart=event.seconds;else if(silenceStart!==null){silenceRanges.push({startSeconds:silenceStart,endSeconds:event.seconds,durationSeconds:Number((event.seconds-silenceStart).toFixed(4))});silenceStart=null;}}
const silenceAudit={status:silenceRanges.length?'REVIEW_REQUIRED':'NO_UNPLANNED_GAP_OVER_0.35S_DETECTED',detector:{thresholdDb:-42,minimumDurationSeconds:0.35},checkedTrack:'rendered normalized original dialogue before SFX',authoredSilence:[{startSeconds:0,endSeconds:edit.posterFrames/edit.fps,reason:'intentional genuine cover'}],detectedRanges:silenceRanges,knownTrimmedSourcePause:{sourceStartSeconds:3668/edit.fps,sourceEndSeconds:3716/edit.fps,measuredSilenceSeconds:0.811646,action:'trimmed before the personal-experience line'},subjectiveListening:'UNVERIFIED: the current environment cannot audition local audio to the model'};
fs.copyFileSync(master,path.join(root,'public/ashwagandha/soundtrack-gapless-v4.m4a'));
fs.writeFileSync(path.join(job,'audio-measurements.json'),JSON.stringify({durationSeconds:duration,voice,master,voiceBeforeMaster:stats,deliveredFile:masterMeasure,insertedSilenceFrames:0,coverSilentFrames:edit.posterFrames,silenceDetectThreshold:'-42dB / 0.35s (natural speech breaths may register)',silenceEvents,sfxCueCount:sound.cues.length,music:false},null,2)+'\n');
fs.writeFileSync(path.join(job,'silence-audit.json'),JSON.stringify(silenceAudit,null,2)+'\n');
console.log(`Prepared ${sound.cues.length} mixed SFX events and a continuous voice track. Final AAC integrated ${masterMeasure.input_i} LUFS; true peak ${masterMeasure.input_tp} dBTP.`);

if(process.argv.includes('--audio-only'))process.exit(0);
const cli=path.join(root,'node_modules/@remotion/cli/remotion-cli.js');
const silent4k=path.join(work,'ashwagandha-v4-4k-silent.mp4'),durationArg=secs(edit.durationInFrames);
run(node,[cli,'render','AshwagandhaEditorialGaplessV4',silent4k,'--muted','--codec=h264','--crf=16','--x264-preset=medium','--pixel-format=yuv420p','--color-space=bt709','--scale=2','--concurrency=4','--overwrite']);
const masterVideo=path.join(job,'ashwagandha-tiktok-v4-4k-master.mp4');
run(ffmpeg,['-hide_banner','-loglevel','error','-y','-i',silent4k,'-i',master,'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','copy','-t',durationArg,'-color_primaries','bt709','-color_trc','bt709','-colorspace','bt709','-movflags','+faststart',masterVideo]);
const upload=path.join(job,'ashwagandha-tiktok-v4-1080p-upload.mp4');
run(ffmpeg,['-hide_banner','-loglevel','error','-y','-i',masterVideo,'-vf','scale=1080:1920:flags=lanczos','-c:v','libx264','-preset','medium','-crf','17','-maxrate','20M','-bufsize','40M','-pix_fmt','yuv420p','-color_primaries','bt709','-color_trc','bt709','-colorspace','bt709','-r','60','-fps_mode','cfr','-c:a','aac','-b:a','256k','-ar',String(rate),'-movflags','+faststart',upload]);
for(const p of [masterVideo,upload]){
 run(ffmpeg,['-hide_banner','-v','error','-i',p,'-f','null','-']);
 const meta=run(ffprobe,['-v','error','-select_streams','v:0','-show_entries','stream=codec_name,width,height,r_frame_rate,pix_fmt,color_space,color_transfer,color_primaries','-show_entries','format=duration,size','-of','json',p],root,true);
 const out=JSON.parse(meta.stdout);if(out.streams[0]?.codec_name!=='h264')throw new Error(`Unexpected video codec in ${p}`);
 if(out.streams[0]?.pix_fmt!=='yuv420p')throw new Error(`Unexpected pixel format in ${p}`);
 if(out.streams[0]?.r_frame_rate!=='60/1')throw new Error(`Unexpected frame rate in ${p}`);
 if(Number(out.format.duration)<duration-.05||Number(out.format.duration)>duration+.15)throw new Error(`Video/audio duration mismatch in ${p}: ${out.format.duration}`);
 fs.writeFileSync(p+'.metadata.json',JSON.stringify(out,null,2)+'\n');
}
const cover=path.join(job,'ashwagandha-tiktok-v4-cover.png');
run(ffmpeg,['-hide_banner','-loglevel','error','-y','-i',masterVideo,'-frames:v','1','-update','1',cover]);
console.log(`Reviewed decodability/format. 4K60 master and 1080p60 TikTok upload are in ${job}.`);
