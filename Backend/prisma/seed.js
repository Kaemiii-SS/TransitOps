const { PrismaClient, UserRole, VehicleStatus, DriverStatus, TripStatus, MaintenanceStatus, ExpenseType } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // ---------- Users ----------
  // NOTE: passwordHash values below are placeholders, not real bcrypt hashes.
  // Hashing belongs to the auth/service layer, which is out of scope here.
  const users = await prisma.user.createMany({
    data: [
      { email: "fleet.manager@transitops.in", passwordHash: "REPLACE_WITH_HASH", role: UserRole.FLEET_MANAGER },
      { email: "dispatcher@transitops.in", passwordHash: "REPLACE_WITH_HASH", role: UserRole.DISPATCHER },
      { email: "safety.officer@transitops.in", passwordHash: "REPLACE_WITH_HASH", role: UserRole.SAFETY_OFFICER },
      { email: "financial.analyst@transitops.in", passwordHash: "REPLACE_WITH_HASH", role: UserRole.FINANCIAL_ANALYST },
    ],
  });
  console.log(`Created ${users.count} users`);

  // ---------- Vehicles ----------
  const van05 = await prisma.vehicle.create({
    data: {
      registrationNumber: "GJ01AB4521",
      nameModel: "VAN-05",
      type: "Van",
      maxLoadCapacity: 500,
      odometer: 74000,
      acquisitionCost: 620000,
      status: VehicleStatus.AVAILABLE,
      region: "Gandhinagar",
    },
  });

  const truck11 = await prisma.vehicle.create({
    data: {
      registrationNumber: "GJ01AB9981",
      nameModel: "TRUCK-11",
      type: "Truck",
      maxLoadCapacity: 5000,
      odometer: 182000,
      acquisitionCost: 2450000,
      status: VehicleStatus.ON_TRIP,
      region: "Ahmedabad",
    },
  });

  const mini03 = await prisma.vehicle.create({
    data: {
      registrationNumber: "GJ01AB1120",
      nameModel: "MINI-03",
      type: "Mini",
      maxLoadCapacity: 1000,
      odometer: 66000,
      acquisitionCost: 410000,
      status: VehicleStatus.IN_SHOP,
      region: "Vatva",
    },
  });

  await prisma.vehicle.create({
    data: {
      registrationNumber: "GJ01AB0008",
      nameModel: "VAN-09",
      type: "Van",
      maxLoadCapacity: 750,
      odometer: 241900,
      acquisitionCost: 590000,
      status: VehicleStatus.RETIRED,
      region: "Sanand",
    },
  });

  console.log("Created 4 vehicles");

  // ---------- Drivers ----------
  const alex = await prisma.driver.create({
    data: {
      name: "Alex",
      licenseNumber: "DL-88213",
      licenseCategory: "LMV",
      licenseExpiryDate: new Date("2028-12-01"),
      contactNumber: "9876500000",
      safetyScore: 96,
      status: DriverStatus.AVAILABLE,
    },
  });

  const john = await prisma.driver.create({
    data: {
      name: "John",
      licenseNumber: "DL-44120",
      licenseCategory: "HMV",
      licenseExpiryDate: new Date("2025-03-01"), // expired — intentionally, to exercise the license-expiry rule
      contactNumber: "9822000000",
      safetyScore: 81,
      status: DriverStatus.SUSPENDED,
    },
  });

  const priya = await prisma.driver.create({
    data: {
      name: "Priya",
      licenseNumber: "DL-77031",
      licenseCategory: "LMV",
      licenseExpiryDate: new Date("2027-08-01"),
      contactNumber: "9911000000",
      safetyScore: 99,
      status: DriverStatus.ON_TRIP,
    },
  });

  await prisma.driver.create({
    data: {
      name: "Suresh",
      licenseNumber: "DL-90045",
      licenseCategory: "HMV",
      licenseExpiryDate: new Date("2027-01-01"),
      contactNumber: "9744000000",
      safetyScore: 88,
      status: DriverStatus.OFF_DUTY,
    },
  });

  console.log("Created 4 drivers");

  // ---------- Trips ----------
  const trip1 = await prisma.trip.create({
    data: {
      source: "Gandhinagar Depot",
      destination: "Ahmedabad Hub",
      vehicleId: van05.id,
      driverId: alex.id,
      cargoWeight: 450,
      plannedDistance: 38,
      status: TripStatus.DISPATCHED,
      dispatchedAt: new Date(),
    },
  });

  const trip2 = await prisma.trip.create({
    data: {
      source: "Vatva Industrial Area",
      destination: "Sanand Warehouse",
      vehicleId: truck11.id,
      driverId: john.id,
      cargoWeight: 3000,
      plannedDistance: 52,
      actualDistance: 54,
      fuelConsumed: 12,
      revenue: 9500,
      status: TripStatus.COMPLETED,
      dispatchedAt: new Date(Date.now() - 86400000),
      completedAt: new Date(),
    },
  });

  await prisma.trip.create({
    data: {
      source: "Naroda",
      destination: "Kalol Depot",
      vehicleId: mini03.id,
      driverId: priya.id,
      cargoWeight: 200,
      plannedDistance: 21,
      status: TripStatus.CANCELLED,
    },
  });

  console.log("Created 3 trips");

  // ---------- Maintenance Logs ----------
  await prisma.maintenanceLog.create({
    data: {
      vehicleId: mini03.id,
      description: "Oil Change",
      cost: 2500,
      status: MaintenanceStatus.ACTIVE,
    },
  });

  await prisma.maintenanceLog.create({
    data: {
      vehicleId: truck11.id,
      description: "Engine Repair",
      cost: 18000,
      status: MaintenanceStatus.CLOSED,
      closedAt: new Date(),
    },
  });

  console.log("Created 2 maintenance logs");

  // ---------- Fuel Logs ----------
  await prisma.fuelLog.create({
    data: {
      vehicleId: van05.id,
      tripId: trip1.id,
      liters: 42,
      cost: 3150,
      date: new Date("2026-07-05"),
    },
  });

  await prisma.fuelLog.create({
    data: {
      vehicleId: truck11.id,
      tripId: trip2.id,
      liters: 110,
      cost: 8400,
      date: new Date("2026-07-06"),
    },
  });

  console.log("Created 2 fuel logs");

  // ---------- Expenses ----------
  await prisma.expense.create({
    data: {
      vehicleId: van05.id,
      tripId: trip1.id,
      type: ExpenseType.TOLL,
      amount: 120,
      date: new Date("2026-07-05"),
    },
  });

  await prisma.expense.create({
    data: {
      vehicleId: truck11.id,
      tripId: trip2.id,
      type: ExpenseType.MAINTENANCE,
      amount: 18000,
      date: new Date("2026-07-06"),
      notes: "Linked to Engine Repair maintenance record",
    },
  });

  console.log("Created 2 expenses");
  console.log("Seeding complete.");
}

main()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });