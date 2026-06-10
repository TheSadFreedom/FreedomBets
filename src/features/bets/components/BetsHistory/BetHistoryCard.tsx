import type { Bet } from "@/entities/bet";
import { formatBetDescription } from "@/entities/bet";
import ActionButtons from "@/features/bets/components/ActionButtons/ActionButtons";
import { resolveEventLogoSlug } from "@/features/events/lib/eventDisplay";
import type { EventRecord } from "@/entities/eventRecord";
import EventLogo from "@/shared/ui/EventLogo/EventLogo";
import TeamLogo from "@/shared/ui/TeamLogo/TeamLogo";
import { formatIsoDateDots } from "@/shared/lib/date/isoDate";
import {
  BetCard,
  BetCardActions,
  BetCardBody,
  BetCardCenter,
  BetCardCenterLabel,
  BetCardCenterRow,
  BetCardCenterValue,
  BetCardDate,
  BetCardHeader,
  BetCardHeaderEvent,
  BetCardHeaderLeft,
  BetCardHeaderRight,
  BetCardHeaderTitle,
  BetCardLeft,
  BetCardResult,
  BetCardResultPayout,
  BetCardTeamRow,
  StatusBadge,
} from "./BetsHistory.styled";

export function formatBetPayout(bet: Bet): string {
  if (bet.status === "WAIT") {
    return `${bet.amount.toLocaleString("ru-RU")} ₽`;
  }
  if (bet.status === "WIN") {
    return `+${(bet.amount * bet.odds - bet.amount).toLocaleString("ru-RU", { maximumFractionDigits: 0 })} ₽`;
  }
  return `−${bet.amount.toLocaleString("ru-RU")} ₽`;
}

function formatEventTitle(bet: Bet): string {
  const org = bet.eventOrganization.trim();
  const name = bet.eventName.trim();
  if (org && name) return `${org} ${name}`;
  return name || org || "Турнир";
}

interface BetHistoryCardProps {
  bet: Bet;
  events?: EventRecord[];
  onEdit: (bet: Bet) => void;
  onDelete: (bet: Bet) => void;
  onWin: (id: string) => void;
  onLose: (id: string) => void;
  onRevert: (id: string) => void;
}

const BetHistoryCard = ({
  bet,
  events = [],
  onEdit,
  onDelete,
  onWin,
  onLose,
  onRevert,
}: BetHistoryCardProps) => (
  <BetCard $status={bet.status}>
    <BetCardHeader>
      <BetCardHeaderLeft>
        <BetCardHeaderEvent>
          <EventLogo
            logoSlug={resolveEventLogoSlug(bet.eventOrganization, bet.eventName, events)}
            label={formatEventTitle(bet)}
            size={18}
          />
        </BetCardHeaderEvent>
        <BetCardHeaderTitle title={formatEventTitle(bet)}>{formatEventTitle(bet)}</BetCardHeaderTitle>
      </BetCardHeaderLeft>
      <BetCardHeaderRight>
        <BetCardDate>
          {formatIsoDateDots(bet.date)} {bet.time}
        </BetCardDate>
        <BetCardActions>
          <ActionButtons
            bet={bet}
            onEdit={onEdit}
            onDelete={onDelete}
            onWin={onWin}
            onLose={onLose}
            onRevert={onRevert}
          />
        </BetCardActions>
      </BetCardHeaderRight>
    </BetCardHeader>

    <BetCardBody>
      <BetCardLeft>
        <BetCardTeamRow>
          <TeamLogo name={bet.organization1} size={20} showName />
        </BetCardTeamRow>
        <BetCardTeamRow>
          <TeamLogo name={bet.organization2} size={20} showName />
        </BetCardTeamRow>
      </BetCardLeft>

      <BetCardCenter>
        <BetCardCenterRow>
          <BetCardCenterLabel>Вид ставки</BetCardCenterLabel>
          <BetCardCenterValue $multiline title={formatBetDescription(bet)}>
            {formatBetDescription(bet)}
          </BetCardCenterValue>
        </BetCardCenterRow>
        <BetCardCenterRow>
          <BetCardCenterLabel>Коэф.</BetCardCenterLabel>
          <BetCardCenterValue>{bet.odds.toFixed(2)}</BetCardCenterValue>
        </BetCardCenterRow>
      </BetCardCenter>

      <BetCardResult>
        <BetCardResultPayout $status={bet.status}>{formatBetPayout(bet)}</BetCardResultPayout>
        <StatusBadge $status={bet.status}>{bet.status}</StatusBadge>
      </BetCardResult>
    </BetCardBody>
  </BetCard>
);

export default BetHistoryCard;
