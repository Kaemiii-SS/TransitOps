import prisma from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createFuelLog = asyncHandler(async (req, res) => {
  const { vehicleId, tripId, liters, cost, date } = req.body;

  if (!vehicleId || !liters || !cost || !date) {
    throw new ApiError(400, "vehicleId, liters, cost, and date are required");
  }

  const vehicle = await prisma.vehicle.findUnique({ where: { id: Number(vehicleId) } });
  if (!vehicle) throw new ApiError(404, "Vehicle not found");

  if (tripId) {
    const trip = await prisma.trip.findUnique({ where: { id: Number(tripId) } });
    if (!trip) throw new ApiError(404, "Trip not found");
  }

  const fuelLog = await prisma.fuelLog.create({
    data: {
      vehicleId: Number(vehicleId),
      tripId: tripId ? Number(tripId) : null,
      liters: Number(liters),
      cost: Number(cost),
      date: new Date(date),
    },
  });

  return res.status(201).json(new ApiResponse(201, fuelLog, "Fuel log recorded successfully"));
});

const getFuelLogs = asyncHandler(async (req, res) => {
  const { vehicleId, tripId } = req.query;

  const where = {};
  if (vehicleId) where.vehicleId = Number(vehicleId);
  if (tripId) where.tripId = Number(tripId);

  const logs = await prisma.fuelLog.findMany({
    where,
    orderBy: { date: "desc" },
    include: { vehicle: true, trip: true },
  });

  return res.status(200).json(new ApiResponse(200, logs, "Fuel logs fetched successfully"));
});

const getFuelLogById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const log = await prisma.fuelLog.findUnique({
    where: { id: Number(id) },
    include: { vehicle: true, trip: true },
  });
  if (!log) throw new ApiError(404, "Fuel log not found");

  return res.status(200).json(new ApiResponse(200, log, "Fuel log fetched successfully"));
});

const deleteFuelLog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const log = await prisma.fuelLog.findUnique({ where: { id: Number(id) } });
  if (!log) throw new ApiError(404, "Fuel log not found");

  await prisma.fuelLog.delete({ where: { id: Number(id) } });

  return res.status(200).json(new ApiResponse(200, {}, "Fuel log deleted successfully"));
});

export { createFuelLog, getFuelLogs, getFuelLogById, deleteFuelLog };