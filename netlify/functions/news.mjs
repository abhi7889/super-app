const jsonHeaders = {
  "content-type": "application/json; charset=utf-8",
};

export default async () => {
  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({
        status: "error",
        message: "NEWS_API_KEY is not configured in Netlify.",
      }),
      { status: 500, headers: jsonHeaders },
    );
  }

  try {
    const response = await fetch(
      "https://newsapi.org/v2/top-headlines?country=us&category=business",
      { headers: { "X-Api-Key": apiKey } },
    );
    const body = await response.text();

    return new Response(body, {
      status: response.status,
      headers: {
        ...jsonHeaders,
        "cache-control": "public, max-age=300",
      },
    });
  } catch (error) {
    console.error("NewsAPI request failed", error);

    return new Response(
      JSON.stringify({
        status: "error",
        message: "The news service could not be reached.",
      }),
      { status: 502, headers: jsonHeaders },
    );
  }
};
