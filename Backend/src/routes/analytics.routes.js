import { Router } from "express";
import {
  getFleetUtilization,
  getVehicleFuelEfficiency,
  getVehicleROI,
  exportFleetCSV,
} from "../controllers/analytics.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router();

router.use(verifyJWT);
router.use(authorizeRoles("FLEET_MANAGER", "FINANCIAL_ANALYST", "SAFETY_OFFICER"));

router.get("/fleet-utilization", getFleetUtilization);
router.get("/vehicles/:id/fuel-efficiency", getVehicleFuelEfficiency);
router.get("/vehicles/:id/roi", getVehicleROI);
router.get("/export/csv", exportFleetCSV);

export default router;