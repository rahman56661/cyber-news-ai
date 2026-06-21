const cron = require("node-cron");
const { runDailyPipeline } = require("../services/newsProcessor");

/**
 * Schedules the daily news fetch + process pipeline.
 * Runs every day at 7:00 AM IST (Asia/Kolkata).
 */
function startDailyFetchJob() {
  // Cron format: minute hour day month weekday
  cron.schedule(
    "0 7 * * *",
    async () => {
      console.log("⏰ Daily cron triggered");
      try {
        await runDailyPipeline();
      } catch (error) {
        console.error(`❌ Daily pipeline crashed: ${error.message}`);
      }
    },
    {
      timezone: "Asia/Kolkata",
    }
  );

  console.log("📅 Daily fetch job scheduled — runs every day at 7:00 AM IST");
}

module.exports = { startDailyFetchJob };