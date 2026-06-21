const News = require("../models/News");
const { fetchAllNews } = require("./rssService");
const { generateExplanations } = require("./aiService");
const { generateAllAudio } = require("./ttsService");

const LANGUAGES = ["en", "ta", "hi", "ml"];
const MAX_ITEMS_PER_RUN = 15;       // never process more than this in one run
const MAX_AGE_HOURS = 48;           // only consider news from last 48 hours
const MAX_CONSECUTIVE_FAILURES = 3; // stop early if AI quota looks exhausted

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Keeps only recent items, sorted newest first, capped at MAX_ITEMS_PER_RUN.
 * Prevents backlog explosion and keeps daily AI token usage sustainable.
 */
function filterAndLimitItems(items) {
  const cutoff = Date.now() - MAX_AGE_HOURS * 60 * 60 * 1000;
  return items
    .filter((item) => new Date(item.publishedDate).getTime() >= cutoff)
    .sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate))
    .slice(0, MAX_ITEMS_PER_RUN);
}

async function processNewsItem(rawItem) {
  const exists = await News.findOne({ link: rawItem.link });
  if (exists) {
    return { status: "skipped" };
  }

  const newsDoc = new News({
    title: rawItem.title,
    link: rawItem.link,
    sourceName: rawItem.sourceName,
    publishedDate: rawItem.publishedDate,
    originalSummary: rawItem.originalSummary,
    imageUrl: rawItem.imageUrl,
  });
  await newsDoc.save();

  try {
    const { explanations, provider } = await generateExplanations(rawItem);
    const audioUrls = await generateAllAudio(newsDoc._id.toString(), explanations);

    for (const lang of LANGUAGES) {
      newsDoc.explanations[lang] = {
        text: explanations[lang] || "",
        audioUrl: audioUrls[lang] || "",
      };
    }
    newsDoc.aiProvider = provider;
    newsDoc.processed = true;
    await newsDoc.save();

    console.log(`✅ Processed: "${newsDoc.title}" (via ${provider})`);
    return { status: "processed", news: newsDoc };
  } catch (error) {
    console.error(`❌ Failed to process "${rawItem.title}": ${error.message}`);
    return { status: "failed" };
  }
}

async function runDailyPipeline() {
  console.log("🚀 Starting daily news pipeline...");
  const startTime = Date.now();

  const allItems = await fetchAllNews();
  const rawItems = filterAndLimitItems(allItems);
  console.log(`📋 ${allItems.length} total fetched → ${rawItems.length} selected (recent + capped)`);

  const counts = { processed: 0, skipped: 0, failed: 0 };
  let consecutiveFailures = 0;

  for (const item of rawItems) {
    const result = await processNewsItem(item);
    counts[result.status]++;

    if (result.status === "failed") {
      consecutiveFailures++;
      if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
        console.error(
          `🛑 ${MAX_CONSECUTIVE_FAILURES} consecutive failures — AI quota likely exhausted. Stopping this run early.`
        );
        break;
      }
    } else {
      consecutiveFailures = 0;
    }

    if (result.status !== "skipped") {
      await sleep(4000);
    }
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(
    `🏁 Pipeline complete in ${duration}s — Processed: ${counts.processed}, Skipped: ${counts.skipped}, Failed: ${counts.failed}`
  );

  return counts;
}

module.exports = { runDailyPipeline, processNewsItem };