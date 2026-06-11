import { useEffect, useState } from "react";

export function useHomeTabMount(initialTab = 0) {
  const [tab, setTab] = useState(initialTab);
  const [mountedTabs, setMountedTabs] = useState<ReadonlySet<number>>(() => new Set([initialTab]));

  useEffect(() => {
    setMountedTabs((prev) => (prev.has(tab) ? prev : new Set([...prev, tab])));
  }, [tab]);

  return { tab, setTab, mountedTabs };
}
