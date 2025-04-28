// middleware/validation.js
const config = require("../config");

/**
 * Validate the file upload request
 */
function validateUploadRequest(req, res, next) {
  // Check if we have files in the request
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      success: false,
      message: "No files were uploaded",
    });
  }

  // Check if we have image files
  if (!req.files.images || req.files.images.length === 0) {
    return res.status(400).json({
      success: false,
      message: "At least one image file is required",
    });
  }

  // Validate minimum number of images
  if (req.files.images.length < config.validation.minImageCount) {
    return res.status(400).json({
      success: false,
      message: `At least ${config.validation.minImageCount} image files are required`,
    });
  }

  // Validate image types
  const invalidImages = req.files.images.filter(
    (file) => !config.validation.allowedImageTypes.includes(file.mimetype)
  );

  if (invalidImages.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid image file type(s)",
      details: invalidImages.map((file) => ({
        name: file.originalname,
        type: file.mimetype,
      })),
    });
  }

  // Validate audio file if present
  if (req.files.audio && req.files.audio.length > 0) {
    const audioFile = req.files.audio[0];

    if (!config.validation.allowedAudioTypes.includes(audioFile.mimetype)) {
      return res.status(400).json({
        success: false,
        message: "Invalid audio file type",
        details: {
          name: audioFile.originalname,
          type: audioFile.mimetype,
        },
      });
    }
  }

  next();
}

module.exports = {
  validateUploadRequest,
};
