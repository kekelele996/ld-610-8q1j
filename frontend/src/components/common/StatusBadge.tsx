type StatusVariant = "default" | "success" | "warning" | "danger" | "info";

const VARIANT_BY_STATUS: Record<string, StatusVariant> = {
  DRAFT: "default",
  SUBMITTED: "info",
  APPROVED: "success",
  REJECTED: "danger",
  ARCHIVED: "default",
  REGISTERED: "info",
  IN_RESTORATION: "warning",
  CLOSED: "default"
};

export function StatusBadge({ value, text }: { value: string; text?: string }) {
  const key = String(value).toUpperCase();
  const variant = VARIANT_BY_STATUS[key] ?? "default";
  return (
    <span className={`badge badge-${variant} ${key.toLowerCase().replace(/_/g, "-")}`}>
      {text ?? String(value).replace(/_/g, " ")}
    </span>
  );
}
