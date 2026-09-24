import type { CurrentUser } from "../types/PlanDecision";

const DEFAULT_USER: CurrentUser = { id: 1, name: "修复师甲", role: "RESTORER" };

// 极简当前用户上下文：由角色切换器写入，请求层读取并转成鉴权请求头。
let currentUser: CurrentUser = DEFAULT_USER;
const listeners = new Set<() => void>();

export const getCurrentUser = () => currentUser;

export const setCurrentUser = (next: CurrentUser) => {
  currentUser = next;
  listeners.forEach((listener) => listener());
};

export const subscribeCurrentUser = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
