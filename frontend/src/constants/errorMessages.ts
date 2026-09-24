export const ERROR_MESSAGES = {
  AUTH_REQUIRED: "请先登录后再继续操作",
  RBAC_DENIED: "当前角色没有执行该动作的权限",
  VALIDATION_FAILED: "表单字段缺失或格式错误",
  RATE_LIMITED: "请求过于频繁，请稍后再试",
  PLAN_NOT_FOUND: "修复方案不存在或已被删除",
  PLAN_LOCKED: "方案已批准，不能再修改修复方法或风险说明",
  PLAN_NOT_SUBMITTED: "只有待审批状态的方案才能执行审批",
  PLAN_STATE_INVALID: "当前方案状态不允许该操作",
  REJECT_REASON_REQUIRED: "驳回时必须填写驳回原因",
  DAMAGE_NOT_FOUND: "关联的病害记录不存在",
  DAMAGE_IN_RESTORATION: "该病害已进入修复，不能再生成新的修复方案"
};
