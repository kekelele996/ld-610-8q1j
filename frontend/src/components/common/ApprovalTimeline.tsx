import type { ReactNode } from "react";
import { formatDate } from "../../utils/formatters";
import type { RestorationPlan } from "../../types/RestorationPlan";
import { PlanApprovalStatusText } from "../../constants/PlanApprovalStatus";
import { StatusBadge } from "./StatusBadge";

type TimelineEntry = {
  key: string;
  label: string;
  active: boolean;
  meta?: ReactNode;
};

// 方案审批时间线：编制 → 提交 → 专家批准/驳回。
export function ApprovalTimeline({ plan }: { plan: RestorationPlan }) {
  const rejected = plan.approval_status === "REJECTED";
  const approved = plan.approval_status === "APPROVED" || plan.approval_status === "ARCHIVED";
  const submitted = !!plan.submitted_at || approved || rejected || plan.approval_status === "SUBMITTED";

  const entries: TimelineEntry[] = [
    {
      key: "create",
      label: "方案编制",
      active: true,
      meta: `${plan.owner_name || "—"} · ${formatDate(plan.created_at)}`
    },
    {
      key: "submit",
      label: "提交审批",
      active: submitted,
      meta: submitted ? formatDate(plan.submitted_at) : "尚未提交"
    },
    rejected
      ? {
          key: "reject",
          label: "专家驳回",
          active: true,
          meta: (
            <div className="timeline-reason">
              <span>
                {plan.approved_by ?? "专家"} · {formatDate(plan.approved_at)}
              </span>
              <p>驳回原因：{plan.rejection_reason}</p>
            </div>
          )
        }
      : {
          key: "approve",
          label: "专家批准",
          active: approved,
          meta: approved ? (
            <>
              {plan.approved_by} · {formatDate(plan.approved_at)}
            </>
          ) : (
            "等待专家审批"
          )
        }
  ];

  return (
    <div className="approval-timeline">
      <div className="approval-timeline-head">
        <span>审批进度</span>
        <StatusBadge value={plan.approval_status} text={PlanApprovalStatusText[plan.approval_status as keyof typeof PlanApprovalStatusText]} />
      </div>
      <ol>
        {entries.map((entry, index) => (
          <li key={entry.key} className={entry.active ? "active" : "pending"}>
            <span className="timeline-dot">{index + 1}</span>
            <div>
              <strong>{entry.label}</strong>
              <div className="timeline-meta">{entry.active ? entry.meta : "—"}</div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
