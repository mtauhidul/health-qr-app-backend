// server.js
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const multer = require("multer"); // You need this for the MulterError check
const config = require("./config");
const routes = require("./routes");
const { errorHandler } = require("./middleware/errorMiddleware");
const { requestLogger } = require("./middleware/logger");
const { securityHeaders, apiLimiter } = require("./middleware/security");

const app = express();
const PORT = config.server.port;

app.set("trust proxy", 1);

// Apply security middleware
app.use(securityHeaders);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(requestLogger);
app.use(
  cors({
    origin: config.server.frontendUrl,
    methods: ["POST", "OPTIONS", "GET"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Apply general rate limiting to all API endpoints
app.use("/api", apiLimiter);

// Mount API routes
app.use("/api", routes);

// Handle 404 errors for routes that don't exist
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Apply error handling middleware
app.use(errorHandler);

// Additional error handling for Multer errors
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // A Multer error occurred when uploading
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size exceeds the 15MB limit",
      });
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        success: false,
        message: "Too many files uploaded",
      });
    }
    return res.status(400).json({
      success: false,
      message: `Upload error: ${err.message}`,
    });
  }

  // Pass to the next error handler if not a Multer error
  next(err);
});

// Start the server (only once!)
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${config.server.env}`);

  // Create uploads directory if it doesn't exist
  const uploadsDir = config.upload.tempDir;
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log(`Created uploads directory: ${uploadsDir}`);
  }
});

module.exports = app; // Export for testing
