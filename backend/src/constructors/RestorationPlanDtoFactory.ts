import type { RestorationPlan } from "../models/RestorationPlan";

export const createRestorationPlanDto = (overrides: Partial<RestorationPlan> = {}): RestorationPlan => ({
  id: 0,
  relic_id: 0,
  damage_record_id: 0,
  plan_title: "",
  method: "",
  risk_assessment: "",
  approval_status: "DRAFT",
  owner_id: 0,
  owner_name: "",
  submitted_at: null,
  approved_by: null,
  approved_at: null,
  rejection_reason: null,
  created_at: "",
  updated_at: "",
  ...overrides
});
