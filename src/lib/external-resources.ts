import { prisma } from "@/lib/prisma";

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const RESULTS_PER_SOURCE = 8;

type FetchedResource = {
  title: string;
  description: string | null;
  url: string;
  resourceKind: "ARTICLE" | "VIDEO";
  sourceName: string;
};

export async function ensureIndustryResourcesFresh(
  industry: string,
): Promise<void> {
  const cached = await prisma.industryFetchCache.findUnique({
    where: { industry },
  });

  const isStale =
    !cached || Date.now() - cached.lastFetchedAt.getTime() > CACHE_TTL_MS;

  if (!isStale) return;

  const [articles, videos] = await Promise.all([
    fetchGoogleArticles(industry),
    fetchYouTubeVideos(industry),
  ]);

  const results = [...articles, ...videos];

  await Promise.all(
    results.map((resource) =>
      prisma.externalResource.upsert({
        where: { url: resource.url },
        create: { ...resource, industry },
        update: {
          title: resource.title,
          description: resource.description,
        },
      }),
    ),
  );

  await prisma.industryFetchCache.upsert({
    where: { industry },
    create: { industry, lastFetchedAt: new Date() },
    update: { lastFetchedAt: new Date() },
  });
}

async function fetchGoogleArticles(
  industry: string,
): Promise<FetchedResource[]> {
  const apiKey = process.env.GOOGLE_API_KEY;
  const cx = process.env.GOOGLE_CSE_ID;
  if (!apiKey || !cx) return [];

  const url = new URL("https://www.googleapis.com/customsearch/v1");
  url.searchParams.set("key", apiKey);
  url.searchParams.set("cx", cx);
  url.searchParams.set("q", `${industry} career advice resources articles`);
  url.searchParams.set("num", String(RESULTS_PER_SOURCE));

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error("Google Custom Search request failed", res.status);
      return [];
    }
    const data = (await res.json()) as {
      items?: { title: string; link: string; snippet?: string; displayLink?: string }[];
    };

    return (data.items ?? []).map((item) => ({
      title: item.title,
      description: item.snippet ?? null,
      url: item.link,
      resourceKind: "ARTICLE" as const,
      sourceName: item.displayLink ?? "Web",
    }));
  } catch (error) {
    console.error("Google Custom Search request errored", error);
    return [];
  }
}

async function fetchYouTubeVideos(
  industry: string,
): Promise<FetchedResource[]> {
  const apiKey = process.env.YOUTUBE_API_KEY ?? process.env.GOOGLE_API_KEY;
  if (!apiKey) return [];

  const url = new URL("https://www.googleapis.com/youtube/v3/search");
  url.searchParams.set("key", apiKey);
  url.searchParams.set("part", "snippet");
  url.searchParams.set("type", "video");
  url.searchParams.set("maxResults", String(RESULTS_PER_SOURCE));
  url.searchParams.set("q", `${industry} career advice`);

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error("YouTube Data API request failed", res.status);
      return [];
    }
    const data = (await res.json()) as {
      items?: {
        id: { videoId: string };
        snippet: { title: string; description?: string; channelTitle?: string };
      }[];
    };

    return (data.items ?? [])
      .filter((item) => item.id?.videoId)
      .map((item) => ({
        title: item.snippet.title,
        description: item.snippet.description ?? null,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        resourceKind: "VIDEO" as const,
        sourceName: item.snippet.channelTitle ?? "YouTube",
      }));
  } catch (error) {
    console.error("YouTube Data API request errored", error);
    return [];
  }
}
