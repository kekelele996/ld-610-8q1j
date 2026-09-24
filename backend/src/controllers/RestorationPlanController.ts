import type { NextFunction, Request, Response } from "express";
import { restorationPlanService } from "../services/RestorationPlanService";

const actorOf = (req: Request): string => {
  const user = (req as unknown as { user?: { id?: number; role?: string } }).user;
  return String(req.body?.approver ?? req.body?.operator ?? `${user?.role ?? "user"}-${user?.id ?? 0}`);
};

export const restorationPlanController = {
  list: (_req: Request, res: Response) => res.json(restorationPlanService.list()),
  create: (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(201).json(restorationPlanService.create(req.body));
    } catch (err) {
      next(err);
    }
  },
  update: (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(restorationPlanService.update(Number(req.params.id), req.body));
    } catch (err) {
      next(err);
    }
  },
  submit: (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(restorationPlanService.submit(Number(req.params.id)));
    } catch (err) {
      next(err);
    }
  },
  approve: (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(restorationPlanService.approve(Number(req.params.id), actorOf(req)));
    } catch (err) {
      next(err);
    }
  },
  reject: (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(restorationPlanService.reject(Number(req.params.id), String(req.body?.reason ?? ""), actorOf(req)));
    } catch (err) {
      next(err);
    }
  }
};
