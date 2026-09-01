import env from "../config/env.js";

export const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

export const errorHandler = (err, req, res, next) => {
  console.error("Server error:", err);

  // -----------------------------------------
  // MULTER / FILE UPLOAD ERRORS
  // -----------------------------------------

  if (err.name === "MulterError") {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "Uploaded file is too large.",
      });
    }

    return res.status(400).json({
      success: false,
      message: err.message || "File upload failed.",
    });
  }

  // Custom file validation errors
  if (
    err.message === "Only PDF files are allowed." ||
    err.message === "Unsupported audio format."
  ) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  // -----------------------------------------
  // MONGOOSE VALIDATION ERRORS
  // -----------------------------------------

  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors: Object.values(err.errors).map(
        (error) => error.message
      ),
    });
  }

  // -----------------------------------------
  // INVALID MONGODB OBJECT ID
  // -----------------------------------------

  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid resource ID.",
    });
  }

  // -----------------------------------------
  // DUPLICATE MONGODB KEY
  // -----------------------------------------

  if (err.code === 11000) {
    const duplicateField = Object.keys(
      err.keyPattern || {}
    )[0];

    return res.status(409).json({
      success: false,
      message: duplicateField
        ? `A record with this ${duplicateField} already exists.`
        : "A record with this value already exists.",
    });
  }

  // -----------------------------------------
  // JWT ERRORS
  // -----------------------------------------

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid authentication token.",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Authentication token expired.",
    });
  }

  // -----------------------------------------
  // DEFAULT SERVER ERROR
  // -----------------------------------------

  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    message:
      statusCode === 500 && env.nodeEnv === "production"
        ? "An unexpected server error occurred."
        : err.message ||
          "An unexpected server error occurred.",
  });
};