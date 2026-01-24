import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const prisma = new PrismaClient();

// Helper to get dates relative to today
const daysFromNow = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

const advisories = [
  // ELECTRICITY Advisories
  {
    department: "ELECTRICITY",
    message:
      "⚡ Scheduled power maintenance on 28th January 2026 from 10 AM to 2 PM in sectors 5, 6, and 7. Please plan accordingly.",
    validTill: daysFromNow(4),
  },
  {
    department: "ELECTRICITY",
    message:
      "💡 Energy conservation drive: Use LED bulbs and save up to 20% on your electricity bills. Rebate scheme active till March 31st.",
    validTill: daysFromNow(66),
  },
  {
    department: "ELECTRICITY",
    message:
      "⚠️ High voltage detected in some areas. If you notice flickering lights or unusual sounds from appliances, report immediately on helpline 1912.",
    validTill: daysFromNow(7),
  },
  {
    department: "ELECTRICITY",
    message:
      "🌞 Apply for rooftop solar subsidy before February 15, 2026. Get up to 40% subsidy under PM Surya Ghar scheme.",
    validTill: daysFromNow(22),
  },

  // WATER Advisories
  {
    department: "WATER",
    message:
      "💧 Water supply will be reduced to alternate days from January 25-30 due to pipeline maintenance. Store adequate water.",
    validTill: daysFromNow(6),
  },
  {
    department: "WATER",
    message:
      "🚰 Free water quality testing camp on January 27, 2026 at Community Hall. Bring water samples between 9 AM - 4 PM.",
    validTill: daysFromNow(3),
  },
  {
    department: "WATER",
    message:
      "💦 Summer alert: Practice water conservation. Fix leaking taps, reuse RO waste water for plants. Penalties for water wastage during peak summer.",
    validTill: daysFromNow(180),
  },
  {
    department: "WATER",
    message:
      "🏗️ Rainwater harvesting subsidy extended! Install now and get ₹15,000 subsidy. Last date: February 28, 2026.",
    validTill: daysFromNow(35),
  },

  // GAS Advisories
  {
    department: "GAS",
    message:
      "🔥 LPG cylinder prices revised effective January 1, 2026. Domestic: ₹850, Commercial: ₹1,650. Check mylpg.in for details.",
    validTill: daysFromNow(30),
  },
  {
    department: "GAS",
    message:
      "⚠️ Safety first! Check for gas leaks regularly. If you smell gas, turn off the regulator, ventilate the area, and call emergency helpline 1906.",
    validTill: daysFromNow(365),
  },
  {
    department: "GAS",
    message:
      "📱 Book your LPG refill online through mobile app and get priority delivery. Download from Play Store or App Store.",
    validTill: daysFromNow(90),
  },
  {
    department: "GAS",
    message:
      "🎯 Ujjwala 2.0 scheme extended! Women from eligible households can get free LPG connection. Apply at nearest distributor.",
    validTill: daysFromNow(120),
  },

  // SANITATION Advisories
  {
    department: "SANITATION",
    message:
      "♻️ Republic Day special: Intensive cleanliness drive from Jan 24-26. Please cooperate by keeping waste bins outside for collection.",
    validTill: daysFromNow(2),
  },
  {
    department: "SANITATION",
    message:
      "🗑️ Reminder: Segregate waste at source - Green bin for wet waste, Blue bin for dry waste, Red bin for hazardous waste. Penalty for non-compliance: ₹500.",
    validTill: daysFromNow(365),
  },
  {
    department: "SANITATION",
    message:
      "🚯 Single-use plastic ban strictly enforced. Penalty: ₹500 for first offense, ₹5,000 for repeat offense. Carry cloth bags.",
    validTill: daysFromNow(365),
  },
  {
    department: "SANITATION",
    message:
      "🌱 Composting workshop on February 2, 2026 at Municipal Office. Learn to convert kitchen waste into fertilizer. Free registration.",
    validTill: daysFromNow(9),
  },

  // MUNICIPAL Advisories
  {
    department: "MUNICIPAL",
    message:
      "💰 Property tax early payment discount: Pay before April 30, 2026 and get 10% rebate. Additional 5% for senior citizens.",
    validTill: daysFromNow(96),
  },
  {
    department: "MUNICIPAL",
    message:
      "🏛️ Municipal office timings extended till 6 PM for January. Get your property documents, birth certificates, and licenses without hassle.",
    validTill: daysFromNow(7),
  },
  {
    department: "MUNICIPAL",
    message:
      "🚧 Road repair work in progress on Main Street from Jan 25 to Feb 5. Expect traffic diversions. Follow traffic police instructions.",
    validTill: daysFromNow(12),
  },
  {
    department: "MUNICIPAL",
    message:
      "📋 Trade license renewal deadline: March 31, 2026. Renew online at municipal.gov.in. Late fee applicable after deadline.",
    validTill: daysFromNow(66),
  },
];

async function main() {
  console.log("🌱 Seeding advisories...");

  for (const advisory of advisories) {
    await prisma.advisory.create({
      data: advisory,
    });
    console.log(
      `✅ Created advisory for ${advisory.department}: ${advisory.message.substring(0, 50)}...`,
    );
  }

  console.log("✨ Advisories seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding advisories:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
