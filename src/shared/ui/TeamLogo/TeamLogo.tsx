import { Avatar, Box, Typography } from "@mui/material";
import { teamLogoSrc } from "@/shared/lib/logos/teamLogo";
import { useLogoWithFallback } from "@/shared/ui/logo/useLogoWithFallback";
import { logoAvatarSx } from "./TeamLogo.styled";

interface TeamLogoProps {
  name: string;
  size?: number;
  showName?: boolean;
  /** Перенос длинного названия на новую строку (для ячеек таблицы) */
  nameWrap?: boolean;
}

const TeamLogo = ({ name, size = 28, showName = false, nameWrap = false }: TeamLogoProps) => {
  const { src, failed, handleError } = useLogoWithFallback(
    name,
    (extIndex) => teamLogoSrc(name, extIndex)
  );

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
