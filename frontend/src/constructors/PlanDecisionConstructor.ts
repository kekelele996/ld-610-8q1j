import type { PlanDecisionPayload } from "../types/PlanDecision";

// 审批弹窗提交体构造器：批准时不带原因，驳回时必须保留原因。
export const createPlanApprovalPayload = (
  reviewerName: string,
  overrides: Partial<PlanDecisionPayload> = {}
): PlanDecisionPayload => ({
  reviewer_name: reviewerName,
  ...overrides
});

export const createPlanRejectPayload = createPlanApprovalPayload;
