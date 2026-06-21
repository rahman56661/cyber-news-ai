const express = require("express");
const router = express.Router();
const {
  getAllNews,
  getNewsById,
  triggerManualRefresh,
} = require("../controllers/newsController");

router.get("/", getAllNews);
router.get("/:id", getNewsById);
router.post("/refresh", triggerManualRefresh);

module.exports = router;