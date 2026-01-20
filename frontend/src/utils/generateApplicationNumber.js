/**
 * Generates a unique application number
 * Format:
 * SUVIDHA-ELC-2026-XXXXXX
 */

export const generateApplicationNumber = (
  serviceCode = "ELC"
) => {
  const year = new Date().getFullYear();

  const random = Math.floor(100000 + Math.random() * 900000);

  return `SUVIDHA-${serviceCode}-${year}-${random}`;
};
