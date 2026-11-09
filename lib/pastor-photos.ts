"use client";

import { useMemo } from "react";
import { useContent } from "@/contexts/ContentContext";
import { optimizedImage } from "@/lib/cloudinary";
import {
  ABOUT_PHOTO_COUNT,
  CHURCH_PHOTO_COUNT,
  HERO_PHOTO_FALLBACK,
  HERO_PHOTO_KEY,
  HERO_PHOTO_PLACEHOLDER,
  STAGE_PHOTO_COUNT,
  aboutPhotoFallback,
  aboutPhotoKey,
  aboutPhotoPlaceholder,
  churchPhotoFallback,
  churchPhotoKey,
  churchPhotoPlaceholder,
  stagePhotoFallback,
  stagePhotoKey,
  stagePhotoPlaceholder,
} from "@/lib/content-defaults";

export type Photo = { src: string; fallback: string };

/**
 * Single image for the Hero section.
 * Configurable by the admin through the "hero.photo" key.
 */
export function useHeroPhoto(width = 1600): Photo {
  const { get } = useContent();

  return useMemo(() => {
    const custom = get(HERO_PHOTO_KEY) || get("hero.image");
    return {
      src: custom ? optimizedImage(custom, width) : HERO_PHOTO_PLACEHOLDER,
      fallback: HERO_PHOTO_FALLBACK,
    };
  }, [get, width]);
}

/**
 * Up to 3 photos of Pastor Akin for the About section card.
 * If 1 photo is available/uploaded, only 1 is returned (no rotation).
 * If 2 or 3 are available, transitions between available ones only.
 * Empty/unconfigured slots are not shown as placeholders alongside available photos.
 * If no custom photos are configured at all, returns 1 default placeholder.
 */
export function useAboutPhotos(width = 900): Photo[] {
  const { get, isCustom } = useContent();

  return useMemo(() => {
    const customPhotos: Photo[] = [];
    for (let i = 1; i <= ABOUT_PHOTO_COUNT; i++) {
      const customUrl = get(aboutPhotoKey(i));
      const hasCustom = isCustom(aboutPhotoKey(i));
      if (hasCustom && customUrl) {
        customPhotos.push({
          src: optimizedImage(customUrl, width),
          fallback: aboutPhotoFallback(i),
        });
      }
    }

    if (customPhotos.length > 0) {
      return customPhotos;
    }

    return [
      {
        src: aboutPhotoPlaceholder(1),
        fallback: aboutPhotoFallback(1),
      },
    ];
  }, [get, isCustom, width]);
}

/**
 * Up to 4 full-screen photos beneath the About section (PhotoStage).
 * Completely separate from the About section photos.
 * If 1 photo is available/uploaded, only 1 is returned.
 * If 2, 3, or 4 are available, transitions between available ones only.
 * No placeholders are mixed in with uploaded photos.
 * If no custom photos are configured at all, returns 1 default placeholder.
 */
export function useStagePhotos(width = 1600): Photo[] {
  const { get, isCustom } = useContent();

  return useMemo(() => {
    const customPhotos: Photo[] = [];
    for (let i = 1; i <= STAGE_PHOTO_COUNT; i++) {
      const customUrl = get(stagePhotoKey(i));
      const hasCustom = isCustom(stagePhotoKey(i));
      if (hasCustom && customUrl) {
        customPhotos.push({
          src: optimizedImage(customUrl, width),
          fallback: stagePhotoFallback(i),
        });
      }
    }

    if (customPhotos.length > 0) {
      return customPhotos;
    }

    return [
      {
        src: stagePhotoPlaceholder(1),
        fallback: stagePhotoFallback(1),
      },
    ];
  }, [get, isCustom, width]);
}

/**
 * Photos of Pastor Akin for the stage section.
 */
export function usePastorPhotos(offset = 0, width = 1600): Photo[] {
  const photos = useStagePhotos(width);
  return useMemo(() => {
    if (photos.length === 0) return [];
    return photos.map((_, i) => photos[(i + offset) % photos.length]);
  }, [photos, offset]);
}

export function useChurchPhotos(width = 1200): Photo[] {
  const { get, isCustom } = useContent();

  return useMemo(() => {
    const customPhotos: Photo[] = [];
    for (let i = 1; i <= CHURCH_PHOTO_COUNT; i++) {
      const customUrl = get(churchPhotoKey(i));
      const hasCustom = isCustom(churchPhotoKey(i));
      if (hasCustom && customUrl) {
        customPhotos.push({
          src: optimizedImage(customUrl, width),
          fallback: churchPhotoFallback(i),
        });
      }
    }

    if (customPhotos.length > 0) {
      return customPhotos;
    }

    // Default stand-in when no church photos have been uploaded yet
    return [
      {
        src: churchPhotoPlaceholder(1),
        fallback: churchPhotoFallback(1),
      },
    ];
  }, [get, isCustom, width]);
}
