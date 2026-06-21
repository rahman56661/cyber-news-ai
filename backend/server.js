require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const newsRoutes = require("./routes/newsRoutes");
const { startDailyFetchJob } = require("./cron/dailyFetchJob");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Serve generated audio files statically
app.use("/audio", express.static(path.join(__dirname, "public/audio")));

// Routes
app.use("/api/news", newsRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Cyber News AI backend running" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  // Start the daily cron job once server is up
  startDailyFetchJob();
}); 