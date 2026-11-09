import { NextResponse } from "next/server";

export const revalidate = 900; // revalidate every 15 minutes

export type YouTubeVideo = {
  id: string;
  title: string;
  description: string;
  youtube_id: string;
  preached_on: string;
};

// Extracts video items from YouTube XML RSS feed without external dependencies
function parseRssFeed(xml: string): YouTubeVideo[] {
  const videos: YouTubeVideo[] = [];
  const entries = xml.split("<entry>").slice(1);

  for (const entry of entries) {
    const idMatch = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
    const titleMatch = entry.match(/<title>([^<]+)<\/title>/);
    const descMatch = entry.match(/<media:description>([^<]*)<\/media:description>/);
    const pubMatch = entry.match(/<published>([^<]+)<\/published>/);

    if (idMatch && titleMatch) {
      const vid = idMatch[1].trim();
      const rawTitle = titleMatch[1].trim();
      const title = rawTitle
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");

      const rawDesc = descMatch ? descMatch[1].trim() : "";
      const description = rawDesc
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");

      const published = pubMatch ? pubMatch[1].split("T")[0] : "";

      videos.push({
        id: `yt-${vid}`,
        title,
        description,
        youtube_id: vid,
        preached_on: published,
      });
    }
  }

  return videos;
}

// Resolves channel ID from a direct ID, channel URL, or @handle
async function resolveChannelId(input: string): Promise<string | null> {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Direct channel ID (starts with UC followed by 22 chars)
  if (/^UC[\w-]{22}$/.test(trimmed)) {
    return trimmed;
  }

  // URL with /channel/UC...
  const channelMatch = trimmed.match(/\/channel\/(UC[\w-]{22})/);
  if (channelMatch) {
    return channelMatch[1];
  }

  // Extract handle: @name or youtube.com/@name
  const handleMatch = trimmed.match(/@([\w.-]+)/);
  if (handleMatch) {
    const handle = `@${handleMatch[1]}`;
    try {
      const pageRes = await fetch(`https://www.youtube.com/${handle}`, {
        next: { revalidate: 86400 },
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept-Language": "en-US,en;q=0.9",
        },
      });
      if (pageRes.ok) {
        const html = await pageRes.text();
        const idMatch = html.match(/"channelId":"(UC[\w-]{22})"/);
        if (idMatch) return idMatch[1];
        const metaMatch = html.match(/<meta itemprop="channelId" content="(UC[\w-]{22})"/);
        if (metaMatch) return metaMatch[1];
        const browseMatch = html.match(/"browseId":"(UC[\w-]{22})"/);
        if (browseMatch) return browseMatch[1];
      }
    } catch {
      // Fallback
    }
  }

  return null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawChannel = searchParams.get("channel_id") || searchParams.get("channel_url") || searchParams.get("url") || "";
  const playlistId = searchParams.get("playlist_id");

  let feedUrl = "";

  if (playlistId) {
    feedUrl = `https://www.youtube.com/feeds/videos.xml?playlist_id=${encodeURIComponent(playlistId)}`;
  } else if (rawChannel) {
    const resolvedId = await resolveChannelId(rawChannel);
    if (resolvedId) {
      feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(resolvedId)}`;
    }
  }

  if (!feedUrl) {
    return NextResponse.json({ ok: false, error: "no_valid_channel_or_playlist", videos: [] });
  }

  try {
    const res = await fetch(feedUrl, {
      next: { revalidate: 900 },
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; AkintolaSamuelSite/1.0)",
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: `YouTube feed responded with ${res.status}` },
        { status: 502 }
      );
    }

    const xml = await res.text();
    const videos = parseRssFeed(xml);

    return NextResponse.json({ ok: true, videos, count: videos.length });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch YouTube feed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
