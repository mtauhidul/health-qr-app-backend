// middleware/errorMiddleware.js
const multer = require("multer");

/**
 * Error handling middleware
 */
function errorHandler(err, req, res, next) {
  console.error("Error encountered:", err);

  // Handle Multer errors
  if (err instanceof multer.MulterError) {
    return handleMulterError(err, res);
  }

  // Handle validation errors
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.errors || [err.message],
    });
  }

  // Handle authorization errors
  if (err.name === "AuthorizationError") {
    return res.status(403).json({
      success: false,
      message: "Not authorized to perform this action",
    });
  }

  // Default to 500 server error
  return res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error",
    error: process.env.NODE_ENV === "production" ? null : err.stack,
  });
}

/**
 * Handle specific Multer errors with user-friendly messages
 */
function handleMulterError(err, res) {
  let statusCode = 400;
  let message = "File upload error";

  switch (err.code) {
    case "LIMIT_FILE_SIZE":
      message = "File size exceeds the 15MB limit";
      break;
    case "LIMIT_FILE_COUNT":
      message = "Too many files uploaded";
      break;
    case "LIMIT_UNEXPECTED_FILE":
      message = "Unexpected file field";
      break;
    case "LIMIT_PART_COUNT":
      message = "Too many parts in the form data";
      break;
    default:
      message = `Upload error: ${err.message}`;
  }

  return res.status(statusCode).json({
    success: false,
    message,
    code: err.code,
  });
}

module.exports = {
  errorHandler,
};
