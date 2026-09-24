export const DamageRecordStatus = ["OPEN", "IN_RESTORATION", "CLOSED"] as const;
export type DamageRecordStatus = (typeof DamageRecordStatus)[number];
export const DamageRecordStatusText: Record<DamageRecordStatus, string> = {
  OPEN: "待处理",
  IN_RESTORATION: "修复中",
  CLOSED: "已关闭"
};
