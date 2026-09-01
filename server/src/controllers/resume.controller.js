import {
  createOrUpdateResume,
  getUserResume,
  deleteUserResume,
} from "../services/resume.service.js";

export const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF resume.",
      });
    }

    const resume = await createOrUpdateResume(
      req.user._id,
      {
        fileName: req.file.originalname,
        filePath: req.file.path || "",
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        buffer: req.file.buffer,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Resume uploaded and processed successfully.",
      resume,
    });
  } catch (error) {
    console.error("Resume upload error:", error);
    next(error);
  }
};

export const getResume = async (req, res, next) => {
  try {
    const resume = await getUserResume(req.user._id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "No resume found.",
      });
    }

    return res.status(200).json({
      success: true,
      resume,
    });
  } catch (error) {
    console.error("Get resume error:", error);
    next(error);
  }
};

export const deleteResume = async (req, res, next) => {
  try {
    const resume = await deleteUserResume(req.user._id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "No resume found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Resume deleted successfully.",
    });
  } catch (error) {
    console.error("Delete resume error:", error);
    next(error);
  }
};