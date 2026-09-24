import { seed } from "../seed";
import type { RestorationPlan } from "../models/RestorationPlan";

const rows: RestorationPlan[] = seed.restorationPlan.map((row) => ({ ...row }));

export const restorationPlanRepository = {
  findAll: (): RestorationPlan[] => rows,
  findById: (id: number): RestorationPlan | undefined => rows.find((row) => row.id === id),
  save: (row: Omit<RestorationPlan, "id">): RestorationPlan => {
    const created: RestorationPlan = { ...row, id: rows.reduce((max, item) => Math.max(max, item.id), 0) + 1 };
    rows.push(created);
    return created;
  },
  update: (id: number, patch: Partial<RestorationPlan>): RestorationPlan | undefined => {
    const row = rows.find((item) => item.id === id);
    if (!row) return undefined;
    Object.assign(row, patch);
    return row;
  }
};
