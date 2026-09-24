import type { UserRole } from "../constants/UserRole";

export type CurrentUser = {
  id: number;
  name: string;
  role: UserRole;
};

export type PlanDecisionPayload = {
  reason?: string;
  reviewer_name?: string;
};
