import { create } from "zustand";
import {
  approveRestorationPlan,
  createRestorationPlan,
  listRestorationPlan,
  rejectRestorationPlan,
  submitRestorationPlan,
  updateRestorationPlan
} from "../api/RestorationPlan";
import { getCurrentUser } from "../api/currentUser";
import { createPlanApprovalPayload, createPlanRejectPayload } from "../constructors/PlanDecisionConstructor";
import type { RestorationPlan } from "../types/RestorationPlan";
import type { PlanDecisionPayload } from "../types/PlanDecision";

type PlanForm = Pick<RestorationPlan, "plan_title" | "method" | "risk_assessment">;

type State = {
  rows: RestorationPlan[];
  loading: boolean;
  error: string | null;
  load: () => Promise<void>;
  createForDamage: (damageRecordId: number, form: PlanForm) => Promise<boolean>;
  update: (id: number, form: PlanForm) => Promise<boolean>;
  submit: (id: number) => Promise<boolean>;
  approve: (id: number) => Promise<boolean>;
  reject: (id: number, reason: string) => Promise<boolean>;
};

export const useRestorationPlanStore = create<State>((set, get) => {
  const run = async (action: () => Promise<unknown>): Promise<boolean> => {
    set({ loading: true, error: null });
    try {
      await action();
      await get().load();
      return true;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "操作失败", loading: false });
      return false;
    }
  };

  return {
    rows: [],
    loading: false,
    error: null,
    async load() {
      set({ loading: true, error: null });
      try {
        set({ rows: await listRestorationPlan(), loading: false });
      } catch (error) {
        set({ error: error instanceof Error ? error.message : "加载失败", loading: false });
      }
    },
    createForDamage: (damageRecordId, form) =>
      run(() => createRestorationPlan({ damage_record_id: damageRecordId, ...form })),
    update: (id, form) => run(() => updateRestorationPlan(id, form)),
    submit: (id) => run(() => submitRestorationPlan(id)),
    approve: (id) => {
      const payload: PlanDecisionPayload = createPlanApprovalPayload(getCurrentUser().name);
      return run(() => approveRestorationPlan(id, payload));
    },
    reject: (id, reason) => {
      const payload: PlanDecisionPayload = createPlanRejectPayload(getCurrentUser().name, { reason });
      return run(() => rejectRestorationPlan(id, payload));
    }
  };
});
