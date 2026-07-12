import { Router } from "express";
import {
  createMaintenanceLog,
  getMaintenanceLogs,
  getMaintenanceLogById,
  closeMaintenanceLog,
} from "../controllers/maintenance.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router();

router.use(verifyJWT);
router.use(authorizeRoles("FLEET_MANAGER"));

router.get("/", getMaintenanceLogs);
router.get("/:id", getMaintenanceLogById);
router.post("/", createMaintenanceLog);
router.patch("/:id/close", closeMaintenanceLog);

export default router;