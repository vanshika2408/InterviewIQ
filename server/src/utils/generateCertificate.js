import crypto from "crypto";

export const generateCertificateId = () => {
  return `IIQ-${crypto.randomBytes(6).toString("hex").toUpperCase()}`;
};
