const Parser = require("rss-parser");
const { RSS_SOURCES } = require("../config/sources");

const parser = new Parser({
  timeout: 10000, // 10 sec timeout per feed
  headers: { "User-Agent": "Mozilla/5.0 (CyberNewsAI Bot)" },
});

/**
 * Extracts a usable image URL from an RSS item, if present
 */
function extractImage(item) {
  if (item.enclosure && item.enclosure.url) return item.enclosure.url;
  if (item["media:content"] && item["media:content"]["$"]) {
    return item["media:content"]["$"].url;
  }
  return "";
}

/**
 * Fetches and parses a single RSS source
 */
async function fetchSingleSource(source) {
  try {
    const feed = await parser.parseURL(source.url);

    return feed.items.map((item) => ({
      title: (item.title || "").trim(),
      link: item.link || item.guid || "",
      sourceName: source.name,
      publishedDate: item.isoDate ? new Date(item.isoDate) : new Date(),
      originalSummary: (item.contentSnippet || item.summary || "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 500), // cap length, this is only AI context, not for display
      imageUrl: extractImage(item),
    }));
  } catch (error) {
    console.error(`⚠️  Failed to fetch ${source.name}: ${error.message}`);
    return []; // one source failing should never break the whole pipeline
  }
}

/**
 * Fetches all 5 sources in parallel, returns combined flat array
 */
async function fetchAllNews() {
  console.log("📡 Fetching news from all sources...");

  const results = await Promise.allSettled(
    RSS_SOURCES.map((source) => fetchSingleSource(source))
  );

  const allItems = results
    .filter((r) => r.status === "fulfilled")
    .flatMap((r) => r.value)
    .filter((item) => item.title && item.link); // drop malformed entries

  console.log(`📰 Fetched ${allItems.length} total items from ${RSS_SOURCES.length} sources`);
  return allItems;
}

module.exports = { fetchAllNews };