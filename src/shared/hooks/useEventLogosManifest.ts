import { useEffect, useState } from "react";
import {
  EVENT_LOGOS_MANIFEST_URL,
  type EventLogoManifestItem,
} from "@/shared/lib/logos/eventLogo";

export function useEventLogosManifest(): EventLogoManifestItem[] {
  const [items, setItems] = useState<EventLogoManifestItem[]>([]);

  useEffect(() => {
    let cancelled = false;

    void fetch(EVENT_LOGOS_MANIFEST_URL)
      .then((res) => (res.ok ? res.json() : []))
      .then((data: unknown) => {
        if (cancelled || !Array.isArray(data)) return;
        setItems(
          data.filter(
            (item): item is EventLogoManifestItem =>
              typeof item === "object" &&
              item != null &&
              typeof (item as EventLogoManifestItem).id === "string" &&
              typeof (item as EventLogoManifestItem).src === "string"
          )
        );
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return items;
}
