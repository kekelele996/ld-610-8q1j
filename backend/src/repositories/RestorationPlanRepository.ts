import { seed } from "../seed";
import type { RestorationPlan } from "../models/RestorationPlan";

const plans: RestorationPlan[] = seed.restorationPlan.map((row) => ({ ...(row as RestorationPlan) }));

export const restorationPlanRepository = {
  findAll: (): RestorationPlan[] => plans,
  findById: (id: number): RestorationPlan | undefined => plans.find((row) => row.id === id),
  findByDamageRecordId: (damageRecordId: number): RestorationPlan | undefined =>
    plans.find((row) => row.damage_record_id === damageRecordId),
  nextId: (): number => plans.reduce((max, row) => Math.max(max, row.id), 0) + 1,
  save: (row: RestorationPlan): RestorationPlan => {
    const index = plans.findIndex((item) => item.id === row.id);
    if (index >= 0) plans[index] = row;
    else plans.push(row);
    return row;
  }
};
