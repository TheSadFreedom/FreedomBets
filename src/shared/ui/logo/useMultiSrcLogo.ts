import { useState } from "react";
import { SITE_LOGO_SRC } from "@/shared/lib/logos/assetLogo";

export function useMultiSrcLogo(srcs: string[]) {
  const srcsKey = srcs.join("\0");
  const [index, setIndex] = useState(0);
  const [useSiteLogo, setUseSiteLogo] = useState(srcs.length === 0);
  const [failed, setFailed] = useState(false);
  const [trackedKey, setTrackedKey] = useState(srcsKey);

  if (trackedKey !== srcsKey) {
    setTrackedKey(srcsKey);
    setIndex(0);
    setUseSiteLogo(srcs.length === 0);
    setFailed(false);
  }

  const src = failed ? undefined : useSiteLogo ? SITE_LOGO_SRC : srcs[index];

  const handleError = () => {
    if (!useSiteLogo) {
      if (index + 1 < srcs.length) {
        setIndex((current) => current + 1);
        return;
      }
      setUseSiteLogo(true);
      return;
    }
    setFailed(true);
  };

  return { src, failed, handleError };
}
