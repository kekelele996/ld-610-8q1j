export const DamageRecordStatus = ["OPEN", "IN_RESTORATION", "CLOSED"] as const;
export type DamageRecordStatus = (typeof DamageRecordStatus)[number];
