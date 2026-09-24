import { mockData } from "../mocks/seedData";
import { request } from "./http";
import { PlanApprovalStatusText } from "../constants/PlanApprovalStatus";
import { LOG_TEMPLATES } from "../constants/logTemplates";
import type { RestorationPlan } from "../types/RestorationPlan";
import type { PlanDecisionPayload } from "../types/PlanDecision";

const endpoint = "/api/restoration-plan";

export async function listRestorationPlan(): Promise<RestorationPlan[]> {
  try {
    return await request<RestorationPlan[]>(endpoint);
  } catch {
    // 离线评审时使用本地种子数据兜底。
    return [...(mockData.restorationPlan as unknown as RestorationPlan[])];
  }
}

export async function createRestorationPlan(payload: {
  damage_record_id: number;
  plan_title: string;
  method: string;
  risk_assessment: string;
}): Promise<RestorationPlan> {
  console.info(LOG_TEMPLATES.RestorationPlan[0], payload);
  return request<RestorationPlan>(endpoint, { method: "POST", body: JSON.stringify(payload) });
}

export async function updateRestorationPlan(
  id: number,
  payload: Pick<RestorationPlan, "plan_title" | "method" | "risk_assessment">
): Promise<RestorationPlan> {
  console.info(LOG_TEMPLATES.RestorationPlan[1], id, payload);
  return request<RestorationPlan>(`${endpoint}/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
}

export async function submitRestorationPlan(id: number): Promise<RestorationPlan> {
  console.info(LOG_TEMPLATES.RestorationPlan[4], id);
  return request<RestorationPlan>(`${endpoint}/${id}/submit`, { method: "POST" });
}

export async function approveRestorationPlan(id: number, payload: PlanDecisionPayload): Promise<RestorationPlan> {
  console.info(LOG_TEMPLATES.RestorationPlan[5], id, PlanApprovalStatusText.APPROVED);
  return request<RestorationPlan>(`${endpoint}/${id}/approve`, {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function rejectRestorationPlan(id: number, payload: PlanDecisionPayload): Promise<RestorationPlan> {
  console.info(LOG_TEMPLATES.RestorationPlan[6], id, PlanApprovalStatusText.REJECTED, payload.reason);
  return request<RestorationPlan>(`${endpoint}/${id}/reject`, {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

// 旧调用保留：saveRestorationPlan 只允许在未锁定状态下修改。
export async function saveRestorationPlan(payload: RestorationPlan) {
  return updateRestorationPlan(payload.id, {
    plan_title: payload.plan_title,
    method: payload.method,
    risk_assessment: payload.risk_assessment
  });
}
