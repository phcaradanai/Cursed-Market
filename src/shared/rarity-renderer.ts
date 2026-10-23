import { resolveAppearance } from './item-rarity.js';
import type { ItemAppearance } from './item-rarity.js';

const VERTEX=`attribute vec2 a;varying vec2 v;void main(){v=a*.5+.5;gl_Position=vec4(a,0.,1.);}`;
const FRAGMENT=`precision mediump float;
varying vec2 v;uniform sampler2D art;uniform float time,level,theme,strength,speed,phase,particles,cutout;
uniform vec2 resolution;uniform vec3 primary,accent;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){return .55*noise(p)+.28*noise(p*2.03)+.14*noise(p*4.01);}
vec3 spectrum(float x){return .55+.45*cos(6.28318*(x+vec3(0.,.33,.67)));}
void main(){
 vec2 uv=vec2(v.x,1.-v.y),p=uv-.5;p.x*=resolution.x/resolution.y;
 vec2 q=p/.9+.5;float bounds=step(0.,q.x)*step(q.x,1.)*step(0.,q.y)*step(q.y,1.);
 vec4 src=texture2D(art,q)*bounds;float y=dot(src.rgb,vec3(.299,.587,.114));
 float t=time*speed+phase,r=length(p),a=atan(p.y,p.x);
 float drift=fbm(q*9.+vec2(t*.18,-t*.3));
 vec3 tint=mix(primary,accent,.5+.5*sin(t*.3+q.y*4.));
 vec3 metal=vec3(y)*(tint*2.1+.3);float signature=0.;float aura=0.;
 if(theme<.5){float flame=fbm(vec2(p.x*16.,p.y*7.+t*.9));signature=pow(flame,4.)*3.;aura=pow(flame,3.)*exp(-abs(r-.3)*12.);}
 else if(theme<1.5){float facet=abs(sin(q.x*60.+sin(q.y*35.))*sin(q.y*55.));signature=pow(facet,14.)*(.5+.5*sin(t*.6+q.y*6.));metal+=accent*signature*.6;}
 else if(theme<2.5){float bolt=abs(p.x-.12*sin(p.y*35.+floor(t*1.5))-.04*sin(p.y*92.));signature=exp(-bolt*190.)*pow(.5+.5*sin(t*2.),6.);aura=signature*exp(-r*3.);}
 else if(theme<3.5){vec2 cell=fract(q*12.+vec2(0.,t*.08))-.5;signature=pow(max(0.,1.-abs(length(cell)-.27)*25.),3.);aura=signature*.12;}
 else if(theme<4.5){float ribbon=sin(p.y*13.+t*.6+sin(p.x*9.-t*.3)*2.);signature=pow(.5+.5*ribbon,9.)*drift;aura=signature*.35;}
 else if(theme<5.5){float crescent=max(0.,exp(-abs(r-.31)*65.)-exp(-length(p-vec2(.035,-.03))*12.));signature=drift*.2;aura=crescent;}
 else if(theme<6.5){float ray=pow(.5+.5*sin(a*14.+t*.13),10.);signature=ray*.3;aura=ray*exp(-abs(r-.27)*10.)*.4;}
 else if(theme<7.5){float swirl=fbm(vec2(a*2.+r*9.-t*.25,r*6.-t*.3));metal*=.55;signature=pow(swirl,4.)*2.;aura=pow(swirl,3.)*exp(-abs(r-.33)*10.);}
 else if(theme<8.5){tint=spectrum(q.x*.7+q.y*.8-t*.06);metal=vec3(y)*(.3+2.*tint);signature=drift*.3;aura=drift*.15;}
 else {float teeth=step(.6,sin(a*20.+t*.25));signature=pow(.5+.5*sin(q.x*36.+q.y*36.-t*.25),22.);aura=exp(-abs(r-(.32+.008*teeth))*130.)*.4;}
 float band=pow(max(0.,1.-abs(fract(q.x*.65+q.y*.45-t*.07)*2.-1.)),22.);
 vec3 col=mix(src.rgb,metal,theme<-.5?0.:.4+strength*.5);
 col+=(tint*signature*.65+tint*band*(.3+y))*strength;
 vec3 bg=vec3(.055,.046,.037)+exp(-length(p)*3.)*vec3(.025,.019,.013);
 // Aura follows real alpha when a cutout is supplied, not a guessed geometric mask.
 float soft=0.;if(cutout>.5){soft=(texture2D(art,q+vec2(.018,0.)).a+texture2D(art,q-vec2(.018,0.)).a+texture2D(art,q+vec2(0.,.018)).a+texture2D(art,q-vec2(0.,.018)).a)*.25;}
 if(level>.5){bg+=tint*(soft*.25+aura)*strength;}
 if(level>2.5){vec2 orbit=p;orbit.y*=1.6;float rr=length(orbit);float ring=exp(-abs(rr-.43)*240.);if(theme>8.5)ring*=.25+.75*step(.2,sin(a*18.+t*.3));bg+=mix(tint,accent,.5)*ring*strength*.8;
 if(level>3.5)bg+=accent*exp(-abs(rr-.47)*320.)*.25*strength;}
 if(level>4.5){float theta=t*.08;vec2 tilted=mat2(cos(theta),-sin(theta),sin(theta),cos(theta))*p;tilted.x*=1.7;
 float orbit3=exp(-abs(length(tilted)-.42)*210.);bg+=accent*orbit3*(.3+.7*pow(.5+.5*sin(a*5.-t*.8),5.));
 col+=accent*pow(noise(q*145.+phase),26.)*5.;}
 if(level<.5){col=src.rgb;}
 vec3 result=mix(bg,col,src.a);
 if(level>.5){for(int i=0;i<40;i++){float n=float(i);if(n>=particles)break;float h=hash(vec2(n,phase));vec2 pt=vec2(hash(vec2(n+phase,7.))-.5,fract(h+t*(.02+.02*h))-.5);pt.x+=.02*sin(t*.5+n);vec2 d=p-pt;float spark=exp(-dot(d,d)*(18000.+h*18000.));float pulse=.3+.7*pow(.5+.5*sin(t*(1.+h)+n),3.);result+=mix(primary,accent,h)*spark*pulse*strength;}}
 gl_FragColor=vec4(result*(1.-.25*smoothstep(.3,.8,length(p))),1.);
}`;

