// QA server: production room/parser/clocks/config; only deterministic seed and seat identities.
import fs from 'node:fs';import {fileURLToPath} from 'node:url';
import {createApp} from '../dist/src/server/app.js';import {AppraisalRoomService} from '../dist/src/server/appraisal-rooms.js';import {createAppraisalRun} from '../dist/src/game/appraisal/engine.js';
const config=JSON.parse(fs.readFileSync(fileURLToPath(new URL('../../../docs/validation/collector-normal-2026-11-02/live-ui-audit.json',import.meta.url)))).run.config;
config.personalScoringRules=1;
if(config.startingCredits!==40||config.survival.maxLife!==6||config.catalogVersion!==4||config.collectorDeadline!==15)throw Error('Normal main configuration required');
class Rooms extends AppraisalRoomService {
 newSeat(name){if(!['Service Ghost','Service Buyer'].includes(name))throw Error('QA names only');return {...super.newSeat(name),id:name==='Service Ghost'?'spirit':'buyer'};}
 createGame(ids){return createAppraisalRun(ids,'normal-service-2',config);}
}
const app=createApp({rooms:new Rooms(Date.now,{},undefined,config),webRoot:fileURLToPath(new URL('../dist/appraisal-client',import.meta.url))});
app.server.listen(0,'127.0.0.1',()=>console.log(`Normal service QA http://127.0.0.1:${app.server.address().port} (40/6, normal clocks; deterministic seat ids/seed only)`));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>{void app.close().then(()=>process.exit(0));});
