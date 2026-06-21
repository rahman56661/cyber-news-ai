import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchNewsById } from "../services/api.js";
import NewsDetail from "../components/NewsDetail.jsx";

function NewsDetailPage() {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadNews() {
      try {
        setLoading(true);
        const data = await fetchNewsById(id);
        setNews(data);
      } catch (err) {
        console.error(err);
        setError("Could not load this news item.");
      } finally {
        setLoading(false);
      }
    }
    loadNews();
  }, [id]);

  if (loading) {
    return <div className="state-message">Loading...</div>;
  }

  if (error || !news) {
    return <div className="state-message">{error || "News not found."}</div>;
  }

  return (
    <div>
      <Link to="/" className="back-link mono">
        ← Back
      </Link>
      <NewsDetail news={news} />
    </div>
  );
}

export default NewsDetailPage;