import { useEffect, useState } from "react";
import {
  TEAM_LOGOS_MANIFEST_URL,
  type TeamLogoManifestItem,
} from "@/shared/lib/logos/teamLogo";

export function useTeamLogosManifest(): TeamLogoManifestItem[] {
  const [items, setItems] = useState<TeamLogoManifestItem[]>([]);

  useEffect(() => {
    let cancelled = false;

    void fetch(TEAM_LOGOS_MANIFEST_URL)
      .then((res) => (res.ok ? res.json() : []))
      .then((data: unknown) => {
        if (cancelled || !Array.isArray(data)) return;
        setItems(
          data.filter(
            (item): item is TeamLogoManifestItem =>
              typeof item === "object" &&
              item != null &&
              typeof (item as TeamLogoManifestItem).id === "string" &&
              typeof (item as TeamLogoManifestItem).src === "string"
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