export interface RarityVisualOptions {
  imageUrl:string; appearance:ItemAppearance; cutout?:boolean;
  onReady?:()=>void; onError?:(error:unknown)=>void;
}
export interface RarityVisual { dispose:()=>void; setPaused:(paused:boolean)=>void; setAppearance:(appearance:ItemAppearance)=>void }
interface TextureEntry { refs:number; texture:WebGLTexture|null; loading:Promise<void> }
interface View {
  canvas:HTMLCanvasElement; context:CanvasRenderingContext2D; appearance:ItemAppearance;
  style:ReturnType<typeof resolveAppearance>; texture:TextureEntry; visible:boolean; paused:boolean;
  disposed:boolean; cutout:boolean; ready:boolean; onReady:(()=>void)|undefined;
  frameTime:number;
}
const views=new Set<View>(),textures=new Map<string,TextureEntry>();
let surface:HTMLCanvasElement|null=null,gl:WebGLRenderingContext|null=null,program:WebGLProgram|null=null;
let uniforms:Record<string,WebGLUniformLocation|null>={},scheduled=0,last=0,elapsed=0;
let motion:MediaQueryList|null=null;
function compile(context:WebGLRenderingContext,type:number,source:string){
  const shader=context.createShader(type)!;context.shaderSource(shader,source);context.compileShader(shader);
  if(!context.getShaderParameter(shader,context.COMPILE_STATUS)){const message=context.getShaderInfoLog(shader);context.deleteShader(shader);throw Error(message??'Shader compilation failed');}return shader;
}
function initialise(){
  if(gl)return;
  surface=document.createElement('canvas');const context=surface.getContext('webgl',{alpha:false,antialias:false,preserveDrawingBuffer:true});
  if(!context)throw Error('WebGL unavailable');
  const vertex=compile(context,context.VERTEX_SHADER,VERTEX),fragment=compile(context,context.FRAGMENT_SHADER,FRAGMENT),p=context.createProgram()!;
  context.attachShader(p,vertex);context.attachShader(p,fragment);context.linkProgram(p);context.deleteShader(vertex);context.deleteShader(fragment);
  if(!context.getProgramParameter(p,context.LINK_STATUS))throw Error(context.getProgramInfoLog(p)??'Shader linking failed');
  context.useProgram(p);const buffer=context.createBuffer();context.bindBuffer(context.ARRAY_BUFFER,buffer);context.bufferData(context.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),context.STATIC_DRAW);
  const a=context.getAttribLocation(p,'a');context.enableVertexAttribArray(a);context.vertexAttribPointer(a,2,context.FLOAT,false,0,0);
  uniforms=Object.fromEntries(['art','time','level','theme','strength','speed','phase','particles','cutout','resolution','primary','accent'].map(k=>[k,context.getUniformLocation(p,k)]));
  context.uniform1i(uniforms.art!,0);gl=context;program=p;
  motion=matchMedia('(prefers-reduced-motion: reduce)');motion.addEventListener('change',schedule);
  document.addEventListener('visibilitychange',schedule);
}
function acquire(url:string):TextureEntry {
  const cached=textures.get(url);if(cached){cached.refs++;return cached;}
  const entry:TextureEntry={refs:1,texture:null,loading:Promise.resolve()};
  entry.loading=new Promise<void>((resolve,reject)=>{const image=new Image();image.crossOrigin='anonymous';image.onload=()=>{
    if(entry.refs===0){resolve();return;}const context=gl!;const texture=context.createTexture();context.bindTexture(context.TEXTURE_2D,texture);
    context.texImage2D(context.TEXTURE_2D,0,context.RGBA,context.RGBA,context.UNSIGNED_BYTE,image);
    for(const [key,value] of [[context.TEXTURE_MIN_FILTER,context.LINEAR],[context.TEXTURE_MAG_FILTER,context.LINEAR],[context.TEXTURE_WRAP_S,context.CLAMP_TO_EDGE],[context.TEXTURE_WRAP_T,context.CLAMP_TO_EDGE]])context.texParameteri(context.TEXTURE_2D,key!,value!);
    entry.texture=texture;resolve();
  };image.onerror=()=>reject(Error(`Unable to load rarity texture: ${url}`));image.src=url;});textures.set(url,entry);return entry;
}
function schedule(){if(!scheduled&&views.size&&!document.hidden)scheduled=requestAnimationFrame(frame);}
function frame(now:number){
  scheduled=0;if(document.hidden)return;
  if(last&&now-last<32){schedule();return;}if(last)elapsed+=Math.min((now-last)/1000,.1);last=now;
  let moving=false;
  for(const view of views){
    if(!view.visible||!view.texture.texture||view.disposed)continue;
    const frozen=view.paused||!!motion?.matches||view.style.level===0;
    if(!frozen)moving=true;
    if(!frozen)view.frameTime=elapsed;
    draw(view,motion?.matches?0:view.frameTime);
  }
  if(moving)schedule();else last=0;
}
function draw(view:View,time:number){
  const context=gl!,canvas=surface!,style=view.style;
  if(context.isContextLost())return;
  const bounds=view.canvas.getBoundingClientRect(),ratio=Math.min(devicePixelRatio,1.5);
  const w=Math.min(768,Math.max(1,Math.round(bounds.width*ratio))),h=Math.min(768,Math.max(1,Math.round(bounds.height*ratio)));
  if(view.canvas.width!==w||view.canvas.height!==h){view.canvas.width=w;view.canvas.height=h;}
  if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}
  context.viewport(0,0,w,h);context.useProgram(program);context.activeTexture(context.TEXTURE0);context.bindTexture(context.TEXTURE_2D,view.texture.texture);
  for(const [k,v] of Object.entries({time,level:style.level,theme:style.themeIndex,strength:style.strength,speed:style.speed,phase:style.phase,particles:style.particleCount,cutout:view.cutout?1:0}))context.uniform1f(uniforms[k]!,v);
  context.uniform2f(uniforms.resolution!,w,h);context.uniform3fv(uniforms.primary!,style.primary);context.uniform3fv(uniforms.accent!,style.accent);context.drawArrays(context.TRIANGLES,0,6);
  view.context.drawImage(canvas,0,0,w,h);if(!view.ready){view.ready=true;view.onReady?.();}
}
/** One shared GPU renderer/texture cache for every visible item; host owns the canvas. */
export function createRarityVisual(canvas:HTMLCanvasElement,options:RarityVisualOptions):RarityVisual {
  initialise();const context=canvas.getContext('2d');if(!context)throw Error('Canvas unavailable');
  const texture=acquire(options.imageUrl);
  const view:View={canvas,context,texture,appearance:options.appearance,style:resolveAppearance(options.appearance),visible:false,paused:false,disposed:false,cutout:!!options.cutout,ready:false,onReady:options.onReady,frameTime:0};views.add(view);
  const observer=new IntersectionObserver(entries=>{view.visible=entries[0]!.isIntersecting;schedule();});observer.observe(canvas);
  const resize=new ResizeObserver(schedule);resize.observe(canvas);
  texture.loading.then(()=>{if(!view.disposed)schedule();}).catch(error=>{if(!view.disposed)options.onError?.(error);});
  return {setPaused(paused){view.paused=paused;schedule();},setAppearance(appearance){view.appearance=appearance;view.style=resolveAppearance(appearance);schedule();},
    dispose(){if(view.disposed)return;view.disposed=true;views.delete(view);observer.disconnect();resize.disconnect();
      if(--texture.refs===0){gl?.deleteTexture(texture.texture);textures.delete(options.imageUrl);}if(!views.size){cancelAnimationFrame(scheduled);scheduled=0;last=0;}}
  };
}
