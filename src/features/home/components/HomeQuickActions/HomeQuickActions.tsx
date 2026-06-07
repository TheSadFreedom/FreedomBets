import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import SportsEsportsOutlinedIcon from "@mui/icons-material/SportsEsportsOutlined";
import { ActionButton, ActionsRoot } from "./HomeQuickActions.styled";

interface HomeQuickActionsProps {
  onNewMatch: () => void;
  onNewEvent: () => void;
}

const HomeQuickActions = ({ onNewMatch, onNewEvent }: HomeQuickActionsProps) => (
  <ActionsRoot>
    <ActionButton type="button" onClick={onNewMatch} aria-label="Добавить новый матч">
      <SportsEsportsOutlinedIcon />
      Новый матч
    </ActionButton>

    <ActionButton type="button" onClick={onNewEvent} aria-label="Добавить новый турнир">
      <EmojiEventsOutlinedIcon />
      Новый турнир
    </ActionButton>
  </ActionsRoot>
);

export default HomeQuickActions;
