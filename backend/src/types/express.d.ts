import type { UserRole } from "../constants/UserRole";

export type Actor = { id: number; name: string; role: UserRole };

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: Actor;
    }
  }
}

export {};
