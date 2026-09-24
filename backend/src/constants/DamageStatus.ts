export const DamageStatus = ["REGISTERED", "IN_RESTORATION", "CLOSED"] as const;
export type DamageStatus = (typeof DamageStatus)[number];

export const DamageStatusText: Record<DamageStatus, string> = {
  REGISTERED: "已登记",
  IN_RESTORATION: "修复中",
  CLOSED: "已关闭"
};
