require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const newsRoutes = require("./routes/newsRoutes");
const { startDailyFetchJob } = require("./cron/dailyFetchJob");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// Serve generated audio files statically
app.use("/audio", express.static(path.join(__dirname, "public/audio")));

// API Routes
app.use("/api/news", newsRoutes);

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

// Serve frontend build in production (combined single-service deployment)
if (process.env.NODE_ENV === "production") {
  const frontendDistPath = path.join(__dirname, "../frontend/dist");
  app.use(express.static(frontendDistPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
}

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  startDailyFetchJob();
});