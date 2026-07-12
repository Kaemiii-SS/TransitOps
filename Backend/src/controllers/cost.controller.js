import prisma from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getVehicleOperationalCost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const vehicle = await prisma.vehicle.findUnique({ where: { id: Number(id) } });
  if (!vehicle) throw new ApiError(404, "Vehicle not found");

  const [maintenanceTotal, fuelTotal, expenseTotal] = await Promise.all([
    prisma.maintenanceLog.aggregate({ where: { vehicleId: vehicle.id }, _sum: { cost: true } }),
    prisma.fuelLog.aggregate({ where: { vehicleId: vehicle.id }, _sum: { cost: true } }),
    prisma.expense.aggregate({ where: { vehicleId: vehicle.id }, _sum: { amount: true } }),
  ]);

  const breakdown = {
    acquisitionCost: vehicle.acquisitionCost,
    maintenanceCost: maintenanceTotal._sum.cost || 0,
    fuelCost: fuelTotal._sum.cost || 0,
    expenseCost: expenseTotal._sum.amount || 0,
  };

  const totalOperationalCost =
    breakdown.acquisitionCost + breakdown.maintenanceCost + breakdown.fuelCost + breakdown.expenseCost;

  return res.status(200).json(
    new ApiResponse(200, { vehicleId: vehicle.id, ...breakdown, totalOperationalCost }, "Operational cost calculated")
  );
});

export { getVehicleOperationalCost };