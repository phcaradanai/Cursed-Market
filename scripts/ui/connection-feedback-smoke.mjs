import assert from 'node:assert/strict';
export async function checkConnectionFeedback(page){
 const geometry=await page.evaluate(()=>{const root=document.documentElement,main=document.querySelector('#game-main'),notices=[...document.querySelectorAll('.connection-feedback > *')].map(e=>{const b=e.getBoundingClientRect();return {role:e.getAttribute('role'),box:[b.x,b.y,b.width,b.height],dismissable:!!e.querySelector('button')};});return {viewport:[innerWidth,innerHeight],page:[root.scrollWidth,root.scrollHeight],mainY:main.getBoundingClientRect().y,notices};});
 assert(geometry.notices.length,'actual server/network notice required');assert.equal(geometry.mainY,0,'feedback must not shift the game');assert.deepEqual(geometry.page,geometry.viewport,'feedback must not create page scroll');
 for(const [i,n]of geometry.notices.entries()){assert(['alert','status'].includes(n.role));assert(n.box[0]>=0&&n.box[1]>=0&&n.box[0]+n.box[2]<=geometry.viewport[0]&&n.box[1]+n.box[3]<=geometry.viewport[1],'notice must fit viewport');if(i)assert(n.box[1]>=geometry.notices[i-1].box[1]+geometry.notices[i-1].box[3]+12,'notices must stack with shared gap');if(n.role==='alert')assert(n.dismissable,'server error remains dismissable');}
 return geometry;
}
