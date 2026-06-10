import { useMemo } from "react";
import { Avatar, Box, Typography } from "@mui/material";
import { buildTeamLogoCandidates, teamLogoSrc } from "@/shared/lib/logos/teamLogo";
import { useLogoWithFallback } from "@/shared/ui/logo/useLogoWithFallback";
import { useMultiSrcLogo } from "@/shared/ui/logo/useMultiSrcLogo";
import { logoAvatarSx } from "./TeamLogo.styled";

interface TeamLogoProps {
  name: string;
  logoSlug?: string | null;
  size?: number;
  showName?: boolean;
  /** Перенос длинного названия на новую строку (для ячеек таблицы) */
  nameWrap?: boolean;
}

const TeamLogo = ({
  name,
  logoSlug,
  size = 28,
  showName = false,
  nameWrap = false,
}: TeamLogoProps) => {
  const slugCandidates = useMemo(
    () => (logoSlug?.trim() ? buildTeamLogoCandidates(logoSlug) : []),
    [logoSlug]
  );
  const slugLogo = useMultiSrcLogo(slugCandidates);
  const nameLogo = useLogoWithFallback(name, (extIndex) => teamLogoSrc(name, extIndex));
  const useSlug = Boolean(logoSlug?.trim());
  const { src, failed, handleError } = useSlug ? slugLogo : nameLogo;

  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase() || "?";

  return (
    <Box
      display="flex"
      alignItems="center"
      gap={nameWrap && showName ? 1 : 0.75}
      minWidth={0}
      sx={showName ? { width: "100%", maxWidth: "100%" } : undefined}
    >
      <Avatar
        src={src}
        alt={name}
        onError={handleError}
        sx={logoAvatarSx(size, failed)}
      >
        {failed ? initials : null}
      </Avatar>
      {showName && (
        <Typography
          variant={nameWrap ? "body1" : "body2"}
          title={name}
          sx={
            nameWrap
              ? {
                  minWidth: 0,
                  flex: 1,
                  lineHeight: 1.35,
                  fontWeight: 500,
                  wordBreak: "break-word",
                  overflowWrap: "anywhere",
                  whiteSpace: "normal",
                }
              : {
                  minWidth: 0,
                  flex: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }
          }
        >
          {name}
        </Typography>
      )}
    </Box>
  );
};

export default TeamLogo;
