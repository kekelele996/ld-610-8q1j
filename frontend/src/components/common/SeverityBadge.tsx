import { DamageSeverityText, type DamageSeverity } from "../../constants/DamageSeverity";
import { StatusBadge } from "./StatusBadge";

const VARIANT_BY_SEVERITY: Record<string, string> = {
  LOW: "badge-default low",
  MEDIUM: "badge-info medium",
  HIGH: "badge-warning high",
  CRITICAL: "badge-danger critical"
};

export function SeverityBadge({ value }: { value: string }) {
  const key = String(value).toUpperCase();
  const text = DamageSeverityText[key as DamageSeverity] ?? value;
  if (VARIANT_BY_SEVERITY[key]) {
    return <span className={`badge ${VARIANT_BY_SEVERITY[key]}`}>{text}</span>;
  }
  return <StatusBadge value={value} text={text} />;
}
