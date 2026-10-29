import {inflateSync} from 'node:zlib';
import assert from 'node:assert/strict';
// Chromium screenshots: non-interlaced 8-bit RGB/RGBA PNG; fail closed for other formats.
export function decodePng(bytes){
 assert(bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),'PNG required');let width,height,bpp;const idat=[];
 for(let at=8;at<bytes.length;){const length=bytes.readUInt32BE(at),type=bytes.toString('ascii',at+4,at+8),data=bytes.subarray(at+8,at+8+length);if(type==='IHDR'){width=data.readUInt32BE(0);height=data.readUInt32BE(4);assert(data[8]===8&&[2,6].includes(data[9])&&data[12]===0,'unsupported PNG format');bpp=data[9]===6?4:3;}if(type==='IDAT')idat.push(data);at+=length+12;}
 assert(width&&height&&bpp);const packed=inflateSync(Buffer.concat(idat)),stride=width*bpp;assert.equal(packed.length,(stride+1)*height);const pixels=Buffer.alloc(stride*height);const paeth=(a,b,c)=>{const p=a+b-c,pa=Math.abs(p-a),pb=Math.abs(p-b),pc=Math.abs(p-c);return pa<=pb&&pa<=pc?a:pb<=pc?b:c;};
 for(let y=0;y<height;y++){const filter=packed[y*(stride+1)];assert(filter<=4);for(let x=0;x<stride;x++){const a=x>=bpp?pixels[y*stride+x-bpp]:0,b=y?pixels[(y-1)*stride+x]:0,c=y&&x>=bpp?pixels[(y-1)*stride+x-bpp]:0;pixels[y*stride+x]=(packed[y*(stride+1)+1+x]+[0,a,b,Math.floor((a+b)/2),paeth(a,b,c)][filter])&255;}}
 return {width,height,bpp,pixels};
}
export function comparePng(aBytes,bBytes,masks=[]){const a=decodePng(aBytes),b=decodePng(bBytes);assert(a.width===b.width&&a.height===b.height,'screenshot dimensions changed');let changed=0,checked=0,maxDelta=0;for(let y=0;y<a.height;y++)for(let x=0;x<a.width;x++){if(masks.some(r=>x>=r.x&&x<r.x+r.width&&y>=r.y&&y<r.y+r.height))continue;checked++;let delta=0;for(let c=0;c<3;c++)delta=Math.max(delta,Math.abs(a.pixels[(y*a.width+x)*a.bpp+c]-b.pixels[(y*b.width+x)*b.bpp+c]));if(delta>8)changed++;maxDelta=Math.max(delta,maxDelta);}return {changed,checked,ratio:changed/checked,maxDelta};}
