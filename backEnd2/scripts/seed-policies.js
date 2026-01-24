import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const prisma = new PrismaClient();

const policies = [
  // ELECTRICITY Policies
  {
    department: "ELECTRICITY",
    title: "Net Metering Policy for Rooftop Solar",
    description:
      "Consumers installing rooftop solar panels can sell excess electricity back to the grid at retail tariff rates. Net metering facility allows bidirectional energy flow, and consumers receive credit for surplus generation on their electricity bills.",
    category: "Renewable Energy",
    effectiveFrom: new Date("2023-04-01"),
    documentUrl: "https://example.gov.in/policies/net-metering-2023.pdf",
  },
  {
    department: "ELECTRICITY",
    title: "Disconnection and Reconnection Policy",
    description:
      "Electricity supply may be disconnected for non-payment of bills beyond the due date. Reconnection will be done within 24 hours of bill clearance and payment of reconnection charges (₹500 for domestic, ₹1000 for commercial). No disconnection during medical emergencies with valid certificate.",
    category: "Service Terms",
    effectiveFrom: new Date("2022-01-01"),
    documentUrl:
      "https://example.gov.in/policies/electricity-disconnection.pdf",
  },
  {
    department: "ELECTRICITY",
    title: "Energy Conservation and Demand Side Management",
    description:
      "Incentives for consumers adopting energy-efficient appliances including 5-star rated ACs, LED lighting, and smart meters. Rebates up to 20% on bills for certified energy-efficient homes. Time-of-day tariffs to encourage off-peak consumption.",
    category: "Conservation",
    effectiveFrom: new Date("2023-07-01"),
  },

  // WATER Policies
  {
    department: "WATER",
    title: "Rainwater Harvesting Mandate",
    description:
      "All buildings with plot area exceeding 100 sq meters must install rainwater harvesting systems. Existing buildings must comply within 12 months. Non-compliance will result in 50% surcharge on water bills. Financial assistance up to ₹15,000 available for residential installations.",
    category: "Conservation",
    effectiveFrom: new Date("2022-06-01"),
    documentUrl: "https://example.gov.in/policies/rainwater-harvesting.pdf",
  },
  {
    department: "WATER",
    title: "Water Quality Standards and Testing",
    description:
      "Supplied water must meet WHO and BIS standards for drinking water. Free water quality testing available at designated labs. Citizens can request testing up to 4 times per year. Results provided within 7 working days. Compensation policy for supply of substandard water.",
    category: "Quality Standards",
    effectiveFrom: new Date("2023-01-01"),
    documentUrl: "https://example.gov.in/policies/water-quality-standards.pdf",
  },
  {
    department: "WATER",
    title: "24x7 Water Supply Initiative",
    description:
      "Phased implementation of continuous water supply in all urban areas. Smart water meters mandatory for new connections. Leak detection and prevention program to reduce distribution losses. Pressure management zones to ensure optimal supply.",
    category: "Service Enhancement",
    effectiveFrom: new Date("2023-04-01"),
  },

  // GAS Policies
  {
    department: "GAS",
    title: "Pradhan Mantri Ujjwala Yojana (PMUY)",
    description:
      "Free LPG connections to women from BPL households, SC/ST families, and other economically weaker sections. First refill at subsidized rate. EMI option available for security deposit. Priority delivery and customer support for beneficiaries.",
    category: "Social Welfare",
    effectiveFrom: new Date("2016-05-01"),
    documentUrl: "https://pmuy.gov.in/",
  },
  {
    department: "GAS",
    title: "LPG Subsidy and Direct Benefit Transfer (DBT)",
    description:
      "Subsidized LPG cylinder benefits transferred directly to beneficiary bank accounts. Consumers pay market price and receive subsidy within 2-3 days. Aadhaar linking mandatory for subsidy. Online portal for subsidy status tracking.",
    category: "Subsidy",
    effectiveFrom: new Date("2013-06-01"),
    documentUrl: "https://mylpg.in/",
  },
  {
    department: "GAS",
    title: "PNG Safety and Installation Standards",
    description:
      "Strict safety norms for PNG pipeline installation. Mandatory gas leak detectors in all PNG households. Annual maintenance checks by authorized technicians. Emergency helpline 24x7. Insurance coverage for PNG connection holders.",
    category: "Safety",
    effectiveFrom: new Date("2022-01-01"),
  },

  // SANITATION Policies
  {
    department: "SANITATION",
    title: "Swachh Bharat Mission - Solid Waste Management",
    description:
      "100% door-to-door waste collection in urban areas. Mandatory segregation of waste at source into wet, dry, and hazardous categories. Penalties for non-compliance. Incentives for composting and waste-to-energy initiatives. No burning of waste allowed.",
    category: "Waste Management",
    effectiveFrom: new Date("2014-10-02"),
    documentUrl: "https://swachhbharatmission.gov.in/",
  },
  {
    department: "SANITATION",
    title: "Plastic Waste Management and Ban",
    description:
      "Ban on single-use plastic items including bags below 50 microns, straws, and thermocol. Mandatory collection of plastic waste by manufacturers. Extended Producer Responsibility (EPR) for plastic products. Penalties up to ₹50,000 for violations.",
    category: "Environmental",
    effectiveFrom: new Date("2022-07-01"),
    documentUrl: "https://example.gov.in/policies/plastic-ban.pdf",
  },
  {
    department: "SANITATION",
    title: "Faecal Sludge and Septage Management (FSSM)",
    description:
      "Scientific management of septic tank waste. Licensed operators for emptying services. Treatment facilities for septage before disposal. Subsidy for construction of twin-pit toilets in rural areas. Ban on manual scavenging with strict penalties.",
    category: "Sanitation",
    effectiveFrom: new Date("2021-04-01"),
  },

  // MUNICIPAL Policies
  {
    department: "MUNICIPAL",
    title: "Property Tax Assessment and Collection",
    description:
      "Annual property tax based on carpet area, location, and usage. Online assessment and payment facility. Rebates: 10% for early payment (before April 30), 5% for senior citizens. Penalty of 2% per month for delayed payment. Self-assessment option available.",
    category: "Taxation",
    effectiveFrom: new Date("2023-04-01"),
    documentUrl: "https://example.gov.in/municipal/property-tax-policy.pdf",
  },
  {
    department: "MUNICIPAL",
    title: "Building Approval and Construction Bye-laws",
    description:
      "Online building plan approval system with 30-day timeline. Floor Area Ratio (FAR) norms based on road width and zone. Mandatory fire safety for buildings above 15 meters. Rain water harvesting and solar panels required for new constructions above 500 sq meters.",
    category: "Urban Planning",
    effectiveFrom: new Date("2022-01-01"),
    documentUrl: "https://example.gov.in/municipal/building-bylaws.pdf",
  },
  {
    department: "MUNICIPAL",
    title: "Street Vending and Hawking Zones",
    description:
      "Designated vending zones in all urban areas. Registration of street vendors with identity cards. No-vending zones near hospitals, schools, and government offices. Time-restricted vending in residential areas. Penalties for unauthorized vending.",
    category: "Trade",
    effectiveFrom: new Date("2022-06-01"),
  },
];

async function main() {
  console.log("🌱 Seeding policies...");

  for (const policy of policies) {
    await prisma.policy.create({
      data: policy,
    });
    console.log(`✅ Created policy: ${policy.title} (${policy.department})`);
  }

  console.log("✨ Policies seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding policies:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
