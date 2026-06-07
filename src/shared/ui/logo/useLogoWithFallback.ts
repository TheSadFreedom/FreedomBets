import { useState } from "react";
import { SITE_LOGO_SRC, nextLogoExtensionIndex } from "@/shared/lib/logos/assetLogo";

export function useLogoWithFallback(
  name: string,
  getSrc: (extensionIndex: number) => string
) {
  const [extIndex, setExtIndex] = useState(0);
  const [useSiteLogo, setUseSiteLogo] = useState(false);
  const [failed, setFailed] = useState(false);
  const [trackedName, setTrackedName] = useState(name);

  if (trackedName !== name) {
    setTrackedName(name);
    setExtIndex(0);
    setUseSiteLogo(false);
    setFailed(false);
  }

  const src = failed ? undefined : useSiteLogo ? SITE_LOGO_SRC : getSrc(extIndex);

  const handleError = () => {
    if (!useSiteLogo) {
      const next = nextLogoExtensionIndex(extIndex);
      if (next !== null) {
        setExtIndex(next);
        return;
      }
      setUseSiteLogo(true);
      return;
    }
    setFailed(true);
  };

  return { src, failed, handleError };
}
