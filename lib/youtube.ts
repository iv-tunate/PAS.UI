/** Thumbnail YouTube makes for every video. hqdefault exists for all of them. */
export const ytThumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

/** Privacy-friendly embed, started on click so the page loads nothing from YouTube until then. */
export const ytEmbed = (id: string) =>
  `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0&modestbranding=1`;

export const ytWatchUrl = (id: string) => `https://youtu.be/${id}`;

/** Pulls the video id from the usual link shapes. Returns "" if it is not a YouTube link. */
export function parseYouTubeId(input: string): string {
  const v = input.trim();
  if (/^[\w-]{11}$/.test(v)) return v;
  try {
    const u = new URL(v);
    const host = u.hostname.replace(/^www\.|^m\./, "");
    let id = "";
    if (host === "youtu.be") id = u.pathname.slice(1).split("/")[0];
    else if (host === "youtube.com" || host === "youtube-nocookie.com") {
      if (u.pathname === "/watch") id = u.searchParams.get("v") ?? "";
      else {
        const m = u.pathname.match(/^\/(embed|shorts|live|v)\/([\w-]{11})/);
        if (m) id = m[2];
      }
    }
    return /^[\w-]{11}$/.test(id) ? id : "";
  } catch {
    return "";
  }
}
