"use server";

import * as cheerio from "cheerio";

export type ScrapedURL = {
  url: string;
  title: string | null;
  description: string | null;
  imageUrl: string | null;
  domain: string;
  scrapedAt: string;
  error?: string;
};

export async function scrapeURL(url: string): Promise<ScrapedURL> {
  const result: ScrapedURL = {
    url,
    title: null,
    description: null,
    imageUrl: null,
    domain: extractDomain(url),
    scrapedAt: new Date().toISOString(),
  };

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; VertrexBot/1.0)",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      result.error = `HTTP ${response.status}`;
      return result;
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract metadata
    result.title =
      $('meta[property="og:title"]').attr("content") ||
      $("title").text() ||
      null;

    result.description =
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="description"]').attr("content") ||
      null;

    result.imageUrl =
      $('meta[property="og:image"]').attr("content") ||
      $('meta[property="twitter:image"]').attr("content") ||
      null;

    return result;
  } catch (error) {
    result.error = error instanceof Error ? error.message : "Unknown error";
    return result;
  }
}

function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export async function scrapeAndSummarize(url: string): Promise<{
  scraped: ScrapedURL;
  summary: string | null;
}> {
  const scraped = await scrapeURL(url);

  if (scraped.error || !scraped.description) {
    return { scraped, summary: null };
  }

  // Import dynamically to avoid server/client issues
  const { generateSummary } = await import("@/lib/ai/llm-service");
  const summary = await generateSummary(scraped.description, 3);

  return { scraped, summary };
}
