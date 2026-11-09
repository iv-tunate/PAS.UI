import { api } from "./api";

type SignedUpload = {
  cloud_name: string;
  api_key: string;
  timestamp: number;
  signature: string;
  folder: string;
};


export type UploadFolder =
  | "courses"
  | "course-files"
  | "pastor-photo"
  | "church-photo"
  | "hero-video"
  | "book-covers"
  | "books"
  | "events";

/** Folders that only ever hold pictures. */
const IMAGE_FOLDERS: UploadFolder[] = ["courses", "pastor-photo", "church-photo", "book-covers", "events"];

/**
 * Cloudinary stores pictures as "image", video and audio as "video",
 * and everything else (PDF, EPUB, ZIP) as "raw". The URL path needs the right one.
 */
function resourceTypeFor(file: File, folder: UploadFolder): "image" | "video" | "raw" {
  if (IMAGE_FOLDERS.includes(folder)) return "image";
  if (folder === "hero-video") return "video";
  if (file.type.startsWith("video/") || file.type.startsWith("audio/")) return "video";
  if (file.type.startsWith("image/")) return "image";
  return "raw";
}

/**
 * Uploads straight from the browser to Cloudinary with a signature from
 * our API (the Cloudinary secret never leaves the server). `onProgress`
 * gets 0 to 100, which matters for big video files.
 */
export async function uploadToCloudinary(
  file: File,
  folder: UploadFolder,
  onProgress?: (percent: number) => void
): Promise<string> {
  const signed = await api.get<SignedUpload>(`/admin/uploads/signature?folder=${folder}`, true);
  const endpoint = `https://api.cloudinary.com/v1_1/${signed.cloud_name}/${resourceTypeFor(file, folder)}/upload`;

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", signed.api_key);
  form.append("timestamp", String(signed.timestamp));
  form.append("signature", signed.signature);
  form.append("folder", signed.folder);

  return new Promise<string>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", endpoint);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onerror = () => reject(new Error("The upload was interrupted. Check your connection and try again."));
    xhr.onload = () => {
      let body: { secure_url?: string; error?: { message?: string } } = {};
      try {
        body = JSON.parse(xhr.responseText);
      } catch {}
      if (xhr.status >= 200 && xhr.status < 300 && body.secure_url) resolve(body.secure_url);
      else reject(new Error(body.error?.message || "Upload failed. The file may be too large for your Cloudinary plan."));
    };
    xhr.send(form);
  });
}

/**
 * Serves a Cloudinary photo as an appropriately sized, auto-formatted
 * image: AVIF/WebP where supported, quality chosen automatically, and
 * never upscaled past the original (c_limit). Non-Cloudinary URLs
 * and ones already carrying a transformation pass through untouched.
 */
export function optimizedImage(url: string, width = 1600): string {
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) return url;
  if (/\/upload\/[a-z]_/.test(url)) return url;
  return url.replace("/upload/", `/upload/f_auto,q_auto:good,c_limit,w_${width}/`);
}
