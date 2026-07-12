import { Router } from "express";
import { getVehicleOperationalCost } from "../controllers/cost.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router();

router.use(verifyJWT);
router.get("/:id/cost", authorizeRoles("FLEET_MANAGER", "FINANCIAL_ANALYST"), getVehicleOperationalCost);

export default router;