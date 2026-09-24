import { damageRecordRepository } from "../repositories/DamageRecordRepository";
import type { DamageRecord } from "../models/DamageRecord";

export const damageRecordService = {
  list: () => damageRecordRepository.findAll(),
  create: (row: unknown) => damageRecordRepository.save(row as Omit<DamageRecord, "id">),
  markInRestoration: (id: number) => damageRecordRepository.updateStatus(id, "IN_RESTORATION")
};
