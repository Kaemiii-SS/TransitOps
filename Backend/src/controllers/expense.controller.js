import prisma from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const VALID_TYPES = ["TOLL", "MAINTENANCE", "OTHER"];

const createExpense = asyncHandler(async (req, res) => {
  const { vehicleId, tripId, type, amount, date, notes } = req.body;

  if (!vehicleId || !type || !amount || !date) {
    throw new ApiError(400, "vehicleId, type, amount, and date are required");
  }

  if (!VALID_TYPES.includes(type)) {
    throw new ApiError(400, `type must be one of: ${VALID_TYPES.join(", ")}`);
  }

  const vehicle = await prisma.vehicle.findUnique({ where: { id: Number(vehicleId) } });
  if (!vehicle) throw new ApiError(404, "Vehicle not found");

  if (tripId) {
    const trip = await prisma.trip.findUnique({ where: { id: Number(tripId) } });
    if (!trip) throw new ApiError(404, "Trip not found");
  }

  const expense = await prisma.expense.create({
    data: {
      vehicleId: Number(vehicleId),
      tripId: tripId ? Number(tripId) : null,
      type,
      amount: Number(amount),
      date: new Date(date),
      notes: notes || null,
    },
  });

  return res.status(201).json(new ApiResponse(201, expense, "Expense recorded successfully"));
});

const getExpenses = asyncHandler(async (req, res) => {
  const { vehicleId, tripId, type } = req.query;

  const where = {};
  if (vehicleId) where.vehicleId = Number(vehicleId);
  if (tripId) where.tripId = Number(tripId);
  if (type) {
    if (!VALID_TYPES.includes(type)) {
      throw new ApiError(400, `type must be one of: ${VALID_TYPES.join(", ")}`);
    }
    where.type = type;
  }

  const expenses = await prisma.expense.findMany({
    where,
    orderBy: { date: "desc" },
    include: { vehicle: true, trip: true },
  });

  return res.status(200).json(new ApiResponse(200, expenses, "Expenses fetched successfully"));
});

const getExpenseById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const expense = await prisma.expense.findUnique({
    where: { id: Number(id) },
    include: { vehicle: true, trip: true },
  });
  if (!expense) throw new ApiError(404, "Expense not found");

  return res.status(200).json(new ApiResponse(200, expense, "Expense fetched successfully"));
});

const deleteExpense = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const expense = await prisma.expense.findUnique({ where: { id: Number(id) } });
  if (!expense) throw new ApiError(404, "Expense not found");

  await prisma.expense.delete({ where: { id: Number(id) } });

  return res.status(200).json(new ApiResponse(200, {}, "Expense deleted successfully"));
});

export { createExpense, getExpenses, getExpenseById, deleteExpense };