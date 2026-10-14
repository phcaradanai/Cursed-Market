import type { Family, Relic as SecretRelic, PublicRelic } from "../game/types.js";

export const familyName: Record<Family, string> = { Mask: "หน้ากาก", Mirror: "กระจก", Key: "กุญแจ", Clock: "นาฬิกา" };
export const modeName = { "as-is": "ไม่รับประกัน", genuine: "รับประกันว่าแท้", uncursed: "รับประกันว่าไร้คำสาป" };

/** Small neutral family symbols; no variants based on genuine/cursed truth. */
export function FamilySymbol({ family }: { family: Family }) {
  const drawings: Record<Family, React.ReactNode> = {
    Mask: <><path d="M14 12h36v17c0 14-18 24-18 24S14 43 14 29Z" /><path d="M20 25h8m8 0h8M25 39q7 5 14 0" /></>,
    Mirror: <><ellipse cx="32" cy="25" rx="15" ry="20" /><path d="M28 45v12h8V45M26 20l8-9m-5 19 10-12" /></>,
    Key: <><circle cx="23" cy="21" r="12" /><path d="m31 30 22 22m-7-7 7-7m-14 0 7-7" /></>,
    Clock: <><circle cx="32" cy="32" r="24" /><path d="M32 16v16l10 6M32 8v4M8 32h4m40 0h4M32 52v4" /></>,
  };
  return <svg className="family-symbol" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{drawings[family]}</svg>;
}

export function RelicDisplay({ relic, showTruth = false }: { relic: PublicRelic | SecretRelic; showTruth?: boolean }) {
  const truth = relic as SecretRelic;
  return <div className="relic-display">
    <FamilySymbol family={relic.family} />
    <h3>{familyName[relic.family]}</h3>
    {showTruth && <div className="truth"><span>{truth.genuine ? "ของแท้" : "ของปลอม"}</span><span className={truth.cursed ? "danger-text" : ""}>{truth.cursed ? "มีคำสาป" : "ไร้คำสาป"}</span></div>}
  </div>;
}
