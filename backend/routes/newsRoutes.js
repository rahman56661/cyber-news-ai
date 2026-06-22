const express = require("express");
const router = express.Router();
const {
  getAllNews,
  getNewsById,
  triggerManualRefresh,
  serveAudio,
} = require("../controllers/newsController");

router.get("/", getAllNews);
router.get("/:id/audio/:lang", serveAudio);  // new audio endpoint
router.get("/:id", getNewsById);
router.post("/refresh", triggerManualRefresh);

module.exports = router;