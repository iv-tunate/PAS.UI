"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Auto-advancing index. The timer restarts whenever the index changes,
 * so a manual tap never gets followed by an instant automatic jump.
 */
export function useSlideshow(count: number, intervalMs: number) {
  const [index, setIndex] = useState(0);

  const go = useCallback(
    (n: number) => {
      if (count <= 0) return;
      setIndex(((n % count) + count) % count);
    },
    [count]
  );

  useEffect(() => {
    if (count > 0 && index >= count) {
      setIndex(0);
    }
  }, [count, index]);

  useEffect(() => {
    if (count < 2) return;
    const id = setTimeout(() => setIndex((i) => (i + 1) % count), intervalMs);
    return () => clearTimeout(id);
  }, [index, count, intervalMs]);

  const safeIndex = count > 0 && index >= count ? 0 : index;
  return { index: safeIndex, go, next: () => go(safeIndex + 1), prev: () => go(safeIndex - 1) };
}
