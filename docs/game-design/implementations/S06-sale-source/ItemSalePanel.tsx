import {FactSeals,Share,type Actions} from './components.js';
import type {ItemView} from '../game/appraisal/types.js';
import {npcName} from './catalog-text.js';
import {CoinIcon} from './icons.js';
import {t} from './i18n.js';
/** The same known facts and Share rules, presented as a comic spread. */
export function ItemSalePanel({game,item,submit,disabled}:Actions&{item:ItemView}) {
 return <div className="item-sale-panel"><section className="item-sale-visual" aria-label={t('ข้อมูลสินค้าที่รู้แล้ว')}><div className="item-sale-art"><img src={item.image} alt=""/></div><FactSeals item={item}/><div className="item-sale-origin"><span>{t('จาก')} <strong>{npcName(item.npc)}</strong></span>{item.owner.startsWith('npc:')&&<span><CoinIcon/>{t('ราคาพ่อค้า')} <strong>{item.price}</strong> {t('เครดิต')}</span>}</div></section><Share key={item.id} game={game} item={item} submit={submit} disabled={disabled} comic/></div>;
}
