import { useEffect } from "react";
import { Form, Input, Modal, Select } from "antd";
import { DamageRecordStatusText } from "../../constants/DamageRecordStatus";
import type { DamageRecord } from "../../types/DamageRecord";
import type { RestorationPlan } from "../../types/RestorationPlan";

export type PlanFormValues = {
  damage_record_id: number;
  plan_title: string;
  method: string;
  risk_assessment: string;
};

type Props = {
  open: boolean;
  plan?: RestorationPlan | null;
  damage?: DamageRecord | null;
  damages: DamageRecord[];
  onCancel: () => void;
  onSubmit: (values: PlanFormValues) => Promise<boolean>;
};

export function PlanFormModal({ open, plan, damage, damages, onCancel, onSubmit }: Props) {
  const [form] = Form.useForm<PlanFormValues>();
  const editing = Boolean(plan);

  useEffect(() => {
    if (!open) return;
    form.setFieldsValue({
      damage_record_id: plan?.damage_record_id ?? damage?.id ?? undefined,
      plan_title: plan?.plan_title ?? "",
      method: plan?.method ?? "",
      risk_assessment: plan?.risk_assessment ?? ""
    } as PlanFormValues);
  }, [open, plan, damage, form]);

  const options = damages.map((row) => ({
    value: row.id,
    label: `#${row.id} ${row.damage_type}（${DamageRecordStatusText[row.status as keyof typeof DamageRecordStatusText] ?? row.status}）`,
    disabled: row.status === "IN_RESTORATION" && row.id !== plan?.damage_record_id
  }));

  return (
    <Modal
      title={editing ? `编辑方案 #${plan?.id}` : "新建修复方案"}
      open={open}
      onCancel={onCancel}
      okText={editing ? "保存" : "创建"}
      cancelText="取消"
      onOk={() => form.validateFields().then(async (values) => { if (await onSubmit(values)) form.resetFields(); })}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="damage_record_id" label="关联病害" rules={[{ required: true, message: "请选择关联病害" }]}>
          <Select options={options} disabled={editing || Boolean(damage)} placeholder="选择病害记录" />
        </Form.Item>
        <Form.Item name="plan_title" label="方案标题" rules={[{ required: true, message: "请填写方案标题" }]}>
          <Input placeholder="例如：青花罐腹部裂隙加固" />
        </Form.Item>
        <Form.Item name="method" label="修复方法" rules={[{ required: true, message: "请填写修复方法" }]}>
          <Input.TextArea rows={3} placeholder="清洗、粘接、补配、做旧等工艺说明" />
        </Form.Item>
        <Form.Item name="risk_assessment" label="风险说明" rules={[{ required: true, message: "请填写风险说明" }]}>
          <Input.TextArea rows={3} placeholder="材料老化、二次污染、操作风险等评估" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
