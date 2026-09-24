import { useEffect, useState } from "react";
import type { RestorationPlan } from "../../types/RestorationPlan";
import { isPlanLocked } from "../../hooks/usePlanApproval";

export type PlanFormValue = Pick<RestorationPlan, "plan_title" | "method" | "risk_assessment">;

type PlanFormProps = {
  plan: RestorationPlan;
  saving: boolean;
  onSave: (form: PlanFormValue) => void;
};

// 方案编辑表单：已批准/已归档时修复方法与风险说明只读。
export function PlanForm({ plan, saving, onSave }: PlanFormProps) {
  const locked = isPlanLocked(plan);
  const [form, setForm] = useState<PlanFormValue>({
    plan_title: plan.plan_title,
    method: plan.method,
    risk_assessment: plan.risk_assessment
  });

  useEffect(() => {
    setForm({
      plan_title: plan.plan_title,
      method: plan.method,
      risk_assessment: plan.risk_assessment
    });
  }, [plan.id, plan.plan_title, plan.method, plan.risk_assessment]);

  const update = (key: keyof PlanFormValue, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="plan-form">
      <label className="field">
        <span>方案标题</span>
        <input value={form.plan_title} disabled={locked} onChange={(event) => update("plan_title", event.target.value)} />
      </label>
      <label className="field">
        <span>修复方法</span>
        <textarea rows={4} value={form.method} disabled={locked} onChange={(event) => update("method", event.target.value)} />
      </label>
      <label className="field">
        <span>风险说明</span>
        <textarea rows={3} value={form.risk_assessment} disabled={locked} onChange={(event) => update("risk_assessment", event.target.value)} />
      </label>
      {locked ? (
        <p className="lock-tip">🔒 方案已批准，修复方法与风险说明已锁定，不可继续修改。</p>
      ) : (
        <div className="form-actions">
          <button type="button" className="btn btn-primary" disabled={saving} onClick={() => onSave(form)}>
            {saving ? "保存中…" : "保存修改"}
          </button>
        </div>
      )}
    </div>
  );
}
