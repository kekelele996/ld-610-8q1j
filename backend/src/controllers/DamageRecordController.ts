import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { DomainError } from "../utils/errors";
import { damageRecordService } from "../services/DamageRecordService";
import { DamageStatus } from "../constants/DamageStatus";
import type { DamageStatusPayload } from "../types/DamageStatusPayload";

export const damageRecordController = {
  list: asyncHandler((_req: Request, res: Response) => {
    res.json(damageRecordService.list());
  }),

  create: asyncHandler((req: Request, res: Response) => {
    try {
      res.status(201).json(damageRecordService.create(req.body));
    } catch (error) {
      if (error instanceof DomainError) throw error;
      throw new DomainError("VALIDATION_FAILED");
    }
  }),

  updateStatus: asyncHandler((req: Request, res: Response) => {
    const { status } = req.body as DamageStatusPayload;
    if (!status || !(DamageStatus as readonly string[]).includes(status)) {
      throw new DomainError("VALIDATION_FAILED");
    }
    res.json(damageRecordService.updateStatus(Number(req.params.id), status));
  })
};
