// services/driveService.js
const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

class DriveService {
  constructor() {
    this.drive = this.initializeDrive();
  }

  initializeDrive() {
    try {
      const auth = new google.auth.GoogleAuth({
        keyFile: process.env.GOOGLE_CREDENTIALS,
        scopes: ["https://www.googleapis.com/auth/drive"],
      });

      return google.drive({ version: "v3", auth });
    } catch (error) {
      console.error("Error initializing Google Drive:", error);
      throw error;
    }
  }

  // In your driveService.js file
  async createTimestampedFolder(parentFolderId) {
    // Get current date and time
    const now = new Date();

    // Format: "Apr 28, 2025 - 13:47"
    const formattedDate = now.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const formattedTime = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    // Combine into a user-friendly format
    const timestamp = `${formattedDate} - ${formattedTime}`;

    // Create folder name
    const folderName = `${timestamp}`;

    const folderMetadata = {
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
      parents: parentFolderId ? [parentFolderId] : [],
    };

    try {
      const folder = await this.drive.files.create({
        resource: folderMetadata,
        fields: "id, name, webViewLink",
      });

      console.log(`Created folder: ${folderName} with ID: ${folder.data.id}`);
      return folder.data;
    } catch (error) {
      console.error("Error creating folder:", error);
      throw error;
    }
  }
  async uploadFile(filePath, fileName, folderId) {
    const fileMetadata = {
      name: fileName,
      parents: [folderId],
    };

    const mimeType = this.getMimeType(fileName);

    const media = {
      mimeType: mimeType,
      body: fs.createReadStream(filePath),
    };

    try {
      const file = await this.drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: "id, name, webViewLink",
      });

      console.log(
        `Uploaded ${fileName} to Google Drive with ID: ${file.data.id}`
      );
      return file.data;
    } catch (error) {
      console.error(`Error uploading ${fileName}:`, error);
      throw error;
    }
  }

  getMimeType(fileName) {
    const ext = path.extname(fileName).toLowerCase();

    const mimeTypes = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".mp3": "audio/mpeg",
      ".wav": "audio/wav",
      ".m4a": "audio/m4a",
      ".mp4": "video/mp4",
      ".ogg": "audio/ogg",
      ".webm": "audio/webm",
    };

    return mimeTypes[ext] || "application/octet-stream";
  }

  // Utility function to check if a file exists in Drive
  async fileExists(fileId) {
    try {
      const response = await this.drive.files.get({
        fileId: fileId,
        fields: "id, name",
      });

      return !!response.data.id;
    } catch (error) {
      if (error.code === 404) {
        return false;
      }
      throw error;
    }
  }

  // Get a list of files in a folder
  async listFilesInFolder(folderId) {
    try {
      const response = await this.drive.files.list({
        q: `'${folderId}' in parents and trashed=false`,
        fields: "files(id, name, mimeType, webViewLink)",
      });

      return response.data.files;
    } catch (error) {
      console.error("Error listing files in folder:", error);
      throw error;
    }
  }
}

module.exports = new DriveService();
