import './personal-score-results.css';
import { createRoot } from 'react-dom/client';
import { App } from './App.js';
import '@fontsource/srisakdi/thai-700.css';
import '@fontsource/srisakdi/latin-700.css';
import '@fontsource/im-fell-english/latin-400.css';
import './styles.css';
import './secure-economy.css';
import './item-visual.css';
import './cabinet.css';
import './comic-tokens.css';
import './comic-theme.css';
import './concept-layout.css';
import './layout-system.css';
import './appraisal-concept.css';
import './inventory-concept.css';
import './utility-navigation.css';
import './comic-ui.css';
import './collector-wishlist.css';
import './market-concept.css';
import './event-concept.css';

const root=createRoot(document.getElementById('root')!);
if(new URLSearchParams(location.search).has('preview')){
  void import('./ComicPreview.js').then(({ComicPreview})=>root.render(<ComicPreview/>));
}else root.render(<App/>);

import './trade-concept.css';

import './comic-tooltip.css';
import './comic-overlay.css';
import './item-sale.css';
import './reward-concept.css';
import './vault-concept.css';
import './ghost-world.css';
import './theft-concept.css';
import './comic-frame.css';

import './entry-lobby.css';

import './event-menu.css';
import './comic-interactions.css';
