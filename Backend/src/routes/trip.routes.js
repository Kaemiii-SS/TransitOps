import { Router } from "express";
import {
  createTrip,
  getTrips,
  getTripById,
  dispatchTrip,
  completeTrip,
  cancelTrip,
} from "../controllers/trip.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router();

router.use(verifyJWT);

router.get("/", authorizeRoles("DISPATCHER", "SAFETY_OFFICER"), getTrips);
router.get("/:id", authorizeRoles("DISPATCHER", "SAFETY_OFFICER"), getTripById);
router.post("/", authorizeRoles("DISPATCHER"), createTrip);
router.patch("/:id/dispatch", authorizeRoles("DISPATCHER"), dispatchTrip);
router.patch("/:id/complete", authorizeRoles("DISPATCHER"), completeTrip);
router.patch("/:id/cancel", authorizeRoles("DISPATCHER"), cancelTrip);

export default router;