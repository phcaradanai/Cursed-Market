import type {ReactNode} from 'react';
import {ComicMenu} from './ComicUI.js';
import {EventIcon} from './icons.js';

/** Event-specific container; shared menu primitives keep its visual contract aligned. */
export function EventMenu({title,onClose,children}:{title:string;onClose:()=>void;children:ReactNode}) {
  return <ComicMenu id="event-decision-menu" modal open title={title} icon={<EventIcon/>} onClose={onClose} className="event-menu">{children}</ComicMenu>;
}
