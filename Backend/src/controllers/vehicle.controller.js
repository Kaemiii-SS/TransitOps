import prisma from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const VALID_STATUSES = ["AVAILABLE", "ON_TRIP", "IN_SHOP", "RETIRED"];

const createVehicle = asyncHandler(async (req, res) => {
  const { registrationNumber, nameModel, type, maxLoadCapacity, odometer, acquisitionCost, region } = req.body;

  if (!registrationNumber || !nameModel || !type || !maxLoadCapacity || !acquisitionCost) {
    throw new ApiError(400, "registrationNumber, nameModel, type, maxLoadCapacity, and acquisitionCost are required");
  }

  const existing = await prisma.vehicle.findUnique({ where: { registrationNumber } });
  if (existing) {
    throw new ApiError(409, "A vehicle with this registration number already exists");
  }

  const vehicle = await prisma.vehicle.create({
    data: {
      registrationNumber,
      nameModel,
      type,
      maxLoadCapacity: Number(maxLoadCapacity),
      odometer: odometer ? Number(odometer) : 0,
      acquisitionCost: Number(acquisitionCost),
      region: region || null,
    },
  });

  return res.status(201).json(new ApiResponse(201, vehicle, "Vehicle registered successfully"));
});

// GET /vehicles?type=Van&status=AVAILABLE&region=West
const getVehicles = asyncHandler(async (req, res) => {
  const { type, status, region } = req.query;

  const where = {};
  if (type) where.type = type;
  if (region) where.region = region;
  if (status) {
    if (!VALID_STATUSES.includes(status)) {
      throw new ApiError(400, `status must be one of: ${VALID_STATUSES.join(", ")}`);
    }
    where.status = status;
  }

  const vehicles = await prisma.vehicle.findMany({ where, orderBy: { id: "asc" } });

  return res.status(200).json(new ApiResponse(200, vehicles, "Vehicles fetched successfully"));
});

// Used by Trip Management (Step 7) — excludes RETIRED/IN_SHOP per PDF rule
const getAvailableVehicles = asyncHandler(async (req, res) => {
  const vehicles = await prisma.vehicle.findMany({
    where: { status: "AVAILABLE" },
    orderBy: { id: "asc" },
  });

  return res.status(200).json(new ApiResponse(200, vehicles, "Available vehicles fetched successfully"));
});

const getVehicleById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const vehicle = await prisma.vehicle.findUnique({ where: { id: Number(id) } });
  if (!vehicle) {
    throw new ApiError(404, "Vehicle not found");
  }

  return res.status(200).json(new ApiResponse(200, vehicle, "Vehicle fetched successfully"));
});

const updateVehicle = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { nameModel, type, maxLoadCapacity, odometer, acquisitionCost, status, region } = req.body;

  const vehicle = await prisma.vehicle.findUnique({ where: { id: Number(id) } });
  if (!vehicle) {
    throw new ApiError(404, "Vehicle not found");
  }

  if (status && !VALID_STATUSES.includes(status)) {
    throw new ApiError(400, `status must be one of: ${VALID_STATUSES.join(", ")}`);
  }

  const updated = await prisma.vehicle.update({
    where: { id: Number(id) },
    data: {
      ...(nameModel && { nameModel }),
      ...(type && { type }),
      ...(maxLoadCapacity && { maxLoadCapacity: Number(maxLoadCapacity) }),
      ...(odometer !== undefined && { odometer: Number(odometer) }),
      ...(acquisitionCost && { acquisitionCost: Number(acquisitionCost) }),
      ...(status && { status }),
      ...(region !== undefined && { region }),
    },
  });

  return res.status(200).json(new ApiResponse(200, updated, "Vehicle updated successfully"));
});

const deleteVehicle = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const vehicle = await prisma.vehicle.findUnique({ where: { id: Number(id) } });
  if (!vehicle) {
    throw new ApiError(404, "Vehicle not found");
  }

  await prisma.vehicle.delete({ where: { id: Number(id) } });

  return res.status(200).json(new ApiResponse(200, {}, "Vehicle deleted successfully"));
});

export { createVehicle, getVehicles, getAvailableVehicles, getVehicleById, updateVehicle, deleteVehicle };