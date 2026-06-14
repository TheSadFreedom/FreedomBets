import type { Bet } from "@/entities/bet";
import { formatBetDescriptionLines } from "@/entities/bet";
import {
  BetInfo,
  BetMarket,
  BetMeta,
  BetProfile,
  BetStatusChip,
  EditBetButton,
  RelatedItem,
  RelatedList,
} from "./MatchRelatedBets.styled";

const formatBetMeta = (bet: Bet): string => {
  const amount = bet.amount.toLocaleString("ru-RU");
  const odds = bet.odds.toFixed(2);
  if (bet.status === "WAIT") {
    const potential = (bet.amount * bet.odds).toLocaleString("ru-RU", {
      maximumFractionDigits: 0,
    });
    return `${amount} ₽ × ${odds} · до ${potential} ₽`;
  }
  if (bet.status === "WIN") {
    const profit = (bet.amount * bet.odds - bet.amount).toLocaleString("ru-RU", {
      maximumFractionDigits: 0,
    });
    return `${amount} ₽ × ${odds} · +${profit} ₽`;
  }
  return `${amount} ₽ × ${odds} · −${amount} ₽`;
};

interface MatchRelatedBetsProps {
  bets: Bet[];
  profileNameById: Map<number, string>;
  activeProfileId: number;
  onEdit?: (bet: Bet) => void;
}

const MatchRelatedBets = ({
  bets,
  profileNameById,
  activeProfileId,
  onEdit,
}: MatchRelatedBetsProps) => {
  if (bets.length === 0) return null;

  return (
    <RelatedList>
      {bets.map((bet) => {
        const { market, team } = formatBetDescriptionLines(bet);
        const description = team ? `${market} — ${team}` : market;
        const profileName = profileNameById.get(bet.profileId) ?? `Профиль ${bet.profileId}`;
        const isOwnBet = bet.profileId === activeProfileId;
        return (
          <RelatedItem key={bet.id} $own={isOwnBet}>
            <BetStatusChip $status={bet.status}>{bet.status}</BetStatusChip>
            <BetInfo>
              <BetProfile $own={isOwnBet}>{profileName}</BetProfile>
              <BetMarket title={description}>
                {description}
              </BetMarket>
              <BetMeta>{formatBetMeta(bet)}</BetMeta>
            </BetInfo>
            {bet.status === "WAIT" && onEdit ? (
              <EditBetButton type="button" onClick={() => onEdit(bet)}>
                Изменить
              </EditBetButton>
            ) : null}
          </RelatedItem>
        );
      })}
    </RelatedList>
  );
};

export default MatchRelatedBets;
