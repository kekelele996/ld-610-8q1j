import { PlanApprovalStatus } from "../constants/PlanApprovalStatus";
import { DamageStatus } from "../constants/DamageStatus";
import { LOG_TEMPLATES } from "../constants/logTemplates";
import { DomainError } from "../utils/errors";
import { nowIso } from "../utils/clock";
import { restorationPlanRepository } from "../repositories/RestorationPlanRepository";
import { damageRecordRepository } from "../repositories/DamageRecordRepository";
import { createRestorationPlanDto } from "../constructors/RestorationPlanDtoFactory";
import type { RestorationPlan } from "../models/RestorationPlan";
import type { RestorationPlanPayload } from "../types/RestorationPlanPayload";

export type Actor = { id: number; name: string; role: string };

const assertPlan = (id: number): RestorationPlan => {
  const plan = restorationPlanRepository.findById(id);
  if (!plan) throw new DomainError("PLAN_NOT_FOUND", 404);
  return plan;
};

const isLocked = (status: string) =>
  status === PlanApprovalStatus[2] || status === PlanApprovalStatus[4];

const writeLog = (template: string, plan: RestorationPlan) =>
  console.info("[audit]", template, "plan#" + plan.id, "damage#" + plan.damage_record_id, plan.approval_status);

export const restorationPlanService = {
  list: () => restorationPlanRepository.findAll(),

  create: (payload: RestorationPlanPayload, actor: Actor): RestorationPlan => {
    const damageRecordId = Number(payload.damage_record_id);
    const damage = damageRecordRepository.findById(damageRecordId);
    if (!damage) throw new DomainError("DAMAGE_NOT_FOUND", 404);

    // 已经进入修复（或已关闭）的病害不能再转成新方案。
    if (damage.status === DamageStatus[1]) throw new DomainError("DAMAGE_ALREADY_IN_RESTORATION");
    if (damage.status === DamageStatus[2]) throw new DomainError("DAMAGE_ALREADY_IN_RESTORATION");

    const existing = restorationPlanRepository.findByDamageRecordId(damageRecordId);
    if (existing && existing.approval_status !== PlanApprovalStatus[4]) {
      throw new DomainError("DAMAGE_HAS_PLAN");
    }

    const timestamp = nowIso();
    const plan = createRestorationPlanDto({
      id: restorationPlanRepository.nextId(),
      relic_id: damage.relic_id,
      damage_record_id: damageRecordId,
      plan_title: payload.plan_title ?? damage.damage_type + "修复方案",
      method: payload.method ?? "",
      risk_assessment: payload.risk_assessment ?? "",
      approval_status: PlanApprovalStatus[0],
      owner_id: actor.id,
      owner_name: actor.name,
      submitted_at: null,
      created_at: timestamp,
      updated_at: timestamp
    });
    const saved = restorationPlanRepository.save(plan);
    writeLog(LOG_TEMPLATES.RestorationPlan[4] ?? "RestorationPlan.create", saved);
    return saved;
  },

  update: (id: number, payload: RestorationPlanPayload): RestorationPlan => {
    const plan = assertPlan(id);
    if (isLocked(plan.approval_status)) throw new DomainError("PLAN_LOCKED");
    const next: RestorationPlan = {
      ...plan,
      plan_title: payload.plan_title ?? plan.plan_title,
      method: payload.method ?? plan.method,
      risk_assessment: payload.risk_assessment ?? plan.risk_assessment,
      updated_at: nowIso()
    };
    const saved = restorationPlanRepository.save(next);
    writeLog(LOG_TEMPLATES.RestorationPlan[1], saved);
    return saved;
  },

  submit: (id: number): RestorationPlan => {
    const plan = assertPlan(id);
    if (plan.approval_status !== PlanApprovalStatus[0] && plan.approval_status !== PlanApprovalStatus[3]) {
      throw new DomainError("PLAN_NOT_SUBMITTED");
    }
    const saved = restorationPlanRepository.save({
      ...plan,
      approval_status: PlanApprovalStatus[1],
      submitted_at: plan.submitted_at ?? nowIso(),
      rejection_reason: null,
      updated_at: nowIso()
    });
    writeLog(LOG_TEMPLATES.RestorationPlan[4], saved);
    return saved;
  },

  approve: (id: number, reviewerName: string): RestorationPlan => {
    const plan = assertPlan(id);
    if (plan.approval_status !== PlanApprovalStatus[1]) throw new DomainError("PLAN_NOT_SUBMITTED");
    const timestamp = nowIso();
    const saved = restorationPlanRepository.save({
      ...plan,
      approval_status: PlanApprovalStatus[2],
      approved_by: reviewerName,
      approved_at: timestamp,
      rejection_reason: null,
      updated_at: timestamp
    });
    // 批准后关联病害转为修复中。
    const damage = damageRecordRepository.findById(plan.damage_record_id);
    if (damage) {
      damageRecordRepository.save({ ...damage, status: DamageStatus[1] });
    }
    writeLog(LOG_TEMPLATES.RestorationPlan[5], saved);
    return saved;
  },

  reject: (id: number, reason: string, reviewerName: string): RestorationPlan => {
    const plan = assertPlan(id);
    if (plan.approval_status !== PlanApprovalStatus[1]) throw new DomainError("PLAN_NOT_SUBMITTED");
    const trimmed = (reason ?? "").trim();
    if (!trimmed) throw new DomainError("PLAN_APPROVAL_REASON_REQUIRED");
    const saved = restorationPlanRepository.save({
      ...plan,
      approval_status: PlanApprovalStatus[3],
      approved_by: reviewerName,
      approved_at: nowIso(),
      rejection_reason: trimmed,
      updated_at: nowIso()
    });
    writeLog(LOG_TEMPLATES.RestorationPlan[6], saved);
    return saved;
  }
};
