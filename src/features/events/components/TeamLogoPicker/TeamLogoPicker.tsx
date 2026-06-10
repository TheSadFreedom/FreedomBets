import { Box, Typography } from "@mui/material";
import { useTeamLogosManifest } from "@/shared/hooks/useTeamLogosManifest";
import { formatTeamLogoLabel } from "@/shared/lib/logos/teamLogo";
import TeamLogo from "@/shared/ui/TeamLogo/TeamLogo";
import {
  LogoGrid,
  LogoOption,
  LogoOptionLabel,
  PickerHint,
  PickerRoot,
  PickerTitle,
} from "@/features/events/components/EventLogoPicker/EventLogoPicker.styled";

interface TeamLogoPickerProps {
  value: string | null;
  onChange: (slug: string | null) => void;
  teamName?: string;
}

const TeamLogoPicker = ({ value, onChange, teamName }: TeamLogoPickerProps) => {
  const logos = useTeamLogosManifest();

  return (
    <PickerRoot>
      <PickerTitle>Логотип победителя</PickerTitle>
      <PickerHint>Выберите файл из папки public/teams</PickerHint>
      {logos.length === 0 ? (
        <Typography variant="body2" sx={{ opacity: 0.55 }}>
          Нет файлов в public/teams — добавьте картинки и перезапустите npm start
        </Typography>
      ) : (
        <LogoGrid>
          <LogoOption
            type="button"
            $active={!value}
            onClick={() => onChange(null)}
            title="Авто по названию команды"
          >
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={40}>
              <Typography variant="caption" sx={{ opacity: 0.55, textAlign: "center" }}>
                Авто
              </Typography>
            </Box>
            <LogoOptionLabel>По названию</LogoOptionLabel>
          </LogoOption>
          {logos.map((logo) => {
            const active = value === logo.id;
            return (
              <LogoOption
                key={logo.id}
                type="button"
                $active={active}
                onClick={() => onChange(logo.id)}
                title={formatTeamLogoLabel(logo.id)}
              >
                <Box display="flex" justifyContent="center">
                  <TeamLogo
                    name={teamName || formatTeamLogoLabel(logo.id)}
                    logoSlug={logo.id}
                    size={40}
                  />
                </Box>
                <LogoOptionLabel>{formatTeamLogoLabel(logo.id)}</LogoOptionLabel>
              </LogoOption>
            );
          })}
        </LogoGrid>
      )}
    </PickerRoot>
  );
};

export default TeamLogoPicker;
