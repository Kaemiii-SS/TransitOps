import { Router } from "express";
import {
  createVehicle,
  getVehicles,
  getAvailableVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
} from "../controllers/vehicle.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router();

router.use(verifyJWT); // every vehicle route requires login

router.get("/available", authorizeRoles("FLEET_MANAGER", "DISPATCHER"), getAvailableVehicles);
router.get("/", authorizeRoles("FLEET_MANAGER", "DISPATCHER", "FINANCIAL_ANALYST"), getVehicles);
router.get("/:id", authorizeRoles("FLEET_MANAGER", "DISPATCHER", "FINANCIAL_ANALYST"), getVehicleById);
router.post("/", authorizeRoles("FLEET_MANAGER"), createVehicle);
router.patch("/:id", authorizeRoles("FLEET_MANAGER"), updateVehicle);
router.delete("/:id", authorizeRoles("FLEET_MANAGER"), deleteVehicle);

export default router;