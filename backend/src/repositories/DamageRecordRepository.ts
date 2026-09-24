import { seed } from "../seed";
import type { DamageRecord } from "../models/DamageRecord";

const rows: DamageRecord[] = seed.damageRecord.map((row) => ({ ...row }));

export const damageRecordRepository = {
  findAll: (): DamageRecord[] => rows,
  findById: (id: number): DamageRecord | undefined => rows.find((row) => row.id === id),
  save: (row: Omit<DamageRecord, "id">): DamageRecord => {
    const created: DamageRecord = { ...row, id: rows.reduce((max, item) => Math.max(max, item.id), 0) + 1 };
    rows.push(created);
    return created;
  },
  updateStatus: (id: number, status: string): DamageRecord | undefined => {
    const row = rows.find((item) => item.id === id);
    if (!row) return undefined;
    row.status = status;
    return row;
  }
};
