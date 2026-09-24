import { useEffect, useMemo, useState } from "react";
import { useDamageRecordStore } from "../stores/DamageRecordStore";
import { useRestorationPlanStore } from "../stores/RestorationPlanStore";
import { useRelicItemStore } from "../stores/RelicItemStore";
import { getCurrentUser } from "../api/currentUser";
import { DamageStatus, DamageStatusText, type DamageStatus as DStatus } from "../constants/DamageStatus";
import { PlanApprovalStatusText } from "../constants/PlanApprovalStatus";
import { formatDate } from "../utils/formatters";
import { StatusBadge } from "../components/common/StatusBadge";
import { SeverityBadge } from "../components/common/SeverityBadge";
import { Modal } from "../components/common/Modal";
import { EmptyState } from "../components/common/EmptyState";
import type { DamageRecord } from "../types/DamageRecord";
import type { RestorationPlan } from "../types/RestorationPlan";
import type { PlanFormValue } from "../components/common/PlanForm";

type FilterValue = "ALL" | DStatus;

const EMPTY_FORM: PlanFormValue = { plan_title: "", method: "", risk_assessment: "" };

function AssociatedPlan({ plan }: { plan: RestorationPlan }) {
  return (
    <div className="associated-plan">
      <div className="associated-plan-head">
        <strong>{plan.plan_title}</strong>
        <StatusBadge value={plan.approval_status} text={PlanApprovalStatusText[plan.approval_status as keyof typeof PlanApprovalStatusText]} />
      </div>
      <p className="associated-plan-meta">
        方案 #{plan.id} · 编制人 {plan.owner_name}
        {plan.approved_by ? ` · 审批人 ${plan.approved_by}` : ""}
        {plan.approved_at ? ` · ${formatDate(plan.approved_at)}` : ""}
      </p>
      {plan.rejection_reason ? <p className="associated-plan-reason">驳回原因：{plan.rejection_reason}</p> : null}
    </div>
  );
}

