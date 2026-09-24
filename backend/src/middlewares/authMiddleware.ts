import type { RequestHandler } from "express";
import { UserRole, type UserRole as Role } from "../constants/UserRole";

const normalizeRole = (value: string | undefined): Role =>
  (UserRole as readonly string[]).includes(value ?? "") ? (value as Role) : UserRole[0];

export const authMiddleware: RequestHandler = (req, _res, next) => {
  const role = normalizeRole(req.header("x-role"));
  req.user = {
    id: Number(req.header("x-user-id") ?? 1),
    name: req.header("x-user-name") ?? "修复师甲",
    role
  };
  next();
};
