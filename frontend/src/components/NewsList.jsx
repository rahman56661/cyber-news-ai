import NewsCard from "./NewsCard.jsx";

function NewsList({ newsItems }) {
  if (!newsItems || newsItems.length === 0) {
    return (
      <div className="state-message">
        No news yet. Run the pipeline to fetch the latest cybersecurity updates.
      </div>
    );
  }

  return (
    <div className="news-list">
      {newsItems.map((news) => (
        <NewsCard key={news._id} news={news} />
      ))}
    </div>
  );
}

export default NewsList;