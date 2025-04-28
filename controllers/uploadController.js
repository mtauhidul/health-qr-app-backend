// controllers/uploadController.js
const path = require("path");
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);
const driveService = require("../services/driveService");
const config = require("../config");

/**
 * Handle file uploads to Google Drive
 */
async function handleFileUpload(req, res, next) {
  try {
    const files = req.files;

    // Create timestamped folder in Google Drive
    const folder = await driveService.createTimestampedFolder(
      config.google.parentFolderId
    );
    const folderId = folder.id;

    // Array to store uploaded file details
    const uploadedFiles = [];

    // Upload image files
    const imagePromises = files.images.map(async (file, index) => {
      // Rename files to image1.jpg, image2.jpg, etc.
      const fileName = `image${index + 1}${path.extname(file.originalname)}`;

      try {
        const uploadedFile = await driveService.uploadFile(
          file.path,
          fileName,
          folderId
        );
        uploadedFiles.push(uploadedFile);

        // Clean up temporary file after upload
        await unlinkAsync(file.path);

        return uploadedFile;
      } catch (error) {
        console.error(`Error uploading ${fileName}:`, error);
        throw error;
      }
    });

    // Wait for all image uploads to complete
    await Promise.all(imagePromises);

    // Upload audio file if provided
    if (files.audio && files.audio.length > 0) {
      const audioFile = files.audio[0];
      const fileName = `voice-note${path.extname(audioFile.originalname)}`;

      const uploadedAudio = await driveService.uploadFile(
        audioFile.path,
        fileName,
        folderId
      );
      uploadedFiles.push(uploadedAudio);

      // Clean up temporary file after upload
      await unlinkAsync(audioFile.path);
    }

    // Return success response
    res.status(200).json({
      success: true,
      message: "Files uploaded successfully",
      folderDetails: {
        id: folder.id,
        name: folder.name,
        link: folder.webViewLink,
      },
      files: uploadedFiles.map((file) => ({
        id: file.id,
        name: file.name,
        link: file.webViewLink,
      })),
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  handleFileUpload,
};
