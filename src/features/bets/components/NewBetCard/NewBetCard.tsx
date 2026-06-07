import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  ActionWrap,
  Content,
  IconWrap,
  NewBetCardRoot,
  PendingNote,
  Subtitle,
  Tag,
  TagsRow,
  Title,
} from "./NewBetCard.styled";

interface NewBetCardProps {
  onClick: () => void;
  pendingCount?: number;
}

const NewBetCard = ({ onClick, pendingCount = 0 }: NewBetCardProps) => (
  <NewBetCardRoot type="button" onClick={onClick} aria-label="Добавить новую ставку">
    <IconWrap>
      <AddCircleOutlineIcon />
    </IconWrap>

    <Content>
      <Title>Новая ставка</Title>
      <Subtitle>Матч, карта или пистолетный раунд · BO1 / BO3 / BO5</Subtitle>
      <TagsRow>
        <Tag>Победа в матче</Tag>
        <Tag>Карта</Tag>
        <Tag>Пистолет</Tag>
      </TagsRow>
    </Content>

    {pendingCount > 0 ? (
      <PendingNote>
        {pendingCount} в игре
      </PendingNote>
    ) : null}

    <ActionWrap aria-hidden>
      <ChevronRightIcon />
    </ActionWrap>
  </NewBetCardRoot>
);

export default NewBetCard;
