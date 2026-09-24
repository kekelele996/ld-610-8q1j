import { Router } from "express";
import { restorationPlanController } from "../controllers/RestorationPlanController";
import { rbacMiddleware } from "../middlewares/rbacMiddleware";

const router = Router();

router.get("/", restorationPlanController.list);
router.post("/", restorationPlanController.create);
router.patch("/:id", restorationPlanController.update);
router.post("/:id/submit", restorationPlanController.submit);
// 只有专家角色可以批准/驳回方案。
router.post("/:id/approve", rbacMiddleware(["EXPERT"]), restorationPlanController.approve);
router.post("/:id/reject", rbacMiddleware(["EXPERT"]), restorationPlanController.reject);

export default router;
