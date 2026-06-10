import { Box, Typography } from "@mui/material";
import { useEventLogosManifest } from "@/shared/hooks/useEventLogosManifest";
import { formatEventLogoLabel } from "@/shared/lib/logos/eventLogo";
import EventLogo from "@/shared/ui/EventLogo/EventLogo";
import {
  LogoGrid,
  LogoOption,
  LogoOptionLabel,
  PickerHint,
  PickerRoot,
  PickerTitle,
} from "./EventLogoPicker.styled";

interface EventLogoPickerProps {
  value: string | null;
  onChange: (slug: string) => void;
}

const EventLogoPicker = ({ value, onChange }: EventLogoPickerProps) => {
  const logos = useEventLogosManifest();

  return (
    <PickerRoot>
      <PickerTitle>Логотип турнира</PickerTitle>
      <PickerHint>Выберите файл из папки public/events</PickerHint>
      {logos.length === 0 ? (
        <Typography variant="body2" sx={{ opacity: 0.55 }}>
          Нет файлов в public/events — добавьте картинки и перезапустите npm start
        </Typography>
      ) : (
        <LogoGrid>
          {logos.map((logo) => {
            const active = value === logo.id;
            return (
              <LogoOption
                key={logo.id}
                type="button"
                $active={active}
                onClick={() => onChange(logo.id)}
                title={formatEventLogoLabel(logo.id)}
              >
                <Box display="flex" justifyContent="center">
                  <EventLogo logoSlug={logo.id} label={formatEventLogoLabel(logo.id)} size={40} />
                </Box>
                <LogoOptionLabel>{formatEventLogoLabel(logo.id)}</LogoOptionLabel>
              </LogoOption>
            );
          })}
        </LogoGrid>
      )}
    </PickerRoot>
  );
};

export default EventLogoPicker;
