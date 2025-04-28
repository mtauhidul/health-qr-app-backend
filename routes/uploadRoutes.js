// routes/uploadRoutes.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const config = require("../config");
const { validateUploadRequest } = require("../middleware/validation");
const { handleFileUpload } = require("../controllers/uploadController");
const { uploadLimiter } = require("../middleware/security");

const router = express.Router();

// Set up multer storage for temporary file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tempDir = config.upload.tempDir;
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    // Generate a unique filename for each uploaded file
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// Configure multer upload
const upload = multer({
  storage: storage,
  limits: {
    fileSize: config.upload.maxFileSize,
    files: config.upload.maxFiles,
  },
  fileFilter: (req, file, cb) => {
    // Accept images and audio files based on configuration
    if (
      (file.fieldname === "images" &&
        config.validation.allowedImageTypes.includes(file.mimetype)) ||
      (file.fieldname === "audio" &&
        config.validation.allowedAudioTypes.includes(file.mimetype))
    ) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype}`), false);
    }
  },
});

// File upload endpoint with rate limiting
router.post(
  "/",
  uploadLimiter, // Apply rate limiting to the upload endpoint
  upload.fields([
    { name: "images", maxCount: config.validation.maxImageCount },
    { name: "audio", maxCount: config.validation.maxAudioCount },
  ]),
  validateUploadRequest,
  handleFileUpload
);

// Get upload status (could be used to track progress in a future enhancement)
router.get("/status/:uploadId", (req, res) => {
  const { uploadId } = req.params;

  // This is a placeholder for future implementation
  // In a real-world scenario, you might track upload progress in a database
  res.status(200).json({
    uploadId,
    status: "completed",
    message: "Upload completed successfully",
  });
});

module.exports = router;
