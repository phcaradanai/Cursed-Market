import { createHmac } from "node:crypto";

/** Independent labelled draws; revealing one outcome cannot expose future draws. */
export function randomAt(seed: string, label: string): number {
  const bytes = createHmac("sha256", seed).update(label).digest();
  return bytes.readUInt32BE(0) / 0x100000000;
}

export function pick<T>(values: readonly T[], random: number): T {
  if (values.length === 0 || !Number.isFinite(random) || random < 0 || random >= 1) {
    throw new Error("Cannot pick from an empty collection or invalid random draw");
  }
  return values[Math.floor(random * values.length)]!;
}
