// Acceptance fixture only: first seat starts dead, room clocks off; every subsequent action uses the actual server.
// Optional local oracle snapshot is never served over HTTP or bundled into the client.
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {createApp} from '../../apps/comic/dist/src/server/app.js';
import {AppraisalRoomService} from '../../apps/comic/dist/src/server/appraisal-rooms.js';
import {createAppraisalRun} from '../../apps/comic/dist/src/game/appraisal/engine.js';
class GhostAcceptanceRooms extends AppraisalRoomService {
 createGame(ids,seed,room){room.timing={enabled:false,durationsMs:{PORTALS:30000,APPRAISAL:60000,TRADE:60000,REVEAL:30000}};const s=createAppraisalRun(ids,seed,{survival:{maxLife:6,encounterLifeCost:1,entryEnergyCost:0},startingCredits:200,marketProbability:0});Object.assign(s.players[0],{life:0,paused:'dead',done:true,eventOffer:null});return s;}
 broadcast(room){super.broadcast(room);if(room.game){const g=room.game;fs.writeFileSync('/tmp/cursed-market-ghost-live-state.json',JSON.stringify({seed:g.seed,revision:g.revision,encounter:g.encounter,phase:g.phase,ghosts:g.ghosts,players:g.players.map(p=>({id:p.id,credits:p.credits,life:p.life,inventory:p.inventory}))}));}}
}
const app=createApp({rooms:new GhostAcceptanceRooms(),webRoot:fileURLToPath(new URL('../../apps/comic/dist/appraisal-client',import.meta.url))});
app.server.listen(3188,()=>console.log('Acceptance fixture3188: first seat dead, clocks off, real network/actions; local test oracle /tmp/cursed-market-ghost-live-state.json'));
