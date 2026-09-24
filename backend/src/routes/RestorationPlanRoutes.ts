import { Router } from "express";
import { restorationPlanController } from "../controllers/RestorationPlanController";
import { rbacMiddleware } from "../middlewares/rbacMiddleware";

const router = Router();
router.get("/", restorationPlanController.list);
router.post("/", restorationPlanController.create);
router.patch("/:id", restorationPlanController.update);
router.post("/:id/submit", restorationPlanController.submit);
router.post("/:id/approve", rbacMiddleware(["expert", "admin"]), restorationPlanController.approve);
router.post("/:id/reject", rbacMiddleware(["expert", "admin"]), restorationPlanController.reject);
export default router;
