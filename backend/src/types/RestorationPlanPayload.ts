import type { PlanApprovalStatus } from "../constants/PlanApprovalStatus";

export type RestorationPlanPayload = {
  damage_record_id?: number;
  plan_title?: string;
  method?: string;
  risk_assessment?: string;
  owner_id?: number;
  owner_name?: string;
  approval_status?: PlanApprovalStatus;
};
