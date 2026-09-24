export const ERROR_MESSAGES = {
  AUTH_REQUIRED: "missing bearer token",
  RBAC_DENIED: "role denied",
  VALIDATION_FAILED: "invalid payload",
  RATE_LIMITED: "too many requests",
  PLAN_NOT_FOUND: "restoration plan not found",
  PLAN_LOCKED: "approved plan cannot modify method or risk assessment",
  PLAN_NOT_SUBMITTED: "only submitted plans can be reviewed",
  PLAN_STATE_INVALID: "current plan status does not allow this action",
  REJECT_REASON_REQUIRED: "reject reason is required",
  DAMAGE_NOT_FOUND: "damage record not found",
  DAMAGE_IN_RESTORATION: "damage record already in restoration, cannot create a new plan"
};
