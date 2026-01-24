import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const prisma = new PrismaClient();

const tariffs = [
  // ELECTRICITY Tariffs
  {
    department: "ELECTRICITY",
    name: "Domestic Consumption (0-100 units)",
    description: "Subsidized rate for low consumption households",
    category: "Domestic",
    rate: 3.5,
    unit: "kWh",
    effectiveFrom: new Date("2024-01-01"),
  },
  {
    department: "ELECTRICITY",
    name: "Domestic Consumption (101-200 units)",
    description: "Standard rate for moderate consumption",
    category: "Domestic",
    rate: 5.75,
    unit: "kWh",
    effectiveFrom: new Date("2024-01-01"),
  },
  {
    department: "ELECTRICITY",
    name: "Domestic Consumption (Above 200 units)",
    description: "Higher rate for high consumption",
    category: "Domestic",
    rate: 7.5,
    unit: "kWh",
    effectiveFrom: new Date("2024-01-01"),
  },
  {
    department: "ELECTRICITY",
    name: "Commercial Rate",
    description: "Flat rate for commercial establishments",
    category: "Commercial",
    rate: 8.25,
    unit: "kWh",
    effectiveFrom: new Date("2024-01-01"),
  },
  {
    department: "ELECTRICITY",
    name: "Industrial Rate",
    description: "Bulk rate for industrial consumers",
    category: "Industrial",
    rate: 6.9,
    unit: "kWh",
    effectiveFrom: new Date("2024-01-01"),
  },

  // WATER Tariffs
  {
    department: "WATER",
    name: "Domestic Water Supply (0-10,000 L)",
    description: "Basic water supply for small households",
    category: "Domestic",
    rate: 0.5,
    unit: "1000 liters",
    effectiveFrom: new Date("2024-01-01"),
  },
  {
    department: "WATER",
    name: "Domestic Water Supply (Above 10,000 L)",
    description: "Standard rate for regular consumption",
    category: "Domestic",
    rate: 1.2,
    unit: "1000 liters",
    effectiveFrom: new Date("2024-01-01"),
  },
  {
    department: "WATER",
    name: "Commercial Water Supply",
    description: "Rate for commercial establishments",
    category: "Commercial",
    rate: 2.5,
    unit: "1000 liters",
    effectiveFrom: new Date("2024-01-01"),
  },
  {
    department: "WATER",
    name: "Industrial Water Supply",
    description: "Bulk rate for industries",
    category: "Industrial",
    rate: 3.75,
    unit: "1000 liters",
    effectiveFrom: new Date("2024-01-01"),
  },

  // GAS Tariffs
  {
    department: "GAS",
    name: "LPG Cylinder - Domestic (14.2 kg)",
    description: "Subsidized LPG cylinder for households",
    category: "Domestic",
    rate: 850.0,
    unit: "cylinder",
    effectiveFrom: new Date("2024-01-01"),
  },
  {
    department: "GAS",
    name: "LPG Cylinder - Commercial (19 kg)",
    description: "Commercial LPG cylinder rate",
    category: "Commercial",
    rate: 1650.0,
    unit: "cylinder",
    effectiveFrom: new Date("2024-01-01"),
  },
  {
    department: "GAS",
    name: "PNG - Domestic",
    description: "Piped Natural Gas for residential use",
    category: "Domestic",
    rate: 45.5,
    unit: "SCM",
    effectiveFrom: new Date("2024-01-01"),
  },
  {
    department: "GAS",
    name: "PNG - Commercial",
    description: "Piped Natural Gas for commercial use",
    category: "Commercial",
    rate: 52.0,
    unit: "SCM",
    effectiveFrom: new Date("2024-01-01"),
  },

  // SANITATION Tariffs
  {
    department: "SANITATION",
    name: "Waste Collection - Residential",
    description: "Monthly charge for household waste collection",
    category: "Residential",
    rate: 150.0,
    unit: "month",
    effectiveFrom: new Date("2024-01-01"),
  },
  {
    department: "SANITATION",
    name: "Waste Collection - Commercial",
    description: "Monthly charge for commercial waste collection",
    category: "Commercial",
    rate: 500.0,
    unit: "month",
    effectiveFrom: new Date("2024-01-01"),
  },
  {
    department: "SANITATION",
    name: "Septic Tank Cleaning",
    description: "One-time charge for septic tank cleaning service",
    category: "Service",
    rate: 2500.0,
    unit: "service",
    effectiveFrom: new Date("2024-01-01"),
  },

  // MUNICIPAL Tariffs
  {
    department: "MUNICIPAL",
    name: "Property Tax - Residential",
    description: "Annual property tax for residential properties",
    category: "Tax",
    rate: 12.0,
    unit: "sq ft/year",
    effectiveFrom: new Date("2024-04-01"),
  },
  {
    department: "MUNICIPAL",
    name: "Property Tax - Commercial",
    description: "Annual property tax for commercial properties",
    category: "Tax",
    rate: 25.0,
    unit: "sq ft/year",
    effectiveFrom: new Date("2024-04-01"),
  },
  {
    department: "MUNICIPAL",
    name: "Trade License Fee",
    description: "Annual fee for trade license",
    category: "License",
    rate: 5000.0,
    unit: "year",
    effectiveFrom: new Date("2024-04-01"),
  },
];

async function main() {
  console.log("🌱 Seeding tariffs...");

  for (const tariff of tariffs) {
    await prisma.tariff.create({
      data: tariff,
    });
    console.log(`✅ Created tariff: ${tariff.name} (${tariff.department})`);
  }

  console.log("✨ Tariffs seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding tariffs:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
