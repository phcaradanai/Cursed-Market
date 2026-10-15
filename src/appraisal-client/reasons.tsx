import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

/**
 * Why the whole table is locked right now (offline, waiting on the server, sitting out, finished the phase, spectating).
 * Buttons show it as their hover text when they are disabled for that reason; null means the table is live.
 */
const LockContext = createContext<string | null>(null);
export function LockReason({ reason, children }: { reason: string | null; children: ReactNode }) {
  return <LockContext.Provider value={reason}>{children}</LockContext.Provider>;
}
export const useLock = (): string | null => useContext(LockContext);
/** First reason that applies, as a native tooltip value; undefined leaves the attribute off. */
export const tip = (...reasons: Array<string | null | false | undefined>): string | undefined => {
  const found = reasons.find(reason => typeof reason === 'string' && reason !== '');
  return typeof found === 'string' ? found : undefined;
};
