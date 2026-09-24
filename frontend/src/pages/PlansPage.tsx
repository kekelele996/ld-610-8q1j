import { useEffect, useMemo, useState } from "react";
import { Alert, App, Button, Input, Modal, Popconfirm, Space, Table, Tag, Tooltip } from "antd";
import { useRestorationPlanStore } from "../stores/RestorationPlanStore";
import { useDamageRecordStore } from "../stores/DamageRecordStore";
import { usePlanApproval } from "../hooks/usePlanApproval";
import { PlanFormModal, type PlanFormValues } from "../components/common/PlanFormModal";
import { StatusBadge } from "../components/common/StatusBadge";
import { PlanApprovalStatusText } from "../constants/PlanApprovalStatus";
import { LOG_TEMPLATES } from "../constants/logTemplates";
import { formatDate } from "../utils/formatters";
import type { RestorationPlan } from "../types/RestorationPlan";

export function PlansPage() {
  const { message } = App.useApp();
  const { rows, loading, error, load, create, update } = useRestorationPlanStore();
  const { rows: damages, load: loadDamages } = useDamageRecordStore();
  const { pendingId, canSubmit, canDecide, canEdit, submitPlan, approvePlan, rejectPlan } = usePlanApproval();
  const [expert, setExpert] = useState("expert-chen");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<RestorationPlan | null>(null);
  const [rejecting, setRejecting] = useState<RestorationPlan | null>(null);
  const [reason, setReason] = useState("");

  useEffect(() => {
    void load();
    void loadDamages();
  }, [load, loadDamages]);

  const damageById = useMemo(() => new Map(damages.map((row) => [row.id, row])), [damages]);

  const notify = async (ok: boolean, template: string) => {
    if (ok) message.success(template);
    else message.error(useRestorationPlanStore.getState().error ?? "操作失败");
  };

  const submitForm = async (values: PlanFormValues) => {
    const damage = damageById.get(values.damage_record_id);
    const ok = editing
      ? await update(editing.id, values)
      : await create({ ...values, relic_id: damage?.relic_id ?? 1 });
    await notify(ok, LOG_TEMPLATES.RestorationPlan[editing ? 1 : 0]);
    if (ok) {
      setFormOpen(false);
      setEditing(null);
    }
    return ok;
  };

  const columns = [
    { title: "ID", dataIndex: "id", width: 60 },
    { title: "方案标题", dataIndex: "plan_title" },
    {
      title: "关联病害",
      dataIndex: "damage_record_id",
      render: (id: number) => {
        const damage = damageById.get(id);
        return damage ? `#${id} ${damage.damage_type}` : `#${id}`;
      }
    },
    { title: "修复方法", dataIndex: "method", ellipsis: true },
    { title: "风险说明", dataIndex: "risk_assessment", ellipsis: true },
    {
      title: "审批状态",
      dataIndex: "approval_status",
      render: (value: string) => (
        <StatusBadge value={value} label={PlanApprovalStatusText[value as keyof typeof PlanApprovalStatusText] ?? value} />
      )
    },
    {
      title: "审批记录",
      key: "audit",
      render: (_: unknown, plan: RestorationPlan) => {
        if (plan.approval_status === "APPROVED") {
          return <span>{plan.approved_by} · {plan.approved_at ? formatDate(plan.approved_at) : "-"}</span>;
        }
        if (plan.approval_status === "REJECTED") {
          return (
            <Tooltip title={plan.reject_reason}>
              <span>{plan.rejected_by} · {plan.rejected_at ? formatDate(plan.rejected_at) : "-"}</span>
            </Tooltip>
          );
        }
        return <Tag>未审批</Tag>;
      }
    },
    {
      title: "驳回原因",
      dataIndex: "reject_reason",
      render: (value: string | null) => value ?? "—"
    },
    {
      title: "操作",
      key: "actions",
      width: 260,
      render: (_: unknown, plan: RestorationPlan) => (
        <Space wrap>
          {canEdit(plan) ? (
            <Button size="small" onClick={() => { setEditing(plan); setFormOpen(true); }}>编辑</Button>
          ) : (
            <Tooltip title="已批准的方案不能继续修改修复方法或风险说明">
              <Button size="small" disabled>编辑</Button>
            </Tooltip>
          )}
          {canSubmit(plan) && (
            <Popconfirm title="提交后进入专家审批" onConfirm={() => submitPlan(plan.id).then((ok) => notify(ok, LOG_TEMPLATES.RestorationPlan[4]))}>
              <Button size="small" loading={pendingId === plan.id}>提交审批</Button>
            </Popconfirm>
          )}
          {canDecide(plan) && (
            <>
              <Popconfirm
                title="批准该方案？"
                description="批准后关联病害将转入修复中，方案内容锁定"
                onConfirm={() => approvePlan(plan.id, expert).then((ok) => notify(ok, LOG_TEMPLATES.RestorationPlan[5]))}
              >
                <Button size="small" type="primary" loading={pendingId === plan.id}>批准</Button>
              </Popconfirm>
              <Button size="small" danger loading={pendingId === plan.id} onClick={() => { setRejecting(plan); setReason(""); }}>驳回</Button>
            </>
          )}
        </Space>
      )
    }
  ];

  return (
    <main className="page">
      <section className="page-head">
        <div>
          <p className="eyebrow">relic-restore</p>
          <h1>修复方案</h1>
        </div>
        <Space>
          <span>当前专家</span>
          <Input style={{ width: 160 }} value={expert} onChange={(event) => setExpert(event.target.value)} />
          <Button type="primary" onClick={() => { setEditing(null); setFormOpen(true); }}>新建方案</Button>
        </Space>
      </section>
      {error && <Alert type="error" showIcon message={error} closable />}
      <Table<RestorationPlan>
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={rows}
        pagination={{ pageSize: 8 }}
      />
      <PlanFormModal
        open={formOpen}
        plan={editing}
        damages={damages}
        onCancel={() => { setFormOpen(false); setEditing(null); }}
        onSubmit={submitForm}
      />
      <Modal
        title={`驳回方案 #${rejecting?.id ?? ""}`}
        open={Boolean(rejecting)}
        okText="确认驳回"
        okButtonProps={{ danger: true, disabled: !reason.trim(), loading: rejecting ? pendingId === rejecting.id : false }}
        cancelText="取消"
        onCancel={() => setRejecting(null)}
        onOk={async () => {
          if (!rejecting) return;
          const ok = await rejectPlan(rejecting.id, reason, expert);
          await notify(ok, LOG_TEMPLATES.RestorationPlan[6]);
          if (ok) setRejecting(null);
        }}
      >
        <p>驳回原因会保留在方案记录中，病害记录页也能看到。</p>
        <Input.TextArea
          rows={4}
          value={reason}
          placeholder="必填：说明驳回原因，例如风险评估不完整"
          onChange={(event) => setReason(event.target.value)}
        />
      </Modal>
    </main>
  );
}
