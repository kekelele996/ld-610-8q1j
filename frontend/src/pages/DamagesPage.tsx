import { useEffect, useMemo, useState } from "react";
import { Alert, App, Button, Space, Table, Tooltip } from "antd";
import { useDamageRecordStore } from "../stores/DamageRecordStore";
import { useRestorationPlanStore } from "../stores/RestorationPlanStore";
import { PlanFormModal, type PlanFormValues } from "../components/common/PlanFormModal";
import { StatusBadge } from "../components/common/StatusBadge";
import { SeverityBadge } from "../components/common/SeverityBadge";
import { DamageRecordStatusText } from "../constants/DamageRecordStatus";
import { PlanApprovalStatusText } from "../constants/PlanApprovalStatus";
import { DamageSeverityText } from "../constants/DamageSeverity";
import { LOG_TEMPLATES } from "../constants/logTemplates";
import type { DamageRecord } from "../types/DamageRecord";
import type { RestorationPlan } from "../types/RestorationPlan";

export function DamagesPage() {
  const { message } = App.useApp();
  const { rows, loading, load } = useDamageRecordStore();
  const { rows: plans, error, load: loadPlans, create } = useRestorationPlanStore();
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<DamageRecord | null>(null);

  useEffect(() => {
    void load();
    void loadPlans();
  }, [load, loadPlans]);

  const plansByDamage = useMemo(() => {
    const map = new Map<number, RestorationPlan[]>();
    for (const plan of plans) {
      map.set(plan.damage_record_id, [...(map.get(plan.damage_record_id) ?? []), plan]);
    }
    return map;
  }, [plans]);

  const submitForm = async (values: PlanFormValues) => {
    const damage = rows.find((row) => row.id === values.damage_record_id) ?? selected;
    const ok = await create({ ...values, relic_id: damage?.relic_id ?? 1 });
    if (ok) message.success(LOG_TEMPLATES.RestorationPlan[0]);
    else message.error(useRestorationPlanStore.getState().error ?? "操作失败");
    if (ok) {
      setFormOpen(false);
      setSelected(null);
    }
    return ok;
  };

  const columns = [
    { title: "ID", dataIndex: "id", width: 60 },
    { title: "文物", dataIndex: "relic_id", render: (id: number) => `#${id}` },
    { title: "病害类型", dataIndex: "damage_type" },
    { title: "位置", dataIndex: "position_desc" },
    {
      title: "严重程度",
      dataIndex: "severity",
      render: (value: string) => (
        <SeverityBadge title="" value={DamageSeverityText[value as keyof typeof DamageSeverityText] ?? value} />
      )
    },
    {
      title: "状态",
      dataIndex: "status",
      render: (value: string) => (
        <StatusBadge value={value} label={DamageRecordStatusText[value as keyof typeof DamageRecordStatusText] ?? value} />
      )
    },
    {
      title: "关联方案 / 审批状态",
      key: "plans",
      render: (_: unknown, damage: DamageRecord) => {
        const linked = plansByDamage.get(damage.id) ?? [];
        if (linked.length === 0) return "—";
        return (
          <Space direction="vertical" size={4}>
            {linked.map((plan) => (
              <Space key={plan.id} size={8}>
                <span>#{plan.id} {plan.plan_title}</span>
                <StatusBadge
                  value={plan.approval_status}
                  label={PlanApprovalStatusText[plan.approval_status as keyof typeof PlanApprovalStatusText] ?? plan.approval_status}
                />
                {plan.approval_status === "REJECTED" && plan.reject_reason && (
                  <Tooltip title={plan.reject_reason}><span style={{ color: "#a33" }}>原因</span></Tooltip>
                )}
              </Space>
            ))}
          </Space>
        );
      }
    },
    {
      title: "操作",
      key: "actions",
      width: 150,
      render: (_: unknown, damage: DamageRecord) => {
        const locked = damage.status === "IN_RESTORATION";
        const button = (
          <Button
            size="small"
            type="primary"
            disabled={locked}
            onClick={() => { setSelected(damage); setFormOpen(true); }}
          >
            转为修复方案
          </Button>
        );
        return locked ? <Tooltip title="该病害已进入修复，不能再生成新的修复方案">{button}</Tooltip> : button;
      }
    }
  ];

  return (
    <main className="page">
      <section className="page-head">
        <div>
          <p className="eyebrow">relic-restore</p>
          <h1>病害记录</h1>
        </div>
      </section>
      {error && <Alert type="error" showIcon message={error} closable />}
      <Table<DamageRecord>
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={rows}
        pagination={{ pageSize: 8 }}
      />
      <PlanFormModal
        open={formOpen}
        damage={selected}
        damages={rows}
        onCancel={() => { setFormOpen(false); setSelected(null); }}
        onSubmit={submitForm}
      />
    </main>
  );
}
