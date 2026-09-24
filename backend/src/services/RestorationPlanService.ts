import { restorationPlanRepository } from "../repositories/RestorationPlanRepository";
import { damageRecordService } from "./DamageRecordService";
import { damageRecordRepository } from "../repositories/DamageRecordRepository";
import { createRestorationPlanDto, createRestorationPlanResponse } from "../constructors/RestorationPlanDtoFactory";
import { ERROR_CODES } from "../constants/errorCodes";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { LOG_TEMPLATES } from "../constants/logTemplates";
import type { RestorationPlan } from "../models/RestorationPlan";

type ServiceError = Error & { code: string; status: number };

const serviceError = (code: keyof typeof ERROR_CODES, status: number): ServiceError => {
  const err = new Error(ERROR_MESSAGES[code]) as ServiceError;
  err.code = ERROR_CODES[code];
  err.status = status;
  return err;
};

const mustFind = (id: number): RestorationPlan => {
  const plan = restorationPlanRepository.findById(id);
  if (!plan) throw serviceError("PLAN_NOT_FOUND", 404);
  return plan;
};

export const restorationPlanService = {
  list: () => restorationPlanRepository.findAll().map(createRestorationPlanResponse),

  create: (payload: Partial<RestorationPlan>) => {
    const damageId = Number(payload.damage_record_id);
    const damage = damageRecordRepository.findById(damageId);
    if (!damage) throw serviceError("DAMAGE_NOT_FOUND", 404);
    if (damage.status === "IN_RESTORATION") throw serviceError("DAMAGE_IN_RESTORATION", 409);
    console.info(LOG_TEMPLATES.RestorationPlan[0], payload.plan_title);
    return restorationPlanRepository.save(createRestorationPlanDto({
      relic_id: Number(payload.relic_id ?? damage.relic_id),
      damage_record_id: damageId,
      plan_title: String(payload.plan_title ?? ""),
      method: String(payload.method ?? ""),
      risk_assessment: String(payload.risk_assessment ?? ""),
      owner_id: Number(payload.owner_id ?? 1)
    }));
  },

  update: (id: number, payload: Partial<RestorationPlan>) => {
    const plan = mustFind(id);
    if (plan.approval_status === "APPROVED") throw serviceError("PLAN_LOCKED", 409);
    console.info(LOG_TEMPLATES.RestorationPlan[1], id);
    return restorationPlanRepository.update(id, {
      plan_title: payload.plan_title ?? plan.plan_title,
      method: payload.method ?? plan.method,
      risk_assessment: payload.risk_assessment ?? plan.risk_assessment
    });
  },

  submit: (id: number) => {
    const plan = mustFind(id);
    if (plan.approval_status !== "DRAFT" && plan.approval_status !== "REJECTED") throw serviceError("PLAN_STATE_INVALID", 409);
    console.info(LOG_TEMPLATES.RestorationPlan[4], id);
    return restorationPlanRepository.update(id, { approval_status: "SUBMITTED" });
  },

  approve: (id: number, approver: string) => {
    const plan = mustFind(id);
    if (plan.approval_status !== "SUBMITTED") throw serviceError("PLAN_NOT_SUBMITTED", 409);
    const approved = restorationPlanRepository.update(id, {
      approval_status: "APPROVED",
      approved_by: approver,
      approved_at: new Date().toISOString()
    });
    console.info(LOG_TEMPLATES.RestorationPlan[5], id, approver);
    damageRecordService.markInRestoration(plan.damage_record_id);
    console.info(LOG_TEMPLATES.DamageRecord[4], plan.damage_record_id);
    return approved;
  },

  reject: (id: number, reason: string, rejectedBy: string) => {
    const plan = mustFind(id);
    if (plan.approval_status !== "SUBMITTED") throw serviceError("PLAN_NOT_SUBMITTED", 409);
    if (!reason || !reason.trim()) throw serviceError("REJECT_REASON_REQUIRED", 400);
    console.info(LOG_TEMPLATES.RestorationPlan[6], id, rejectedBy);
    return restorationPlanRepository.update(id, {
      approval_status: "REJECTED",
      rejected_by: rejectedBy,
      rejected_at: new Date().toISOString(),
      reject_reason: reason.trim()
    });
  }
};
