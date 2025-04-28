// routes/index.js
const express = require("express");
const uploadRoutes = require("./uploadRoutes");

const router = express.Router();

// Health check route
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    time: new Date().toISOString(),
  });
});

// Mount routes
router.use("/upload", uploadRoutes);

module.exports = router;
