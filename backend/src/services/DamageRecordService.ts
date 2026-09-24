import { DamageStatus } from "../constants/DamageStatus";
import { LOG_TEMPLATES } from "../constants/logTemplates";
import { DomainError } from "../utils/errors";
import { nowIso } from "../utils/clock";
import { damageRecordRepository } from "../repositories/DamageRecordRepository";
import { restorationPlanRepository } from "../repositories/RestorationPlanRepository";
import { createDamageRecordDto } from "../constructors/DamageRecordDtoFactory";
import type { DamageRecord } from "../models/DamageRecord";
import type { DamageRecordPayload } from "../types/DamageRecordPayload";

const assertDamage = (id: number): DamageRecord => {
  const record = damageRecordRepository.findById(id);
  if (!record) throw new DomainError("DAMAGE_NOT_FOUND", 404);
  return record;
};

export const damageRecordService = {
  list: () => damageRecordRepository.findAll(),

  create: (payload: DamageRecordPayload): DamageRecord => {
    const record = createDamageRecordDto({
      id: damageRecordRepository.findAll().reduce((max, row) => Math.max(max, row.id), 0) + 1,
      relic_id: Number(payload.relic_id ?? 0),
      damage_type: payload.damage_type ?? "",
      position_desc: payload.position_desc ?? "",
      severity: payload.severity ?? "MEDIUM",
      discovered_by: payload.discovered_by ?? "",
      discovered_at: payload.discovered_at ?? nowIso(),
      image_url: payload.image_url ?? "",
      status: DamageStatus[0]
    });
    const saved = damageRecordRepository.save(record);
    console.info("[audit]", LOG_TEMPLATES.DamageRecord[0], "damage#" + saved.id, saved.status);
    return saved;
  },

  updateStatus: (id: number, status: DamageStatus): DamageRecord => {
    const record = assertDamage(id);
    if (status === DamageStatus[0] && record.status === DamageStatus[1]) {
      throw new DomainError("DAMAGE_ALREADY_IN_RESTORATION");
    }
    const saved = damageRecordRepository.save({ ...record, status });
    console.info("[audit]", LOG_TEMPLATES.DamageRecord[2], "damage#" + saved.id, saved.status);
    return saved;
  },

  // 病害页用：返回该病害当前关联的方案（若有）。
  findPlanByDamageRecordId: (damageRecordId: number) =>
    restorationPlanRepository.findByDamageRecordId(damageRecordId) ?? null
};
