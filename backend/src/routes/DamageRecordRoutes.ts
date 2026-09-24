import { Router } from "express";
import { damageRecordController } from "../controllers/DamageRecordController";

const router = Router();

router.get("/", damageRecordController.list);
router.post("/", damageRecordController.create);
router.patch("/:id/status", damageRecordController.updateStatus);

export default router;
