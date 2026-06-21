import { useState, useEffect } from "react";
import { fetchNewsList } from "../services/api.js";
import NewsList from "../components/NewsList.jsx";

function Home() {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadNews() {
      try {
        setLoading(true);
        const data = await fetchNewsList(1, 20);
        setNewsItems(data.news);
      } catch (err) {
        console.error(err);
        setError("Could not load news. Check if the backend is running.");
      } finally {
        setLoading(false);
      }
    }
    loadNews();
  }, []);

  if (loading) {
    return <div className="state-message">Loading latest cybersecurity news...</div>;
  }

  if (error) {
    return <div className="state-message">{error}</div>;
  }

  return (
    <div>
      <NewsList newsItems={newsItems} />
    </div>
  );
}

export default Home;