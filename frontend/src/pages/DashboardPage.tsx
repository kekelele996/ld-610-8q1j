import { useEffect } from "react";
import { useRestorationPlanStore } from "../stores/RestorationPlanStore";
import { useDamageRecordStore } from "../stores/DamageRecordStore";
import { useRelicItemStore } from "../stores/RelicItemStore";
import { StatCard } from "../components/common/StatCard";
import { StatusBadge } from "../components/common/StatusBadge";
import { PlanApprovalStatusText } from "../constants/PlanApprovalStatus";
import { DamageStatusText } from "../constants/DamageStatus";
import { formatDate } from "../utils/formatters";

export function DashboardPage() {
  const plans = useRestorationPlanStore((state) => state.rows);
  const loadPlans = useRestorationPlanStore((state) => state.load);
  const damages = useDamageRecordStore((state) => state.rows);
  const loadDamages = useDamageRecordStore((state) => state.load);
  const relics = useRelicItemStore((state) => state.rows);
  const loadRelics = useRelicItemStore((state) => state.load);

  useEffect(() => {
    void loadPlans();
    void loadDamages();
    void loadRelics();
  }, [loadPlans, loadDamages, loadRelics]);

  const pending = plans.filter((plan) => plan.approval_status === "SUBMITTED");
  const critical = damages.filter((damage) => damage.severity === "CRITICAL" || damage.severity === "HIGH");
  const restoring = damages.filter((damage) => damage.status === "IN_RESTORATION");

  return (
    <section className="page-body">
      <section className="metrics">
        <StatCard label="待审批方案" value={pending.length} />
        <StatCard label="重度/危重病害" value={critical.length} />
        <StatCard label="修复中病害" value={restoring.length} />
        <StatCard label="藏品总数" value={relics.length} />
      </section>
      <section className="workbench dashboard-grid">
        <div className="panel wide">
          <h2>待审批方案</h2>
          {pending.length === 0 ? (
            <p className="muted">暂无待审批方案</p>
          ) : (
            <div className="table">
              {pending.map((plan) => (
                <article key={plan.id} className="row">
                  <strong>{plan.plan_title}</strong>
                  <span>
                    病害 #{plan.damage_record_id} · {formatDate(plan.submitted_at)}
                  </span>
                  <StatusBadge value={plan.approval_status} text={PlanApprovalStatusText.SUBMITTED} />
                </article>
              ))}
            </div>
          )}
        </div>
        <div className="panel">
          <h2>修复中病害</h2>
          {restoring.length === 0 ? (
            <p className="muted">暂无修复中病害</p>
          ) : (
            restoring.map((damage) => (
              <article key={damage.id} className="row compact">
                <strong>
                  {damage.damage_type} #{damage.id}
                </strong>
                <StatusBadge value={damage.status} text={DamageStatusText.IN_RESTORATION} />
              </article>
            ))
          )}
        </div>
      </section>
    </section>
  );
}
