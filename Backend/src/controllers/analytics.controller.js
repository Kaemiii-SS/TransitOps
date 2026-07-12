import prisma from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const computeOperationalCost = async (vehicleId) => {
  const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
  if (!vehicle) return null;

  const [maintenanceTotal, fuelTotal, expenseTotal] = await Promise.all([
    prisma.maintenanceLog.aggregate({ where: { vehicleId }, _sum: { cost: true } }),
    prisma.fuelLog.aggregate({ where: { vehicleId }, _sum: { cost: true } }),
    prisma.expense.aggregate({ where: { vehicleId }, _sum: { amount: true } }),
  ]);

  return (
    vehicle.acquisitionCost +
    (maintenanceTotal._sum.cost || 0) +
    (fuelTotal._sum.cost || 0) +
    (expenseTotal._sum.amount || 0)
  );
};

const getFleetUtilization = asyncHandler(async (req, res) => {
  const [onTripCount, activeFleetCount] = await Promise.all([
    prisma.vehicle.count({ where: { status: "ON_TRIP" } }),
    prisma.vehicle.count({ where: { status: { not: "RETIRED" } } }),
  ]);

  const utilizationPercent = activeFleetCount > 0 ? (onTripCount / activeFleetCount) * 100 : 0;

  return res.status(200).json(
    new ApiResponse(200, {
      vehiclesOnTrip: onTripCount,
      activeFleetSize: activeFleetCount,
      utilizationPercent: Number(utilizationPercent.toFixed(2)),
    }, "Fleet utilization calculated")
  );
});

const getVehicleFuelEfficiency = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const vehicleId = Number(id);

  const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
  if (!vehicle) throw new ApiError(404, "Vehicle not found");

  const [distanceTotal, fuelTotal] = await Promise.all([
    prisma.trip.aggregate({
      where: { vehicleId, status: "COMPLETED" },
      _sum: { actualDistance: true },
    }),
    prisma.fuelLog.aggregate({ where: { vehicleId }, _sum: { liters: true } }),
  ]);

  const totalDistance = distanceTotal._sum.actualDistance || 0;
  const totalLiters = fuelTotal._sum.liters || 0;
  const kmPerLiter = totalLiters > 0 ? totalDistance / totalLiters : null;

  return res.status(200).json(
    new ApiResponse(200, {
      vehicleId,
      totalDistance,
      totalLiters,
      kmPerLiter: kmPerLiter !== null ? Number(kmPerLiter.toFixed(2)) : null,
    }, "Fuel efficiency calculated")
  );
});

const getVehicleROI = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const vehicleId = Number(id);

  const totalOperationalCost = await computeOperationalCost(vehicleId);
  if (totalOperationalCost === null) throw new ApiError(404, "Vehicle not found");

  const revenueTotal = await prisma.trip.aggregate({
    where: { vehicleId, status: "COMPLETED" },
    _sum: { revenue: true },
  });

  const totalRevenue = revenueTotal._sum.revenue || 0;
  const roiPercent = totalOperationalCost > 0 ? ((totalRevenue - totalOperationalCost) / totalOperationalCost) * 100 : null;

  return res.status(200).json(
    new ApiResponse(200, {
      vehicleId,
      totalRevenue,
      totalOperationalCost,
      roiPercent: roiPercent !== null ? Number(roiPercent.toFixed(2)) : null,
    }, "ROI calculated")
  );
});

const exportFleetCSV = asyncHandler(async (req, res) => {
  const vehicles = await prisma.vehicle.findMany({ orderBy: { id: "asc" } });

  const rows = await Promise.all(
    vehicles.map(async (vehicle) => {
      const totalOperationalCost = await computeOperationalCost(vehicle.id);

      const revenueTotal = await prisma.trip.aggregate({
        where: { vehicleId: vehicle.id, status: "COMPLETED" },
        _sum: { revenue: true },
      });
      const totalRevenue = revenueTotal._sum.revenue || 0;
      const roiPercent = totalOperationalCost > 0 ? ((totalRevenue - totalOperationalCost) / totalOperationalCost) * 100 : "";

      return [
        vehicle.id,
        vehicle.registrationNumber,
        vehicle.type,
        vehicle.status,
        vehicle.region || "",
        totalOperationalCost,
        totalRevenue,
        roiPercent === "" ? "" : roiPercent.toFixed(2),
      ];
    })
  );

  const header = ["id", "registrationNumber", "type", "status", "region", "totalOperationalCost", "totalRevenue", "roiPercent"];
  const csvLines = [header.join(","), ...rows.map((row) => row.join(","))];
  const csv = csvLines.join("\n");

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=fleet-report.csv");
  return res.status(200).send(csv);
});

export { getFleetUtilization, getVehicleFuelEfficiency, getVehicleROI, exportFleetCSV };