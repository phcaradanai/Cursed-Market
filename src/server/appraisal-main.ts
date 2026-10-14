import { createApp } from './app.js';
import { AppraisalRoomService } from './appraisal-rooms.js';
import { SURVIVAL_RULES } from '../game/appraisal/index.js';

const port=Number(process.env.PORT??3103);
if(!Number.isSafeInteger(port) || port<0 || port>65535) throw new Error('PORT must be 0–65535');
const host=process.env.HOST??'0.0.0.0';
const survival=process.env.APPRAISAL_RULES==='survival';
const app=createApp({rooms:new AppraisalRoomService(Date.now,{},undefined,survival?{survival:SURVIVAL_RULES}:{}),webRoot:'dist/appraisal-client'});
app.server.listen(port,host,()=>console.log(`Cursed Market v${survival?'0.5':'0.4'}: http://localhost:${port} (bind ${host})`));
for(const signal of ['SIGINT','SIGTERM'] as const) process.on(signal,()=>{void app.close().then(()=>process.exit(0));});
