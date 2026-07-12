import prisma from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createTrip = asyncHandler(async (req, res) => {
  const { source, destination, vehicleId, driverId, cargoWeight, plannedDistance } = req.body;

  if (!source || !destination || !vehicleId || !driverId || !cargoWeight || !plannedDistance) {
    throw new ApiError(400, "source, destination, vehicleId, driverId, cargoWeight, and plannedDistance are required");
  }

  const vehicle = await prisma.vehicle.findUnique({ where: { id: Number(vehicleId) } });
  if (!vehicle) throw new ApiError(404, "Vehicle not found");

  const driver = await prisma.driver.findUnique({ where: { id: Number(driverId) } });
  if (!driver) throw new ApiError(404, "Driver not found");

  const trip = await prisma.trip.create({
    data: {
      source,
      destination,
      vehicleId: Number(vehicleId),
      driverId: Number(driverId),
      cargoWeight: Number(cargoWeight),
      plannedDistance: Number(plannedDistance),
    },
  });

  return res.status(201).json(new ApiResponse(201, trip, "Trip created as draft"));
});

const getTrips = asyncHandler(async (req, res) => {
  const { status } = req.query;

  const where = {};
  if (status) {
    const VALID_STATUSES = ["DRAFT", "DISPATCHED", "COMPLETED", "CANCELLED"];
    if (!VALID_STATUSES.includes(status)) {
      throw new ApiError(400, `status must be one of: ${VALID_STATUSES.join(", ")}`);
    }
    where.status = status;
  }

  const trips = await prisma.trip.findMany({
    where,
    orderBy: { id: "asc" },
    include: { vehicle: true, driver: true },
  });

  return res.status(200).json(new ApiResponse(200, trips, "Trips fetched successfully"));
});

const getTripById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const trip = await prisma.trip.findUnique({
    where: { id: Number(id) },
    include: { vehicle: true, driver: true },
  });
  if (!trip) throw new ApiError(404, "Trip not found");

  return res.status(200).json(new ApiResponse(200, trip, "Trip fetched successfully"));
});

const dispatchTrip = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const trip = await prisma.trip.findUnique({
    where: { id: Number(id) },
    include: { vehicle: true, driver: true },
  });
  if (!trip) throw new ApiError(404, "Trip not found");

  if (trip.status !== "DRAFT") {
    throw new ApiError(400, `Cannot dispatch a trip with status ${trip.status}; only DRAFT trips can be dispatched`);
  }

  if (trip.cargoWeight > trip.vehicle.maxLoadCapacity) {
    throw new ApiError(400, "Cargo weight exceeds vehicle's max load capacity");
  }

  if (trip.vehicle.status !== "AVAILABLE") {
    throw new ApiError(400, `Vehicle is not available (current status: ${trip.vehicle.status})`);
  }

  if (trip.driver.status !== "AVAILABLE") {
    throw new ApiError(400, `Driver is not available (current status: ${trip.driver.status})`);
  }

  if (trip.driver.status === "SUSPENDED") {
    throw new ApiError(400, "Driver is suspended and cannot be dispatched");
  }

  if (new Date(trip.driver.licenseExpiryDate) < new Date()) {
    throw new ApiError(400, "Driver's license has expired and cannot be dispatched");
  }

  const [updatedTrip] = await prisma.$transaction([
    prisma.trip.update({
      where: { id: trip.id },
      data: { status: "DISPATCHED", dispatchedAt: new Date() },
    }),
    prisma.vehicle.update({
      where: { id: trip.vehicleId },
      data: { status: "ON_TRIP" },
    }),
    prisma.driver.update({
      where: { id: trip.driverId },
      data: { status: "ON_TRIP" },
    }),
  ]);

  return res.status(200).json(new ApiResponse(200, updatedTrip, "Trip dispatched successfully"));
});

const completeTrip = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { actualDistance, fuelConsumed, revenue } = req.body;

  const trip = await prisma.trip.findUnique({ where: { id: Number(id) } });
  if (!trip) throw new ApiError(404, "Trip not found");

  if (trip.status !== "DISPATCHED") {
    throw new ApiError(400, `Cannot complete a trip with status ${trip.status}; only DISPATCHED trips can be completed`);
  }

  const [updatedTrip] = await prisma.$transaction([
    prisma.trip.update({
      where: { id: trip.id },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
        ...(actualDistance !== undefined && { actualDistance: Number(actualDistance) }),
        ...(fuelConsumed !== undefined && { fuelConsumed: Number(fuelConsumed) }),
        ...(revenue !== undefined && { revenue: Number(revenue) }),
      },
    }),
    prisma.vehicle.update({
      where: { id: trip.vehicleId },
      data: { status: "AVAILABLE" },
    }),
    prisma.driver.update({
      where: { id: trip.driverId },
      data: { status: "AVAILABLE" },
    }),
  ]);

  return res.status(200).json(new ApiResponse(200, updatedTrip, "Trip completed successfully"));
});

const cancelTrip = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const trip = await prisma.trip.findUnique({ where: { id: Number(id) } });
  if (!trip) throw new ApiError(404, "Trip not found");

  if (trip.status !== "DISPATCHED" && trip.status !== "DRAFT") {
    throw new ApiError(400, `Cannot cancel a trip with status ${trip.status}`);
  }

  const wasDispatched = trip.status === "DISPATCHED";

  const operations = [
    prisma.trip.update({
      where: { id: trip.id },
      data: { status: "CANCELLED" },
    }),
  ];

  if (wasDispatched) {
    operations.push(
      prisma.vehicle.update({ where: { id: trip.vehicleId }, data: { status: "AVAILABLE" } }),
      prisma.driver.update({ where: { id: trip.driverId }, data: { status: "AVAILABLE" } })
    );
  }

  const [updatedTrip] = await prisma.$transaction(operations);

  return res.status(200).json(new ApiResponse(200, updatedTrip, "Trip cancelled successfully"));
});

export { createTrip, getTrips, getTripById, dispatchTrip, completeTrip, cancelTrip };