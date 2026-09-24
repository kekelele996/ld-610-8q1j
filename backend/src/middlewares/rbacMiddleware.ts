import type { RequestHandler } from "express";
import { DomainError } from "../utils/errors";

export const rbacMiddleware = (roles: string[] = []): RequestHandler => (req, _res, next) => {
  if (roles.length > 0 && (!req.user || !roles.includes(req.user.role))) {
    throw new DomainError("RBAC_DENIED", 403);
  }
  next();
};
