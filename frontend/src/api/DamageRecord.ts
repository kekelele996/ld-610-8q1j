import { mockData } from "../mocks/seedData";
import { request } from "./http";
import { LOG_TEMPLATES } from "../constants/logTemplates";
import type { DamageRecord } from "../types/DamageRecord";
import type { DamageStatus } from "../constants/DamageStatus";

const endpoint = "/api/damage-record";

export async function listDamageRecord(): Promise<DamageRecord[]> {
  try {
    return await request<DamageRecord[]>(endpoint);
  } catch {
    return [...(mockData.damageRecord as unknown as DamageRecord[])];
  }
}

export async function updateDamageStatus(id: number, status: DamageStatus): Promise<DamageRecord> {
  console.info(LOG_TEMPLATES.DamageRecord[2], id, status);
  return request<DamageRecord>(`${endpoint}/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status })
  });
}

export async function saveDamageRecord(payload: DamageRecord) {
  console.info(LOG_TEMPLATES.DamageRecord[0], payload);
  return payload;
}
