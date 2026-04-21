"use client";

import { useEffect, useState } from "react";
import { getPhoto } from "@/lib/db";

export function PhotoThumb({
  id,
  className = "",
  alt = "",
}: {
  id: string;
  className?: string;
  alt?: string;
}) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    let objectUrl: string | null = null;
    (async () => {
      const p = await getPhoto(id);
      if (!p || !active) return;
      objectUrl = URL.createObjectURL(p.blob);
      setUrl(objectUrl);
    })();
    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [id]);

  if (!url) {
    return (
      <div
        className={`bg-[var(--border)] animate-pulse ${className}`}
        aria-hidden
      />
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={url} alt={alt} className={className} />;
}