function DamageRow({
  damage,
  relicName,
  plan,
  canCreatePlan,
  onCreatePlan
}: {
  damage: DamageRecord;
  relicName: string;
  plan: RestorationPlan | null;
  canCreatePlan: boolean;
  onCreatePlan: (damage: DamageRecord) => void;
}) {
  const inRestoration = damage.status === "IN_RESTORATION";
  const closed = damage.status === "CLOSED";
  const createBlocked = inRestoration || closed || plan !== null;

  return (
    <article className="panel damage-card">
      <header className="damage-card-head">
        <div>
          <h3>
            {damage.damage_type} <span className="muted">#{damage.id}</span>
          </h3>
          <p className="plan-sub">{relicName}</p>
        </div>
        <div className="damage-card-badges">
          <SeverityBadge value={damage.severity} />
          <StatusBadge value={damage.status} text={DamageStatusText[damage.status as DStatus]} />
        </div>
      </header>

      <p className="damage-position">{damage.position_desc}</p>
      <p className="damage-meta">
        发现人：{damage.discovered_by} · 发现时间：{formatDate(damage.discovered_at)}
      </p>

      <div className="damage-plan-zone">
        {plan ? (
          <AssociatedPlan plan={plan} />
        ) : (
          <p className="no-plan">暂无关联修复方案</p>
        )}
      </div>

      {canCreatePlan ? (
        <div className="action-bar">
          <button type="button" className="btn btn-primary" disabled={createBlocked} onClick={() => onCreatePlan(damage)}>
            转修复方案
          </button>
          {inRestoration ? (
            <span className="action-hint">病害已进入修复，不能再转成新方案</span>
          ) : closed ? (
            <span className="action-hint">病害已关闭，不能再转成新方案</span>
          ) : plan ? (
            <span className="action-hint">
              已有{PlanApprovalStatusText[plan.approval_status as keyof typeof PlanApprovalStatusText]}方案，不能重复立项
            </span>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

export function DamagesPage() {
  const damages = useDamageRecordStore((state) => state.rows);
  const damageError = useDamageRecordStore((state) => state.error);
  const loading = useDamageRecordStore((state) => state.loading);
  const loadDamages = useDamageRecordStore((state) => state.load);
  const plans = useRestorationPlanStore((state) => state.rows);
  const planLoading = useRestorationPlanStore((state) => state.loading);
  const planError = useRestorationPlanStore((state) => state.error);
  const loadPlans = useRestorationPlanStore((state) => state.load);
  const createForDamage = useRestorationPlanStore((state) => state.createForDamage);
  const relics = useRelicItemStore((state) => state.rows);
  const loadRelics = useRelicItemStore((state) => state.load);

  const [filter, setFilter] = useState<FilterValue>("ALL");
  const [target, setTarget] = useState<DamageRecord | null>(null);
  const [form, setForm] = useState<PlanFormValue>(EMPTY_FORM);

  useEffect(() => {
    void loadDamages();
    void loadPlans();
    void loadRelics();
  }, [loadDamages, loadPlans, loadRelics]);

  const planByDamage = useMemo(() => {
    const map = new Map<number, RestorationPlan>();
    plans.forEach((plan) => {
      if (!map.has(plan.damage_record_id)) map.set(plan.damage_record_id, plan);
    });
    return map;
  }, [plans]);

  const filtered = filter === "ALL" ? damages : damages.filter((damage) => damage.status === filter);
  const isRestorer = getCurrentUser().role === "RESTORER" || getCurrentUser().role === "EXPERT";

  const openCreate = (damage: DamageRecord) => {
    setTarget(damage);
    setForm({ ...EMPTY_FORM, plan_title: `${damage.damage_type}修复方案` });
  };

  const submitCreate = async () => {
    if (!target) return;
    const ok = await createForDamage(target.id, form);
    if (ok) setTarget(null);
  };

  return (
    <section className="page-body">
      <div className="page-toolbar">
        <div className="filter-tabs">
          {(["ALL", ...DamageStatus] as FilterValue[]).map((value) => (
            <button
              key={value}
              type="button"
              className={filter === value ? "chip active" : "chip"}
              onClick={() => setFilter(value)}
            >
              {value === "ALL" ? "全部" : DamageStatusText[value]}
            </button>
          ))}
        </div>
      </div>

      {damageError || planError ? <div className="alert alert-error">{damageError ?? planError}</div> : null}

      {loading && damages.length === 0 ? (
        <EmptyState title="病害记录加载中…" />
      ) : filtered.length === 0 ? (
        <EmptyState title="暂无该状态的病害记录" />
      ) : (
        <div className="damage-grid">
          {filtered.map((damage) => (
            <DamageRow
              key={damage.id}
              damage={damage}
              relicName={relics.find((relic) => relic.id === damage.relic_id)?.name ?? `文物 #${damage.relic_id}`}
              plan={planByDamage.get(damage.id) ?? null}
              canCreatePlan={isRestorer}
              onCreatePlan={openCreate}
            />
          ))}
        </div>
      )}

      <Modal
        open={target !== null}
        title="转为修复方案"
        onClose={() => setTarget(null)}
        footer={
          <>
            <button type="button" className="btn" onClick={() => setTarget(null)} disabled={planLoading}>
              取消
            </button>
            <button
              type="button"
              className="btn btn-primary"
              disabled={planLoading || !form.plan_title.trim() || !form.method.trim()}
              onClick={submitCreate}
            >
              {planLoading ? "提交中…" : "创建并保存为草稿"}
            </button>
          </>
        }
      >
        <p className="modal-plan-title">
          关联病害：{target?.damage_type} #{target?.id}（{target ? DamageStatusText[target.status as DStatus] : ""}）
        </p>
        <label className="field">
          <span>方案标题</span>
          <input value={form.plan_title} onChange={(event) => setForm((prev) => ({ ...prev, plan_title: event.target.value }))} />
        </label>
        <label className="field">
          <span>修复方法</span>
          <textarea rows={3} value={form.method} onChange={(event) => setForm((prev) => ({ ...prev, method: event.target.value }))} />
        </label>
        <label className="field">
          <span>风险说明</span>
          <textarea rows={2} value={form.risk_assessment} onChange={(event) => setForm((prev) => ({ ...prev, risk_assessment: event.target.value }))} />
        </label>
      </Modal>
    </section>
  );
}
