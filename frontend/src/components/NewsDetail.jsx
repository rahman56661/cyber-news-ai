import { useState } from "react";
import { getSeverity } from "../utils/severity.js";
import { timeAgo } from "../utils/timeAgo.js";
import LanguageSwitcher from "./LanguageSwitcher.jsx";
import AudioPlayer from "./AudioPlayer.jsx";

function NewsDetail({ news }) {
  const [activeLang, setActiveLang] = useState("en");
  const severity = getSeverity(news.title);
  const explanation = news.explanations?.[activeLang];

  return (
    <article className="news-detail">
      <div className="news-detail-top">
        <span className={`badge badge-${severity}`}>{severity}</span>
        <span className="news-detail-time mono">{timeAgo(news.publishedDate)}</span>
      </div>

      <h1 className="news-detail-title">{news.title}</h1>
      <div className="news-detail-source mono">
        {news.sourceName} ·{" "}
        <a href={news.link} target="_blank" rel="noopener noreferrer">
          Read original ↗
        </a>
      </div>

      <LanguageSwitcher activeLang={activeLang} onChange={setActiveLang} />

      {explanation?.audioUrl ? (
        <AudioPlayer src={`/api/news/${news._id}/audio/${activeLang}`} />
      ) : (
        <div className="audio-unavailable mono">Audio not available for this language</div>
      )}

      <p className="news-detail-text" lang={activeLang}>
        {explanation?.text || "Explanation not available."}
      </p>
    </article>
  );
}

export default NewsDetail;