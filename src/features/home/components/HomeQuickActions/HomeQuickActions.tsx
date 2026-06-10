import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import SportsEsportsOutlinedIcon from "@mui/icons-material/SportsEsportsOutlined";
import {
  ActionButton,
  ActionButtonLabel,
  ActionsRoot,
} from "./HomeQuickActions.styled";

interface HomeQuickActionsProps {
  onNewMatch: () => void;
  onNewEvent: () => void;
}

const HomeQuickActions = ({ onNewMatch, onNewEvent }: HomeQuickActionsProps) => (
  <ActionsRoot>
    <ActionButton
      type="button"
      $primary
      onClick={onNewMatch}
      aria-label="Добавить новый матч"
    >
      <SportsEsportsOutlinedIcon />
      <ActionButtonLabel>Новый матч</ActionButtonLabel>
    </ActionButton>

    <ActionButton type="button" onClick={onNewEvent} aria-label="Добавить новый турнир">
      <EmojiEventsOutlinedIcon />
      <ActionButtonLabel>Новый турнир</ActionButtonLabel>
    </ActionButton>
  </ActionsRoot>
);

export default HomeQuickActions;
