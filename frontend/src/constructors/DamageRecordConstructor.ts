import type { DamageRecord } from "../types/DamageRecord";

export const createDefaultDamageRecord = (overrides: Partial<DamageRecord> = {}): DamageRecord => ({
  id: 0,
  relic_id: 0,
  damage_type: "",
  position_desc: "",
  severity: "MEDIUM",
  discovered_by: "",
  discovered_at: "",
  image_url: "",
  status: "REGISTERED",
  ...overrides
});

export const createDamageRecordForm = createDefaultDamageRecord;
export const createDamageRecordResponse = createDefaultDamageRecord;
