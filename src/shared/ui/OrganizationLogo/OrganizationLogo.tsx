import { Box, Typography } from "@mui/material";
import { orgLogoSrc } from "@/shared/lib/logos/orgLogo";
import { useLogoWithFallback } from "@/shared/ui/logo/useLogoWithFallback";
import LogoAvatar from "@/shared/ui/logo/LogoAvatar";

interface OrganizationLogoProps {
  name: string;
  size?: number;
  showName?: boolean;
}

const OrganizationLogo = ({ name, size = 28, showName = false }: OrganizationLogoProps) => {
  const { src, failed, handleError } = useLogoWithFallback(
    name,
    (extIndex) => orgLogoSrc(name, extIndex)
  );

  const initials = name.trim().slice(0, 2).toUpperCase() || "?";

  return (
    <Box display="inline-flex" alignItems="center" gap={0.75} minWidth={0}>
      <LogoAvatar size={size} src={src} alt={name} failed={failed} onError={handleError}>
        {failed ? initials : null}
      </LogoAvatar>
      {showName && (
        <Typography variant="body2" noWrap title={name} fontWeight={600}>
          {name}
        </Typography>
      )}
    </Box>
  );
};

export default OrganizationLogo;
