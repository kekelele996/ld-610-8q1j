import { useEffect, useMemo, useState } from "react";
import { useRestorationPlanStore } from "../stores/RestorationPlanStore";
import { useDamageRecordStore } from "../stores/DamageRecordStore";
import { useRelicItemStore } from "../stores/RelicItemStore";
import { usePlanApproval } from "../hooks/usePlanApproval";
import { getCurrentUser } from "../api/currentUser";
import { PlanApprovalStatus, PlanApprovalStatusText, type PlanApprovalStatus as Status } from "../constants/PlanApprovalStatus";
import { DamageStatusText } from "../constants/DamageStatus";
import { formatDate } from "../utils/formatters";
import { StatusBadge } from "../components/common/StatusBadge";
import { SeverityBadge } from "../components/common/SeverityBadge";
import { ApprovalTimeline } from "../components/common/ApprovalTimeline";
import { PlanDecisionModal } from "../components/common/PlanDecisionModal";
import { PlanForm, type PlanFormValue } from "../components/common/PlanForm";
import { RoleSwitcher } from "../components/common/RoleSwitcher";
import { EmptyState } from "../components/common/EmptyState";
import type { RestorationPlan } from "../types/RestorationPlan";

type FilterValue = "ALL" | Status;

function PlanDetail({ plan }: { plan: RestorationPlan }) {
  const store = useRestorationPlanStore();
  const damages = useDamageRecordStore((state) => state.rows);
  const relics = useRelicItemStore((state) => state.rows);
  const approval = usePlanApproval(plan);
  const [decision, setDecision] = useState<"APPROVE" | "REJECT" | null>(null);

  const damage = damages.find((item) => item.id === plan.damage_record_id);
  const relic = relics.find((item) => item.id === plan.relic_id);

  const handleSave = async (form: PlanFormValue) => {
    await store.update(plan.id, form);
  };

  return (
    <article className="panel plan-detail">
      <header className="plan-detail-head">
        <div>
          <h2>{plan.plan_title}</h2>
          <p className="plan-sub">
            {relic ? `${relic.relic_code} · ${relic.name}` : `文物 #${plan.relic_id}`}
            {" / 病害 #"}
            {plan.damage_record_id}
            {damage ? `（${damage.damage_type}）` : ""}
            {damage ? <SeverityBadge value={damage.severity} /> : null}
          </p>
        </div>
        <StatusBadge value={plan.approval_status} text={PlanApprovalStatusText[plan.approval_status as Status]} />
      </header>

      <div className="plan-detail-grid">
        <div className="plan-detail-main">
          <PlanForm plan={plan} saving={store.loading} onSave={handleSave} />

          {plan.approval_status === "REJECTED" && plan.rejection_reason ? (
            <div className="reject-reason-box">
              <strong>上次驳回原因</strong>
              <p>{plan.rejection_reason}</p>
            </div>
          ) : null}

          <div className="action-bar">
            {approval.canSubmit ? (
              <button
                type="button"
                className="btn btn-primary"
                disabled={approval.submitting}
                onClick={async () => {
                  await approval.submit();
                }}
              >
                提交审批
              </button>
            ) : null}
            {approval.canReview ? (
              <>
                <button type="button" className="btn btn-primary" disabled={approval.submitting} onClick={() => setDecision("APPROVE")}>
                  批准
                </button>
                <button type="button" className="btn btn-danger" disabled={approval.submitting} onClick={() => setDecision("REJECT")}>
                  驳回
                </button>
              </>
            ) : null}
            {plan.approval_status === "SUBMITTED" && !approval.isExpert ? (
              <span className="action-hint">提交中，等待专家审批（切换到“专家”角色可审批）</span>
            ) : null}
          </div>
        </div>

        <aside className="plan-detail-side">
          <ApprovalTimeline plan={plan} />
          <dl className="meta-list">
            <dt>编制人</dt>
            <dd>{plan.owner_name || "—"}</dd>
            <dt>提交时间</dt>
            <dd>{formatDate(plan.submitted_at)}</dd>
            <dt>审批人</dt>
            <dd>{plan.approved_by || "—"}</dd>
            <dt>审批时间</dt>
            <dd>{formatDate(plan.approved_at)}</dd>
            <dt>关联病害状态</dt>
            <dd>{damage ? <StatusBadge value={damage.status} text={DamageStatusText[damage.status as keyof typeof DamageStatusText]} /> : "—"}</dd>
          </dl>
        </aside>
      </div>

      <PlanDecisionModal
        open={decision !== null}
        mode={decision ?? "APPROVE"}
        planTitle={plan.plan_title}
        reviewerName={getCurrentUser().name}
        submitting={approval.submitting}
        onCancel={() => setDecision(null)}
        onConfirm={async (reason) => {
          if (decision === "APPROVE") await approval.approve();
          else await approval.reject(reason);
          setDecision(null);
        }}
      />
    </article>
  );
}

export function PlansPage() {
  const rows = useRestorationPlanStore((state) => state.rows);
  const loading = useRestorationPlanStore((state) => state.loading);
  const error = useRestorationPlanStore((state) => state.error);
  const loadPlans = useRestorationPlanStore((state) => state.load);
  const loadDamages = useDamageRecordStore((state) => state.load);
  const loadRelics = useRelicItemStore((state) => state.load);
  const [filter, setFilter] = useState<FilterValue>("ALL");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    void loadPlans();
    void loadDamages();
    void loadRelics();
  }, [loadPlans, loadDamages, loadRelics]);

  const filtered = useMemo(
    () => (filter === "ALL" ? rows : rows.filter((row) => row.approval_status === filter)),
    [rows, filter]
  );
  const selected = rows.find((row) => row.id === selectedId) ?? filtered[0] ?? null;

  return (
    <section className="page-body">
      <div className="page-toolbar">
        <div className="filter-tabs">
          {(["ALL", ...PlanApprovalStatus] as FilterValue[]).map((value) => (
            <button
              key={value}
              type="button"
              className={filter === value ? "chip active" : "chip"}
              onClick={() => setFilter(value)}
            >
              {value === "ALL" ? "全部" : PlanApprovalStatusText[value]}
            </button>
          ))}
        </div>
        <RoleSwitcher />
      </div>

      {error ? <div className="alert alert-error">{error}</div> : null}

      <div className="split-layout">
        <div className="panel list-panel">
          {loading && rows.length === 0 ? (
            <EmptyState title="方案加载中…" />
          ) : filtered.length === 0 ? (
            <EmptyState title="暂无符合状态的修复方案" />
          ) : (
            <ul className="plan-list">
              {filtered.map((plan) => (
                <li key={plan.id}>
                  <button
                    type="button"
                    className={selected?.id === plan.id ? "plan-card active" : "plan-card"}
                    onClick={() => setSelectedId(plan.id)}
                  >
                    <span className="plan-card-title">{plan.plan_title}</span>
                    <span className="plan-card-meta">
                      病害 #{plan.damage_record_id} · {plan.owner_name}
                    </span>
                    <StatusBadge value={plan.approval_status} text={PlanApprovalStatusText[plan.approval_status as Status]} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {selected ? (
          <PlanDetail key={selected.id} plan={selected} />
        ) : (
          <div className="panel">
            <EmptyState title="请选择左侧方案查看审批流程" />
          </div>
        )}
      </div>
    </section>
  );
}
