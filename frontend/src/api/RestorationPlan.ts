import { mockData } from "../mocks/seedData";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import type { RestorationPlan } from "../types/RestorationPlan";

const endpoint = "/api/restoration-plan";

async function request<T>(path: string, init: RequestInit = {}, role?: string): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (role) headers["x-role"] = role;
  const res = await fetch(path, { ...init, headers });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const code = (body as { code?: keyof typeof ERROR_MESSAGES }).code;
    throw new Error((code && ERROR_MESSAGES[code]) || (body as { message?: string }).message || `请求失败（${res.status}）`);
  }
  return body as T;
}

export async function listRestorationPlan(): Promise<RestorationPlan[]> {
  if (typeof fetch !== "undefined" && endpoint.startsWith("/api") && true) {
    try {
      const res = await fetch(endpoint);
      if (res.ok) return await res.json();
    } catch {
      // Local mock fallback keeps the UI available during offline review.
    }
  }
  return [...(mockData.restorationPlan as unknown as RestorationPlan[])];
}

export async function createRestorationPlan(payload: Partial<RestorationPlan>): Promise<RestorationPlan> {
  return request<RestorationPlan>(endpoint, { method: "POST", body: JSON.stringify(payload) });
}

export async function updateRestorationPlan(id: number, payload: Partial<RestorationPlan>): Promise<RestorationPlan> {
  return request<RestorationPlan>(`${endpoint}/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
}

export async function submitRestorationPlan(id: number): Promise<RestorationPlan> {
  return request<RestorationPlan>(`${endpoint}/${id}/submit`, { method: "POST", body: "{}" });
}

export async function approveRestorationPlan(id: number, approver: string): Promise<RestorationPlan> {
  return request<RestorationPlan>(`${endpoint}/${id}/approve`, { method: "POST", body: JSON.stringify({ approver }) }, "expert");
}

export async function rejectRestorationPlan(id: number, reason: string, approver: string): Promise<RestorationPlan> {
  return request<RestorationPlan>(`${endpoint}/${id}/reject`, { method: "POST", body: JSON.stringify({ reason, approver }) }, "expert");
}
