# Form Upload Server

A Node.js/Express server that handles file uploads to Google Drive for medical form submissions. The server accepts multiple image files and an optional audio file, creates a timestamped folder in Google Drive, and uploads all files to this folder.

## Features

- Accepts multipart form data with multiple images and an optional audio file
- Creates a timestamped folder in Google Drive (format: `/Form Submissions/YYYYMMDD-HHMM/`)
- Names uploaded files consistently (image1.jpg, image2.jpg, voice-note.mp3, etc.)
- Returns success status and folder information
- Handles errors gracefully with centralized error handling
- Implements CORS for frontend access
- Uses environment variables for configuration
- Secure upload process with rate limiting and validation
- Follows security best practices with helmet
- Modular architecture with controllers, routes, and services

## Prerequisites

- Node.js (v16 or newer)
- pnpm (recommended) or npm
- Google Cloud Platform account with Google Drive API enabled
- Google Service Account with appropriate permissions

## Technical Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Authentication**: Google Service Account
- **File Upload**: Multer
- **Security**: Helmet, express-rate-limit
- **Storage**: Google Drive API
- **Environment Management**: dotenv

## Project Structure

```
form-upload-server/
├── config.js                  # Centralized configuration
├── server.js                  # Main application entry point
├── package.json               # Project dependencies
├── .env.example               # Example environment variables
├── .gitignore                 # Git ignore file
├── README.md                  # Project documentation
├── controllers/               # Request handlers
│   └── uploadController.js    # Handles file upload logic
├── middleware/                # Express middleware
│   ├── errorMiddleware.js     # Error handling
│   ├── logger.js              # Request logging
│   ├── security.js            # Security features
│   └── validation.js          # Request validation
├── routes/                    # API routes
│   ├── index.js               # Routes index
│   └── uploadRoutes.js        # File upload routes
├── services/                  # Business logic
│   └── driveService.js        # Google Drive operations
└── uploads/                   # Temporary file storage (auto-created)
```

## Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/form-upload-server.git
cd form-upload-server
```

2. Install dependencies:

```bash
pnpm install
# or
npm install
```

3. Create a `.env` file based on the `.env.example`:

```bash
cp .env.example .env
```

4. Set up Google Drive API and Service Account:

   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project (or select an existing one)
   - Enable the Google Drive API
   - Create a Service Account
   - Generate and download the Service Account key (JSON format)
   - Place the downloaded JSON file in your project directory
   - Update the `GOOGLE_APPLICATION_CREDENTIALS` path in `.env` to point to this file

5. Create a folder in Google Drive where you want to store the uploads:
   - Create a folder in Google Drive
   - Get the folder ID (from the URL when you open the folder)
   - Update the `GOOGLE_DRIVE_PARENT_FOLDER_ID` in `.env` with this folder ID
   - Share the folder with the service account email address and give it "Editor" permissions

## Running the Server

### Development mode:

```bash
pnpm dev
# or
npm run dev
```

### Production mode:

```bash
pnpm start
# or
npm start
```

The server will run on the port specified in the `.env` file (default: 3000).

## API Endpoints

### POST /api/upload

Accepts multipart form data with files and uploads them to Google Drive.

#### Request

- Content-Type: `multipart/form-data`
- Body:
  - `images[]`: Multiple image files (required, minimum 8)
  - `audio`: Audio file (optional)

#### Response

Success (200 OK):

```json
{
  "success": true,
  "message": "Files uploaded successfully",
  "folderDetails": {
    "id": "google_drive_folder_id",
    "name": "Form Submissions/20250422-0930",
    "link": "https://drive.google.com/folder/..."
  },
  "files": [
    {
      "id": "file_id_1",
      "name": "image1.jpg",
      "link": "https://drive.google.com/file/..."
    },
    ...
  ]
}
```

Error (400/500):

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

### GET /api/health

Returns the server health status.

#### Response

Success (200 OK):

```json
{
  "status": "ok",
  "time": "2025-04-22T12:00:00.000Z"
}
```

## Security Considerations

- Use HTTPS in production
- Set appropriate CORS restrictions in production by updating the `FRONTEND_URL` environment variable
- Keep your Google Service Account credentials secure
- Rate limiting is implemented to prevent abuse
- Security headers are set using Helmet
- Input validation for all uploads
- Clean up temporary files after processing
- Review and update dependencies regularly

## Deployment

This server can be deployed to any Node.js hosting platform such as:

- Vercel
- Heroku
- AWS Elastic Beanstalk
- Google Cloud Run
- Digital Ocean App Platform

When deploying, remember to set all environment variables from the `.env` file in your hosting platform's configuration.

## License

MIT
