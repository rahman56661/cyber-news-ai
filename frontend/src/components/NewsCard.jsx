import { Link } from "react-router-dom";
import { getSeverity } from "../utils/severity.js";
import { timeAgo } from "../utils/timeAgo.js";

function NewsCard({ news }) {
  const severity = getSeverity(news.title);

  return (
    <Link to={`/news/${news._id}`} className="news-card">
      <div className="news-card-top">
        <span className={`badge badge-${severity}`}>{severity}</span>
        <span className="news-card-time mono">{timeAgo(news.publishedDate)}</span>
      </div>
      <h3 className="news-card-title">{news.title}</h3>
      <div className="news-card-source mono">{news.sourceName}</div>
    </Link>
  );
}

export default NewsCard;