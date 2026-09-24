export const ERROR_MESSAGES = {
  AUTH_REQUIRED: "missing bearer token",
  RBAC_DENIED: "role denied",
  VALIDATION_FAILED: "invalid payload",
  RATE_LIMITED: "too many requests",
  PLAN_NOT_FOUND: "restoration plan not found",
  PLAN_NOT_SUBMITTED: "only submitted plans can be approved or rejected",
  PLAN_APPROVAL_REASON_REQUIRED: "rejection reason is required",
  PLAN_LOCKED: "approved plan can no longer be edited",
  DAMAGE_NOT_FOUND: "damage record not found",
  DAMAGE_ALREADY_IN_RESTORATION: "damage already in restoration, a new plan cannot be created",
  DAMAGE_HAS_PLAN: "damage already has a plan in draft or submitted"
} as const;
