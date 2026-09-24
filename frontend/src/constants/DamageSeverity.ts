export const DamageSeverity = ["LOW","MEDIUM","HIGH","CRITICAL"] as const;
export type DamageSeverity = (typeof DamageSeverity)[number];
export const DamageSeverityText: Record<DamageSeverity, string> = {
  LOW: "轻微",
  MEDIUM: "中等",
  HIGH: "较重",
  CRITICAL: "严重"
};
