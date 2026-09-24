export const createPlanDecisionDto = (overrides: { approved_by?: string; approved_at?: string; rejection_reason?: string | null } = {}) => ({
  approved_by: null as string | null,
  approved_at: null as string | null,
  rejection_reason: null as string | null,
  ...overrides
});
