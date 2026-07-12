import prisma from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getDashboardKPIs = asyncHandler(async (req, res) => {
  const { type, status, region } = req.query;

  const vehicleWhere = {};
  if (type) vehicleWhere.type = type;
  if (region) vehicleWhere.region = region;
  if (status) vehicleWhere.status = status;

  const [
    activeVehicles,
    availableVehicles,
    vehiclesInMaintenance,
    activeTrips,
    pendingTrips,
    driversOnDuty,
    vehiclesOnTrip,
  ] = await Promise.all([
    prisma.vehicle.count({ where: { ...vehicleWhere, status: { not: "RETIRED" } } }),
    prisma.vehicle.count({ where: { ...vehicleWhere, status: "AVAILABLE" } }),
    prisma.vehicle.count({ where: { ...vehicleWhere, status: "IN_SHOP" } }),
    prisma.trip.count({ where: { status: "DISPATCHED" } }),
    prisma.trip.count({ where: { status: "DRAFT" } }),
    prisma.driver.count({ where: { status: { in: ["AVAILABLE", "ON_TRIP"] } } }),
    prisma.vehicle.count({ where: { ...vehicleWhere, status: "ON_TRIP" } }),
  ]);

  const fleetUtilizationPercent = activeVehicles > 0 ? Number(((vehiclesOnTrip / activeVehicles) * 100).toFixed(2)) : 0;

  return res.status(200).json(
    new ApiResponse(200, {
      activeVehicles,
      availableVehicles,
      vehiclesInMaintenance,
      activeTrips,
      pendingTrips,
      driversOnDuty,
      fleetUtilizationPercent,
    }, "Dashboard KPIs fetched successfully")
  );
});

export { getDashboardKPIs };