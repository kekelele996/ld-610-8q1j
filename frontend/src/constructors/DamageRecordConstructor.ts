import type { DamageRecord } from "../types/DamageRecord";

export const createDefaultDamageRecord = (overrides: Partial<DamageRecord> = {}): DamageRecord => ({
  id: 0,
  relic_id: 1,
  damage_type: "FRAGILE",
  position_desc: "",
  severity: "MEDIUM",
  discovered_by: "",
  discovered_at: new Date().toISOString(),
  image_url: "/mock/image_url-1.png",
  status: "OPEN",
  ...overrides
});

export const createDamageRecordForm = createDefaultDamageRecord;
export const createDamageRecordResponse = createDefaultDamageRecord;
