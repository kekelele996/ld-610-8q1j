import type { RestorationPlan } from "../types/RestorationPlan";

export const createDefaultRestorationPlan = (overrides: Partial<RestorationPlan> = {}): RestorationPlan => ({
  id: 0,
  relic_id: 1,
  damage_record_id: 1,
  plan_title: "",
  method: "",
  risk_assessment: "",
  approval_status: "DRAFT",
  owner_id: 1,
  approved_by: null,
  approved_at: null,
  rejected_by: null,
  rejected_at: null,
  reject_reason: null,
  ...overrides
});

export const createRestorationPlanForm = createDefaultRestorationPlan;
export const createRestorationPlanResponse = createDefaultRestorationPlan;
