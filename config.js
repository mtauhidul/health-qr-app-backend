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

  google: {
    credentialsFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
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
