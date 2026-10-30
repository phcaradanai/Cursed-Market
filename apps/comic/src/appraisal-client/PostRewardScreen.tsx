import type {ReactNode} from 'react';
import type {Actions} from './components.js';
import {ComicPhaseFrame} from './ComicUI.js';
import {VaultPanel} from './SecureEconomy.js';
import {BagIcon} from './icons.js';
import {pick} from './i18n.js';

export function PostRewardScreen({game,submit,disabled,completion}:Actions&{completion:ReactNode}) {
 const reward=game.self.roundReward;
 const available=game.secureEconomy&&game.self.paused!=='dead'&&game.self.life!==0;
 return <ComicPhaseFrame className="post-reward-screen" title={pick('จัดของก่อนเดินทางต่อ','Prepare for the next encounter')} icon={<BagIcon/>}
  tools={<span className="vault-receipt">{reward?.amount?pick(`รับแล้ว ${reward.amount} เครดิต`,`Collected ${reward.amount} credits`):pick('รางวัลช่วงนี้ 0 เครดิต','Encounter reward: 0 credits')}</span>}
  footer={<><span>{pick('จัดของเสร็จแล้ว ยืนยันเพื่อไปช่วงถัดไป','Finish managing your belongings, then confirm to continue')}</span>{completion}</>}>
  {available?<VaultPanel game={game} submit={submit} disabled={disabled}/>:<div className="vault-unavailable"><BagIcon/><h3>{pick('พร้อมสำหรับช่วงถัดไป','Ready for the next encounter')}</h3><p>{game.secureEconomy?pick('ผู้ชมใช้งานคลังไม่ได้','Spectators cannot use the vault'):pick('ห้องนี้ไม่เปิดบริการคลังนิรภัย','Vault services are disabled in this room')}</p></div>}
 </ComicPhaseFrame>;
}
