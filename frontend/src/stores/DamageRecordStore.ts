import { create } from "zustand";
import { listDamageRecord, updateDamageStatus } from "../api/DamageRecord";
import type { DamageRecord } from "../types/DamageRecord";
import type { DamageStatus } from "../constants/DamageStatus";

type State = {
  rows: DamageRecord[];
  loading: boolean;
  error: string | null;
  load: () => Promise<void>;
  changeStatus: (id: number, status: DamageStatus) => Promise<boolean>;
};

export const useDamageRecordStore = create<State>((set, get) => ({
  rows: [],
  loading: false,
  error: null,
  async load() {
    set({ loading: true, error: null });
    try {
      set({ rows: await listDamageRecord(), loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "加载失败", loading: false });
    }
  },
  async changeStatus(id, status) {
    set({ error: null });
    try {
      await updateDamageStatus(id, status);
      await get().load();
      return true;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "操作失败" });
      return false;
    }
  }
}));
