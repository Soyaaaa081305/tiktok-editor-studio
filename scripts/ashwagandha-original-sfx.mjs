import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

// Original, deterministic synthesis. No sampled audio is used in these four assets.
const project=path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir=path.join(project,'public/ashwagandha/sfx');
fs.mkdirSync(dir,{recursive:true});
const rate=48000;
function writeSound(name,duration,synth){
  const count=Math.round(rate*duration), samples=new Float64Array(count);
  let seed=711327, peak=0;
  const noise=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2147483648-1;};
  for(let n=0;n<count;n++){
    const t=n/rate, attack=Math.min(1,t/.002), tail=Math.min(1,(duration-t)/.008);
    const value=synth(t,noise)*attack*tail;
    samples[n]=value; peak=Math.max(peak,Math.abs(value));
  }
  const b=Buffer.alloc(44+count*4);
  b.write('RIFF',0);b.writeUInt32LE(b.length-8,4);b.write('WAVE',8);
  b.write('fmt ',12);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);
  b.writeUInt16LE(2,22);b.writeUInt32LE(rate,24);b.writeUInt32LE(rate*4,28);
  b.writeUInt16LE(4,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(count*4,40);
  const scale=10**(-4/20)/peak;
  for(let n=0;n<count;n++){const v=Math.round(samples[n]*scale*32767);b.writeInt16LE(v,44+n*4);b.writeInt16LE(v,46+n*4);}
  fs.writeFileSync(path.join(dir,`original-${name}.wav`),b);
}
writeSound('hit',.22,(t,noise)=>.72*Math.sin(2*Math.PI*(112*t-150*t*t))*Math.exp(-t/0.058)+.19*noise()*Math.exp(-t/0.014));
writeSound('pop',.055,(t)=>Math.sin(2*Math.PI*(820*t-4200*t*t))*Math.exp(-t/0.012));
writeSound('tick',.055,(t,noise)=>(.6*Math.sin(2*Math.PI*2800*t)+.2*noise())*Math.exp(-t/0.008));
writeSound('chime',.54,(t)=>[[0,1318.51,.8],[.08,1760,.64]].reduce((v,[start,hz,weight])=>{
  const a=t-start;
  return a<0?v:v+weight*Math.min(1,a/.005)*Math.exp(-a/.115)*(Math.sin(2*Math.PI*hz*a)+.16*Math.sin(4*Math.PI*hz*a));
},0));

const designFile=path.join(project,'src/ashwagandha/sound-design.json');
const design=JSON.parse(fs.readFileSync(designFile,'utf8'));
for(const cue of design.cues)cue.src=cue.src.replace('sfx/production-','ashwagandha/sfx/original-');
fs.writeFileSync(designFile,JSON.stringify(design,null,2)+'\n');
fs.writeFileSync(path.resolve(project,'../../outputs/ashwagandha-production/sound-cues.json'),JSON.stringify(design,null,2)+'\n');
const planFile=path.resolve(project,'../ashwagandha/build-plan.mjs');
fs.writeFileSync(planFile,fs.readFileSync(planFile,'utf8').replaceAll('sfx/production-','ashwagandha/sfx/original-'));
console.log('Four original SFX assets generated at -4 dBFS peak; previous ATC assets preserved.');
