// Local supported-config fixture for UI-to-server proof, never a production balance preset.
import {fileURLToPath} from 'node:url';
import {createApp} from '../dist/src/server/app.js';
import {AppraisalRoomService} from '../dist/src/server/appraisal-rooms.js';
import {createAppraisalRun} from '../dist/src/game/appraisal/engine.js';
const config={catalogVersion:4,collectorWishlistRules:1,startingCredits:500,core2:true,secureEconomy:true,survival:{maxLife:20,encounterLifeCost:1,entryEnergyCost:0},collectorDeadline:5,marketProbability:0,wishlist:false,npcEvents:false,polish:false};
class Rooms extends AppraisalRoomService {createGame(ids){return createAppraisalRun(ids,'collector-ui-live-v1',config);}}
const port=Number(process.env.PORT??3198);if(!Number.isSafeInteger(port)||port<1||port>65535)throw Error('Invalid fixture port');
const rooms=new Rooms(Date.now,{PORTALS:900000,APPRAISAL:900000,TRADE:900000,REVEAL:900000},600000,config);
const app=createApp({rooms,webRoot:fileURLToPath(new URL('../dist/appraisal-client',import.meta.url))});
app.server.listen(port,'127.0.0.1',()=>console.log(`Collector UI fixture http://127.0.0.1:${port} (500 credits,20 life,deadline5,15-minute phase clocks)`));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>{void app.close().then(()=>process.exit(0));});
