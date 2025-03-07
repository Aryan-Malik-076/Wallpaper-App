const express = require("express");
const multer = require("multer");
const fs = require("fs");
const router = express.Router();

// Storage settings
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Upload Image Route
router.post("/", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.json({ filePath: `/uploads/${req.file.filename}` });
});

// Get All Uploaded Images
router.get("/", (req, res) => {
  fs.readdir("uploads/", (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Error reading files" });
    }
    res.json(files.map((file) => ({ filename: file })));
  });
});

module.exports = router;
