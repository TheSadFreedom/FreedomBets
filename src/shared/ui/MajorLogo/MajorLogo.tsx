import { useEffect, useMemo, useState } from "react";
import { Avatar, Box, Typography } from "@mui/material";
import { findMajorLogoSrc, buildMajorLogoCandidates } from "@/shared/lib/logos/majorLogo";
import { fetchStaticMajors } from "@/shared/lib/majors/staticMajors";
import OrganizationLogo from "@/shared/ui/OrganizationLogo/OrganizationLogo";
import { useMultiSrcLogo } from "@/shared/ui/logo/useMultiSrcLogo";
import { logoAvatarSx } from "@/shared/ui/OrganizationLogo/OrganizationLogo.styled";

interface MajorLogoProps {
  eventOrganization: string;
  eventName: string;
  size?: number;
  showName?: boolean;
}

interface MajorLogoState {
  key: string;
  src: string | null;
  loaded: boolean;
}

const MajorLogo = ({
  eventOrganization,
  eventName,
  size = 32,
  showName = false,
}: MajorLogoProps) => {
  const majorKey = `${eventOrganization}\0${eventName}`;
  const [state, setState] = useState<MajorLogoState>({
    key: "",
    src: null,
    loaded: false,
  });

  useEffect(() => {
    let cancelled = false;

    void fetchStaticMajors().then((manifest) => {
      if (cancelled) return;
      setState({
        key: majorKey,
        src: findMajorLogoSrc(manifest, eventOrganization, eventName),
        loaded: true,
      });
    });

    return () => {
      cancelled = true;
    };
  }, [majorKey, eventOrganization, eventName]);

  const isCurrent = state.key === majorKey;
  const manifestSrc = isCurrent ? state.src : null;
  const manifestLoaded = isCurrent ? state.loaded : false;

  const candidateSrcs = useMemo(
    () => buildMajorLogoCandidates(eventOrganization, eventName),
    [eventOrganization, eventName]
  );

  const srcs = useMemo(() => {
    if (manifestSrc) return [manifestSrc];
    if (!manifestLoaded) return [];
    return candidateSrcs;
  }, [manifestSrc, manifestLoaded, candidateSrcs]);

  const { src, failed, handleError } = useMultiSrcLogo(srcs);
  const label = eventName.trim() || eventOrganization.trim();
  const initials = label.slice(0, 2).toUpperCase() || "?";

  if (manifestLoaded && (failed || !src)) {
    return (
      <OrganizationLogo name={eventOrganization} size={size} showName={showName} />
    );
  }

  if (!src) {
    return (
      <Box display="inline-flex" alignItems="center" gap={0.75} minWidth={0}>
        <Avatar sx={logoAvatarSx(size, true)}>{initials}</Avatar>
        {showName && (
          <Typography variant="body2" noWrap title={label} fontWeight={600}>
            {label}
          </Typography>
        )}
      </Box>
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
