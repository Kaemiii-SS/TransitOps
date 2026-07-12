import { Router } from "express";
import {
  createDriver,
  getDrivers,
  getAvailableDrivers,
  getDriverById,
  updateDriver,
  deleteDriver,
} from "../controllers/driver.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router();

router.use(verifyJWT);
router.use(authorizeRoles("FLEET_MANAGER", "SAFETY_OFFICER"));

router.get("/available", getAvailableDrivers);
router.get("/", getDrivers);
router.get("/:id", getDriverById);
router.post("/", createDriver);
router.patch("/:id", updateDriver);
router.delete("/:id", deleteDriver);

export default router;