require("dotenv").config();
const { prisma } = require("../src/prisma");

const schemes = [
  {
    department: "WATER",
    title: "Jal Jeevan Mission",
    description:
      "Provide safe tap water (FHTC) to every rural household; ensures safe and regular drinking water.",
    eligibility:
      "Rural households. Kiosk checks: Is resident in rural area? Does household already have a tap connection?",
  },
  {
    department: "WATER",
    title: "National Rainwater Harvesting Programme",
    description:
      "Conserve water through rainwater harvesting; promotes adoption with financial incentives (state-specific) and reduced water bills.",
    eligibility:
      "Homeowners and institutions. Refer state guidelines and subsidy information.",
  },
  {
    department: "GAS",
    title: "Pradhan Mantri Ujjwala Yojana (PMUY)",
    description:
      "Provide clean cooking fuel to poor households; free LPG connection with first cylinder and subsidy on refills.",
    eligibility:
      "Women from BPL/SECC families. Kiosk checks: Is applicant female? BPL or ration card available?",
  },
  {
    department: "GAS",
    title: "Ujjwala 2.0",
    description:
      "Extension of PMUY benefits: free first refill, stove provided; migrant families eligible with document-light flow; no fixed address required.",
    eligibility:
      "Households eligible under extended PMUY norms including migrant families. Document-light eligibility checker supported.",
  },
];

const run = async () => {
  for (const s of schemes) {
    const existing = await prisma.publicScheme.findFirst({
      where: { title: s.title, department: s.department },
    });
    if (existing) {
      await prisma.publicScheme.update({
        where: { id: existing.id },
        data: { description: s.description, eligibility: s.eligibility },
      });
      console.log(`Updated scheme: ${s.department} • ${s.title}`);
    } else {
      const created = await prisma.publicScheme.create({ data: s });
      console.log(`Created scheme: ${created.department} • ${created.title}`);
    }
  }
  await prisma.$disconnect();
};

run().catch(async (error) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});
