import { seed } from "../seed";
import type { DamageRecord } from "../models/DamageRecord";

const records: DamageRecord[] = seed.damageRecord.map((row) => ({ ...(row as DamageRecord) }));

export const damageRecordRepository = {
  findAll: (): DamageRecord[] => records,
  findById: (id: number): DamageRecord | undefined => records.find((row) => row.id === id),
  save: (row: DamageRecord): DamageRecord => {
    const index = records.findIndex((item) => item.id === row.id);
    if (index >= 0) records[index] = row;
    else records.push(row);
    return row;
  }
};
