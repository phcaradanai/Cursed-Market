// Removes every previous build output so `npm run build` always leaves only the current code's output.
import { rmSync } from 'node:fs';

rmSync('dist', { recursive: true, force: true });
console.log('removed dist/');
