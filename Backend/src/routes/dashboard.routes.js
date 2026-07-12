import { Router } from "express";
import { getDashboardKPIs } from "../controllers/dashboard.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);
router.get("/kpis", getDashboardKPIs);

export default router;