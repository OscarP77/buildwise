import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "No query provided" }, { status: 400 });
    }

    const serpApiKey = process.env.SERPAPI_KEY;

    const url = `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(
      query
    )}&hl=sv&gl=se&api_key=${serpApiKey}`;

    const res = await fetch(url);
    const data = await res.json();

    if (!data.shopping_results) {
      return NextResponse.json({
        message: "Inga resultat hittades just nu.",
        items: [],
      });
    }

    const results = data.shopping_results.slice(0, 5).map((item) => ({
      title: item.title,
      price: item.extracted_price,
      source: item.source,
      link: item.link,
      thumbnail: item.thumbnail,
    }));

    return NextResponse.json({ items: results });
  } catch (err) {
    console.error("SerpAPI error:", err);
    return NextResponse.json(
      { error: "Failed to fetch prices" },
      { status: 500 }
    );
  }
}
