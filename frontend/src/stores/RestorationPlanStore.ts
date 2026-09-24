import { create } from "zustand";
import {
  approveRestorationPlan,
  createRestorationPlan,
  listRestorationPlan,
  rejectRestorationPlan,
  submitRestorationPlan,
  updateRestorationPlan
} from "../api/RestorationPlan";
import { useDamageRecordStore } from "./DamageRecordStore";
import type { RestorationPlan } from "../types/RestorationPlan";

type State = {
  rows: RestorationPlan[];
  loading: boolean;
  error: string | null;
  load: () => Promise<void>;
  run: (action: () => Promise<unknown>) => Promise<boolean>;
  create: (payload: Partial<RestorationPlan>) => Promise<boolean>;
  update: (id: number, payload: Partial<RestorationPlan>) => Promise<boolean>;
  submit: (id: number) => Promise<boolean>;
  approve: (id: number, approver: string) => Promise<boolean>;
  reject: (id: number, reason: string, approver: string) => Promise<boolean>;
};

const messageOf = (err: unknown) => (err instanceof Error ? err.message : String(err));

export const useRestorationPlanStore = create<State>((set, get) => ({
  rows: [],
  loading: false,
  error: null,
  async load() {
    set({ loading: true });
    set({ rows: await listRestorationPlan(), loading: false });
  },
  async run(action: () => Promise<unknown>) {
    try {
      await action();
      await get().load();
      set({ error: null });
      return true;
    } catch (err) {
      set({ error: messageOf(err) });
      return false;
    }
  },
  async create(payload) {
    return get().run(() => createRestorationPlan(payload));
  },
  async update(id, payload) {
    return get().run(() => updateRestorationPlan(id, payload));
  },
  async submit(id) {
    return get().run(() => submitRestorationPlan(id));
  },
  async approve(id, approver) {
    const ok = await get().run(() => approveRestorationPlan(id, approver));
    if (ok) await useDamageRecordStore.getState().load();
    return ok;
  },
  async reject(id, reason, approver) {
    return get().run(() => rejectRestorationPlan(id, reason, approver));
  }
}));
