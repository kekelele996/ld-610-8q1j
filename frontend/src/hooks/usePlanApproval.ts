import { useCallback, useEffect, useMemo, useState } from "react";
import { getCurrentUser, subscribeCurrentUser } from "../api/currentUser";
import { useRestorationPlanStore } from "../stores/RestorationPlanStore";
import type { RestorationPlan } from "../types/RestorationPlan";
import type { UserRole } from "../constants/UserRole";

export type PlanApprovalActions = {
  canEdit: boolean;
  canSubmit: boolean;
  canReview: boolean;
  locked: boolean;
  isExpert: boolean;
  submitting: boolean;
  submit: () => Promise<boolean>;
  approve: () => Promise<boolean>;
  reject: (reason: string) => Promise<boolean>;
};

const DRAFT = "DRAFT";
const SUBMITTED = "SUBMITTED";
const APPROVED = "APPROVED";
const REJECTED = "REJECTED";
const ARCHIVED = "ARCHIVED";

// 已批准 / 已归档方案的修复方法与风险说明锁定，任何人不能继续修改。
export const isPlanLocked = (plan: RestorationPlan): boolean =>
  plan.approval_status === APPROVED || plan.approval_status === ARCHIVED;

export function usePlanApproval(plan: RestorationPlan | null, roleOverride?: UserRole): PlanApprovalActions {
  // 订阅当前用户上下文，角色切换后批准/驳回按钮显隐实时刷新。
  const [role, setRole] = useState<UserRole>(roleOverride ?? getCurrentUser().role);
  useEffect(() => {
    if (roleOverride) {
      setRole(roleOverride);
      return;
    }
    setRole(getCurrentUser().role);
    const unsubscribe = subscribeCurrentUser(() => setRole(getCurrentUser().role));
    return () => {
      unsubscribe();
    };
  }, [roleOverride]);

  const isExpert = role === "EXPERT";
  const submitPlan = useRestorationPlanStore((state) => state.submit);
  const approvePlan = useRestorationPlanStore((state) => state.approve);
  const rejectPlan = useRestorationPlanStore((state) => state.reject);
  const [submitting, setSubmitting] = useState(false);

  const status = plan?.approval_status;
  const locked = plan ? isPlanLocked(plan) : false;

  const canEdit = !!plan && !locked;
  const canSubmit = !!plan && (status === DRAFT || status === REJECTED);
  const canReview = !!plan && status === SUBMITTED && isExpert;

  const withPending = useCallback(async (task: () => Promise<boolean>) => {
    setSubmitting(true);
    const ok = await task();
    setSubmitting(false);
    return ok;
  }, []);

  return useMemo<PlanApprovalActions>(
    () => ({
      canEdit,
      canSubmit,
      canReview,
      locked,
      isExpert,
      submitting,
      submit: () => withPending(() => submitPlan(plan!.id)),
      approve: () => withPending(() => approvePlan(plan!.id)),
      reject: (reason) => withPending(() => rejectPlan(plan!.id, reason))
    }),
    // 动作函数依赖 plan.id 与权限布尔值，status/角色变化时重新计算。
    [canEdit, canSubmit, canReview, locked, isExpert, submitting, plan?.id, withPending, submitPlan, approvePlan, rejectPlan]
  );
}
