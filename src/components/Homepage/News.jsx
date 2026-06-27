import { useEffect, useState } from "react";
import "./homepage.css";

export default function News() {
  const [news, setNews] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchNews = async () => {
      try {
        const response = await fetch(
          `/v2/top-headlines?country=us&category=business&apiKey=${process.env.REACT_APP_NEWS_API_KEY}`,
          { signal: controller.signal },
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || `News request failed (${response.status})`,
          );
        }

        if (!data.articles?.length) {
          throw new Error("The news API returned no articles");
        }

        setNews(data.articles[0]);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("News is currently unavailable.");
          console.error(err);
        }
      }
    };

    fetchNews();

    return () => controller.abort();
  }, []);

  if (error) return <div className="news news--des">{error}</div>;
  if (!news) return <div className="news news--des">Loading news...</div>;

  const publishedDate = new Date(news.publishedAt);
  const dateOptions = { year: "numeric", month: "numeric", day: "numeric" };
  const timeOptions = { hour: "2-digit", minute: "2-digit", second: "2-digit" };
  const formattedDate = publishedDate.toLocaleDateString("en-US", dateOptions);
  const formattedTime = publishedDate.toLocaleTimeString("en-US", timeOptions);
  const formattedDateTime = `${formattedDate} | ${formattedTime}`;

  return (
    <div className="news">
      <div
        className="news--img"
        style={{
          backgroundImage: `url(${news.urlToImage}) `,
          backgroundSize: "cover",
        }}
      >
        <div className="news--title">
          {news.title}
          <p className="date--time">{formattedDateTime}</p>
        </div>
      </div>
      <div className="news--des">{news.description}</div>
    </div>
  );
}
