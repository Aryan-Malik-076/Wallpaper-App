const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

const app = express();

// Ensure Uploads Folder Exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Handle form-data
app.use("/uploads", express.static(uploadDir)); // Serve uploaded files

// MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/wallpaper-app", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Routes
try {
  const uploadRoutes = require("./routes/uploads");
  app.use("/api/uploads", uploadRoutes);
} catch (err) {
  console.error("❌ Route Import Error:", err);
}

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
