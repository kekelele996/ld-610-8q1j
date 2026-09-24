import type { RestorationPlan } from "../models/RestorationPlan";

export const createRestorationPlanDto = (overrides: Partial<RestorationPlan> = {}): Omit<RestorationPlan, "id"> => ({
  relic_id: 1,
  damage_record_id: 1,
  plan_title: "plan title 1",
  method: "method 1",
  risk_assessment: "risk assessment 1",
  approval_status: "DRAFT",
  owner_id: 1,
  approved_by: null,
  approved_at: null,
  rejected_by: null,
  rejected_at: null,
  reject_reason: null,
  ...overrides
});

export const createRestorationPlanResponse = (row: RestorationPlan) => ({ ...row });
