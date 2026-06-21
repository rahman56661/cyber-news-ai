const News = require("../models/News");
const { runDailyPipeline } = require("../services/newsProcessor");

/**
 * GET /api/news
 * Returns paginated list of processed news (latest first)
 */
async function getAllNews(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const news = await News.find({ processed: true })
            .sort({ publishedDate: -1 })
            .skip(skip)
            .limit(limit)
            .select("-originalSummary"); // never expose raw RSS snippet publicly

        const total = await News.countDocuments({ processed: true });

        res.json({
            news,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error(`❌ getAllNews error: ${error.message}`);
        res.status(500).json({ error: "Failed to fetch news" });
    }
}

/**
 * GET /api/news/:id
 * Returns full detail of a single news item (all 4 language explanations + audio)
 */
async function getNewsById(req, res) {
    try {
        const news = await News.findById(req.params.id).select("-originalSummary");
        if (!news) {
            return res.status(404).json({ error: "News not found" });
        }
        res.json({ news });
    } catch (error) {
        console.error(`❌ getNewsById error: ${error.message}`);
        res.status(500).json({ error: "Failed to fetch news detail" });
    }
}

/**
 * POST /api/news/refresh
 * Manually triggers the daily pipeline — for testing, no need to wait till 7 AM.
 * Protected by a simple secret header so randoms can't trigger your AI quota.
 */
async function triggerManualRefresh(req, res) {
    const providedSecret = req.headers["x-refresh-secret"];
    if (providedSecret !== process.env.REFRESH_SECRET) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    // Respond immediately — pipeline runs in background (can take several minutes)
    res.json({ message: "Pipeline started in background" });

    try {
        console.log("🔄 Manual refresh triggered via API");
        await runDailyPipeline();
    } catch (error) {
        console.error(`❌ Manual refresh error: ${error.message}`);
    }
}

module.exports = { getAllNews, getNewsById, triggerManualRefresh };