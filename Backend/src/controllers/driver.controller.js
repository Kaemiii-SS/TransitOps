import prisma from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const VALID_STATUSES = ["AVAILABLE", "ON_TRIP", "OFF_DUTY", "SUSPENDED"];

const createDriver = asyncHandler(async (req, res) => {
  const { name, licenseNumber, licenseCategory, licenseExpiryDate, contactNumber, safetyScore } = req.body;

  if (!name || !licenseNumber || !licenseCategory || !licenseExpiryDate || !contactNumber) {
    throw new ApiError(400, "name, licenseNumber, licenseCategory, licenseExpiryDate, and contactNumber are required");
  }

  const existing = await prisma.driver.findUnique({ where: { licenseNumber } });
  if (existing) {
    throw new ApiError(409, "A driver with this license number already exists");
  }

  const driver = await prisma.driver.create({
    data: {
      name,
      licenseNumber,
      licenseCategory,
      licenseExpiryDate: new Date(licenseExpiryDate),
      contactNumber,
      safetyScore: safetyScore !== undefined ? Number(safetyScore) : 100,
    },
  });

  return res.status(201).json(new ApiResponse(201, driver, "Driver registered successfully"));
});

const getDrivers = asyncHandler(async (req, res) => {
  const { status, licenseCategory } = req.query;

  const where = {};
  if (licenseCategory) where.licenseCategory = licenseCategory;
  if (status) {
    if (!VALID_STATUSES.includes(status)) {
      throw new ApiError(400, `status must be one of: ${VALID_STATUSES.join(", ")}`);
    }
    where.status = status;
  }

  const drivers = await prisma.driver.findMany({ where, orderBy: { id: "asc" } });

  return res.status(200).json(new ApiResponse(200, drivers, "Drivers fetched successfully"));
});

const getAvailableDrivers = asyncHandler(async (req, res) => {
  const drivers = await prisma.driver.findMany({
    where: { status: "AVAILABLE" },
    orderBy: { id: "asc" },
  });

  return res.status(200).json(new ApiResponse(200, drivers, "Available drivers fetched successfully"));
});

const getDriverById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const driver = await prisma.driver.findUnique({ where: { id: Number(id) } });
  if (!driver) {
    throw new ApiError(404, "Driver not found");
  }

  return res.status(200).json(new ApiResponse(200, driver, "Driver fetched successfully"));
});

const updateDriver = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, licenseCategory, licenseExpiryDate, contactNumber, safetyScore, status } = req.body;

  const driver = await prisma.driver.findUnique({ where: { id: Number(id) } });
  if (!driver) {
    throw new ApiError(404, "Driver not found");
  }

  if (status && !VALID_STATUSES.includes(status)) {
    throw new ApiError(400, `status must be one of: ${VALID_STATUSES.join(", ")}`);
  }

  const updated = await prisma.driver.update({
    where: { id: Number(id) },
    data: {
      ...(name && { name }),
      ...(licenseCategory && { licenseCategory }),
      ...(licenseExpiryDate && { licenseExpiryDate: new Date(licenseExpiryDate) }),
      ...(contactNumber && { contactNumber }),
      ...(safetyScore !== undefined && { safetyScore: Number(safetyScore) }),
      ...(status && { status }),
    },
  });

  return res.status(200).json(new ApiResponse(200, updated, "Driver updated successfully"));
});

const deleteDriver = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const driver = await prisma.driver.findUnique({ where: { id: Number(id) } });
  if (!driver) {
    throw new ApiError(404, "Driver not found");
  }

  await prisma.driver.delete({ where: { id: Number(id) } });

  return res.status(200).json(new ApiResponse(200, {}, "Driver deleted successfully"));
});

export { createDriver, getDrivers, getAvailableDrivers, getDriverById, updateDriver, deleteDriver };