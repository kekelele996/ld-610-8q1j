export interface RestorationPlan {
  id: number;
  relic_id: number;
  damage_record_id: number;
  plan_title: string;
  method: string;
  risk_assessment: string;
  approval_status: string;
  owner_id: number;
  approved_by: string | null;
  approved_at: string | null;
  rejected_by: string | null;
  rejected_at: string | null;
  reject_reason: string | null;
}
