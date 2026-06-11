import { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { buildEventLogoCandidates } from "@/shared/lib/logos/eventLogo";
import { useMultiSrcLogo } from "@/shared/ui/logo/useMultiSrcLogo";
import LogoAvatar from "@/shared/ui/logo/LogoAvatar";

interface EventLogoProps {
  logoSlug?: string | null;
  label?: string;
  size?: number;
  showName?: boolean;
}

const EventLogo = ({ logoSlug, label = "", size = 28, showName = false }: EventLogoProps) => {
  const candidateSrcs = useMemo(
    () => (logoSlug?.trim() ? buildEventLogoCandidates(logoSlug) : []),
    [logoSlug]
  );
  const { src, failed, handleError } = useMultiSrcLogo(candidateSrcs);
  const displayLabel = label.trim() || logoSlug?.trim() || "Турнир";
  const initials = displayLabel.trim().slice(0, 2).toUpperCase() || "?";

  return (
    <Box display="inline-flex" alignItems="center" gap={0.75} minWidth={0}>
      <LogoAvatar
        size={size}
        src={src}
        alt={displayLabel}
        failed={failed}
        onError={handleError}
      >
        {initials}
      </LogoAvatar>
      {showName ? (
        <Typography variant="body2" noWrap title={displayLabel} fontWeight={600}>
          {displayLabel}
        </Typography>
      ) : null}
    </Box>
  );
};

export default EventLogo;
