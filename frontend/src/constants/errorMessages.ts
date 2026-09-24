export const ERROR_MESSAGES = {
  AUTH_REQUIRED: "请先登录后再继续操作",
  RBAC_DENIED: "当前角色没有执行该动作的权限",
  VALIDATION_FAILED: "表单字段缺失或格式错误",
  RATE_LIMITED: "请求过于频繁，请稍后再试",
  PLAN_NOT_FOUND: "未找到对应的修复方案",
  PLAN_NOT_SUBMITTED: "只有提交中的方案才能审批",
  PLAN_APPROVAL_REASON_REQUIRED: "驳回时必须填写原因",
  PLAN_LOCKED: "方案已批准，修复方法与风险说明锁定不可修改",
  DAMAGE_NOT_FOUND: "未找到对应的病害记录",
  DAMAGE_ALREADY_IN_RESTORATION: "该病害已进入修复，不能再转成新方案",
  DAMAGE_HAS_PLAN: "该病害已有在途方案，请等待审批结束"
};
