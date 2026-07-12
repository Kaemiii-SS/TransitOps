import prisma from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createMaintenanceLog = asyncHandler(async (req, res) => {
  const { vehicleId, description, cost } = req.body;

  if (!vehicleId || !description || cost === undefined) {
    throw new ApiError(400, "vehicleId, description, and cost are required");
  }

  const vehicle = await prisma.vehicle.findUnique({ where: { id: Number(vehicleId) } });
  if (!vehicle) throw new ApiError(404, "Vehicle not found");

  if (vehicle.status === "ON_TRIP") {
    throw new ApiError(400, "Cannot open a maintenance record while the vehicle is on a trip");
  }

  if (vehicle.status === "IN_SHOP") {
    throw new ApiError(400, "Vehicle already has an active maintenance record");
  }

  const [log] = await prisma.$transaction([
    prisma.maintenanceLog.create({
      data: {
        vehicleId: Number(vehicleId),
        description,
        cost: Number(cost),
      },
    }),
    prisma.vehicle.update({
      where: { id: Number(vehicleId) },
      data: { status: "IN_SHOP" },
    }),
  ]);

  return res.status(201).json(new ApiResponse(201, log, "Maintenance record opened; vehicle moved to IN_SHOP"));
});

const getMaintenanceLogs = asyncHandler(async (req, res) => {
  const { status, vehicleId } = req.query;

  const where = {};
  if (vehicleId) where.vehicleId = Number(vehicleId);
  if (status) {
    if (!["ACTIVE", "CLOSED"].includes(status)) {
      throw new ApiError(400, "status must be one of: ACTIVE, CLOSED");
    }
    where.status = status;
  }

  const logs = await prisma.maintenanceLog.findMany({
    where,
    orderBy: { id: "asc" },
    include: { vehicle: true },
  });

  return res.status(200).json(new ApiResponse(200, logs, "Maintenance logs fetched successfully"));
});

const getMaintenanceLogById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const log = await prisma.maintenanceLog.findUnique({
    where: { id: Number(id) },
    include: { vehicle: true },
  });
  if (!log) throw new ApiError(404, "Maintenance record not found");

  return res.status(200).json(new ApiResponse(200, log, "Maintenance record fetched successfully"));
});

const closeMaintenanceLog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const log = await prisma.maintenanceLog.findUnique({
    where: { id: Number(id) },
    include: { vehicle: true },
  });
  if (!log) throw new ApiError(404, "Maintenance record not found");

  if (log.status !== "ACTIVE") {
    throw new ApiError(400, "Only ACTIVE maintenance records can be closed");
  }

  const nextVehicleStatus = log.vehicle.status === "RETIRED" ? "RETIRED" : "AVAILABLE";

  const [updatedLog] = await prisma.$transaction([
    prisma.maintenanceLog.update({
      where: { id: log.id },
      data: { status: "CLOSED", closedAt: new Date() },
    }),
    prisma.vehicle.update({
      where: { id: log.vehicleId },
      data: { status: nextVehicleStatus },
    }),
  ]);

  return res.status(200).json(new ApiResponse(200, updatedLog, "Maintenance record closed"));
});

export { createMaintenanceLog, getMaintenanceLogs, getMaintenanceLogById, closeMaintenanceLog };