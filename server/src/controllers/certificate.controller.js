import {
  createCertificate,
  getUserCertificates,
  getCertificate,
} from "../services/certificate.service.js";

export const issueCertificate = async (req, res) => {
  try {
    const certificate = await createCertificate(
      req.params.interviewId,
      req.user._id
    );

    res.status(201).json({
      success: true,
      message: "Certificate issued successfully.",
      certificate,
    });
  } catch (error) {
    console.error("Certificate error:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCertificates = async (req, res) => {
  try {
    const certificates = await getUserCertificates(req.user._id);

    res.json({
      success: true,
      certificates,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch certificates.",
    });
  }
};

export const getOneCertificate = async (req, res) => {
  try {
    const certificate = await getCertificate(
      req.params.certificateId,
      req.user._id
    );

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found.",
      });
    }

    res.json({
      success: true,
      certificate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch certificate.",
    });
  }
};
