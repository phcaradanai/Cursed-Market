import { createRoot } from 'react-dom/client';
import { App } from './App.js';
import '@fontsource/srisakdi/thai-700.css';
import '@fontsource/srisakdi/latin-700.css';
import '@fontsource/im-fell-english/latin-400.css';
import './styles.css';

createRoot(document.getElementById('root')!).render(<App/>);
