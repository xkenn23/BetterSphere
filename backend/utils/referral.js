import crypto from "crypto";

export const generateReferralCode = () => {
  return crypto.randomBytes(5).toString("hex"); // Generates a random 10-character code
};
