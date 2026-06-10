import { useMemo } from "react";
import { Avatar, Box, Typography } from "@mui/material";
import { buildMajorLogoCandidates } from "@/shared/lib/logos/majorLogo";
import OrganizationLogo from "@/shared/ui/OrganizationLogo/OrganizationLogo";
import { useMultiSrcLogo } from "@/shared/ui/logo/useMultiSrcLogo";
import { logoAvatarSx } from "@/shared/ui/OrganizationLogo/OrganizationLogo.styled";

interface MajorLogoProps {
  eventOrganization: string;
  eventName: string;
  size?: number;
  showName?: boolean;
}

const MajorLogo = ({
  eventOrganization,
  eventName,
  size = 32,
  showName = false,
}: MajorLogoProps) => {
  const candidateSrcs = useMemo(
    () => buildMajorLogoCandidates(eventOrganization, eventName),
    [eventOrganization, eventName]
  );

  const { src, failed, handleError } = useMultiSrcLogo(candidateSrcs);
  const label = eventName.trim() || eventOrganization.trim();

  if (failed || !src) {
    return (
      <OrganizationLogo name={eventOrganization} size={size} showName={showName} />
    );
  }

  return (
    <Box display="inline-flex" alignItems="center" gap={0.75} minWidth={0}>
      <Avatar
        src={src}
        alt={label}
        onError={handleError}
        sx={logoAvatarSx(size, false)}
      />
      {showName && (
        <Typography variant="body2" noWrap title={label} fontWeight={600}>
          {label}
        </Typography>
      )}
    </Box>
  );
};

export default MajorLogo;
