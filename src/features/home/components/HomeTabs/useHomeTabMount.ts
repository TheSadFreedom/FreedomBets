import { useState } from "react";

export function useHomeTabMount(initialTab = 0) {
  const [tab, setTabState] = useState(initialTab);
  const [mountedTabs, setMountedTabs] = useState<ReadonlySet<number>>(() => new Set([initialTab]));

  const setTab = (nextTab: number) => {
    setTabState(nextTab);
    setMountedTabs((prev) => (prev.has(nextTab) ? prev : new Set([...prev, nextTab])));
  };

  return { tab, setTab, mountedTabs };
}
