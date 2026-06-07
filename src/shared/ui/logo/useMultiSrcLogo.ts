import { useState } from "react";

export function useMultiSrcLogo(srcs: string[]) {
  const srcsKey = srcs.join("\0");
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState(false);
  const [trackedKey, setTrackedKey] = useState(srcsKey);

  if (trackedKey !== srcsKey) {
    setTrackedKey(srcsKey);
    setIndex(0);
    setFailed(false);
  }

  const src = failed ? undefined : srcs[index];

  const handleError = () => {
    if (index + 1 < srcs.length) {
      setIndex((current) => current + 1);
      return;
    }
    setFailed(true);
  };

  return { src, failed, handleError };
}
