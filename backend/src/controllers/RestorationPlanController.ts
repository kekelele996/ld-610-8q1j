import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { DomainError } from "../utils/errors";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { restorationPlanService, type Actor } from "../services/RestorationPlanService";
import type { PlanApprovalPayload } from "../types/PlanApprovalPayload";
import type { PlanRejectPayload } from "../types/PlanRejectPayload";

const resolveActor = (req: Request): Actor =>
  req.user ?? { id: 0, name: "未知用户", role: "RESTORER" };

const resolveReviewer = (req: Request, body: PlanApprovalPayload | PlanRejectPayload): string =>
  String(body.reviewer_name ?? req.user?.name ?? "专家").trim() || ERROR_MESSAGES.AUTH_REQUIRED;

export const restorationPlanController = {
  list: asyncHandler((_req: Request, res: Response) => {
    res.json(restorationPlanService.list());
  }),

  create: asyncHandler((req: Request, res: Response) => {
    try {
      res.status(201).json(restorationPlanService.create(req.body, resolveActor(req)));
    } catch (error) {
      if (error instanceof DomainError) throw error;
      throw new DomainError("VALIDATION_FAILED");
    }
  }),

  update: asyncHandler((req: Request, res: Response) => {
    try {
      res.json(restorationPlanService.update(Number(req.params.id), req.body));
    } catch (error) {
      if (error instanceof DomainError) throw error;
      throw new DomainError("VALIDATION_FAILED");
    }
  }),

  submit: asyncHandler((req: Request, res: Response) => {
    res.json(restorationPlanService.submit(Number(req.params.id)));
  }),

  approve: asyncHandler((req: Request, res: Response) => {
    res.json(restorationPlanService.approve(Number(req.params.id), resolveReviewer(req, req.body as PlanApprovalPayload)));
  }),

  reject: asyncHandler((req: Request, res: Response) => {
    const body = req.body as PlanRejectPayload;
    res.status(202).json(
      restorationPlanService.reject(Number(req.params.id), String(body.reason ?? ""), resolveReviewer(req, body))
    );
  })
};
