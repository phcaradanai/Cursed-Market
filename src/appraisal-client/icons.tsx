import type { ReactNode } from 'react';

// One authored icon family: 24px grid, 1.6 stroke, round joins. Icons are always decorative; adjacent text names the meaning.
function Icon({children,className=''}:{children:ReactNode;className?:string}) {
  return <svg className={`icon ${className}`} viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{children}</svg>;
}
export const CoinIcon=()=> <Icon className="icon-coin"><ellipse cx="12" cy="12" rx="8.5" ry="8.5"/><ellipse cx="12" cy="12" rx="5.6" ry="5.6"/><path d="M12 8.6v6.8M10.2 10.2h3.6"/></Icon>;
export const EnergyIcon=()=> <Icon className="icon-energy"><circle cx="12" cy="12" r="8.5"/><path d="M13 6.5 9.5 12.6h3.4L11 17.5"/></Icon>;
export const LifeIcon=()=> <Icon className="icon-life"><path d="M12 19.5s-7-4.3-7-9.6A3.9 3.9 0 0 1 12 7.7a3.9 3.9 0 0 1 7 2.2c0 5.3-7 9.6-7 9.6Z"/></Icon>;
export const ScoreIcon=()=> <Icon className="icon-score"><path d="M4.5 17.5h15M5.5 17.5 4 8l4.5 3.5L12 5.5l3.5 6L20 8l-1.5 9.5"/></Icon>;
export const TimerIcon=()=> <Icon><path d="M7 3.5h10M7 20.5h10M8 3.5c0 4.2 8 4.6 8 8.5s-8 4.3-8 8.5M16 3.5c0 4.2-8 4.6-8 8.5"/></Icon>;
export const InspectIcon=()=> <Icon><circle cx="10.5" cy="10.5" r="5.5"/><path d="m15 15 4.5 4.5"/></Icon>;
export const AppraiseIcon=()=> <Icon><path d="M12 4v15.5M7.5 19.5h9M5 7.5h14M5 7.5 2.8 13a2.4 2.4 0 0 0 4.4 0L5 7.5ZM19 7.5 16.8 13a2.4 2.4 0 0 0 4.4 0L19 7.5Z"/></Icon>;
export const BuyIcon=()=> <Icon><path d="M6 8.5h12l-1 11H7l-1-11Z"/><path d="M9.2 8.5V7a2.8 2.8 0 0 1 5.6 0v1.5"/></Icon>;
export const PortalIcon=()=> <Icon><path d="M6.5 20.5V10a5.5 5.5 0 0 1 11 0v10.5M4 20.5h16"/><path d="M12 9.5v4"/></Icon>;
export const PassIcon=()=> <Icon><path d="M5 12h12.5M13.5 7.5 18 12l-4.5 4.5"/></Icon>;
export const BuffIcon=()=> <Icon className="icon-buff"><circle cx="12" cy="12" r="8.5"/><path d="m8.5 13 3.5-3.5 3.5 3.5"/></Icon>;
export const DebuffIcon=()=> <Icon className="icon-debuff"><circle cx="12" cy="12" r="8.5" strokeDasharray="3.4 2.2"/><path d="m8.5 11 3.5 3.5 3.5-3.5"/></Icon>;
export const EventIcon=()=> <Icon><path d="M12 3.5 20.5 12 12 20.5 3.5 12 12 3.5Z"/><path d="M12 8.5v4.2M12 15.6v.1"/></Icon>;
export const MarketIcon=()=> <Icon><path d="M4 9.5 6 4.5h12l2 5M4 9.5h16M4 9.5v10h16v-10M9.5 19.5v-5h5v5"/></Icon>;
export const MinusIcon=()=> <Icon><path d="M6 12h12"/></Icon>;
export const PlusIcon=()=> <Icon><path d="M12 6v12M6 12h12"/></Icon>;
export const SoundIcon=({on}:{on:boolean})=> <Icon><path d="M4.5 9.5h3l4.5-4v13l-4.5-4h-3v-5Z"/>{on?<path d="M15.5 9a4.2 4.2 0 0 1 0 6M18 6.5a7.8 7.8 0 0 1 0 11"/>:<path d="m15.5 9.5 5 5M20.5 9.5l-5 5"/>}</Icon>;
