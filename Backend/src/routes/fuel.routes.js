import { Router } from "express";
import { createFuelLog, getFuelLogs, getFuelLogById, deleteFuelLog } from "../controllers/fuel.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router();

router.use(verifyJWT);
router.use(authorizeRoles("FINANCIAL_ANALYST"));

router.get("/", getFuelLogs);
router.get("/:id", getFuelLogById);
router.post("/", createFuelLog);
router.delete("/:id", deleteFuelLog);

export default router;