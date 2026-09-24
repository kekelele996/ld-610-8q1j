import { useState } from "react";
import { useRestorationPlanStore } from "../stores/RestorationPlanStore";
import type { RestorationPlan } from "../types/RestorationPlan";

export function usePlanApproval() {
  const submit = useRestorationPlanStore((state) => state.submit);
  const approve = useRestorationPlanStore((state) => state.approve);
  const reject = useRestorationPlanStore((state) => state.reject);
  const [pendingId, setPendingId] = useState<number | null>(null);

  const canSubmit = (plan: RestorationPlan) => plan.approval_status === "DRAFT" || plan.approval_status === "REJECTED";
  const canDecide = (plan: RestorationPlan) => plan.approval_status === "SUBMITTED";
  const canEdit = (plan: RestorationPlan) => plan.approval_status !== "APPROVED" && plan.approval_status !== "ARCHIVED";

  const run = async (id: number, action: () => Promise<boolean>) => {
    setPendingId(id);
    try {
      return await action();
    } finally {
      setPendingId(null);
    }
  };

  return {
    pendingId,
    canSubmit,
    canDecide,
    canEdit,
    submitPlan: (id: number) => run(id, () => submit(id)),
    approvePlan: (id: number, approver: string) => run(id, () => approve(id, approver)),
    rejectPlan: (id: number, reason: string, approver: string) => run(id, () => reject(id, reason, approver))
  };
}
