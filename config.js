// config.js
require("dotenv").config();

module.exports = {
  server: {
    port: process.env.PORT || 8080,
    env: process.env.NODE_ENV || "development",
    frontendUrl: process.env.FRONTEND_URL || "*",
  },

  upload: {
    maxFileSize: 15 * 1024 * 1024, // 15MB
    maxFiles: 20,
    tempDir: "./uploads",
  },

  // GOOGLE DRIVE CONFIGURATION
  google: {
    // Use service account JSON from environment if available
    serviceAccount: process.env.GOOGLE_SERVICE_ACCOUNT
      ? JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT)
      : null,
    // Fall back to credentials file for local development
    credentialsFile: process.env.GOOGLE_CREDENTIALS,
    // Parent folder ID is the same in both environments
    parentFolderId: process.env.GOOGLE_DRIVE_PARENT_FOLDER_ID,
  },

  validation: {
    minImageCount: 8,
    maxImageCount: 20,
    maxAudioCount: 1,
    allowedImageTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
    allowedAudioTypes: [
      "audio/mpeg",
      "audio/wav",
      "audio/m4a",
      "audio/ogg",
      "audio/webm",
    ],
  },
};
