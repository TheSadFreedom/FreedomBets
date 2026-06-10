import type { Bet } from "@/entities/bet";
import BetDescriptionCell from "@/features/bets/components/BetDescriptionCell/BetDescriptionCell";
import TeamLogo from "@/shared/ui/TeamLogo/TeamLogo";
import { formatIsoDateDots } from "@/shared/lib/date/isoDate";
import {
  EventBetMobileCard,
  EventBetMobileDate,
  EventBetMobileFooter,
  EventBetMobileMeta,
  EventBetMobilePayout,
  EventBetMobileStatus,
  EventBetMobileTeam,
  EventBetMobileTeamName,
  EventBetMobileTeams,
  EventBetMobileTop,
  EventBetMobileType,
  EventBetMobileVs,
  EventBetsMobileList,
} from "./EventBetsTable.styled";

interface EventBetsMobileListProps {
  bets: Bet[];
}

const formatPayout = (bet: Bet) => {
  if (bet.status === "WAIT") {
    return `до ${(bet.amount * bet.odds).toLocaleString("ru-RU", { maximumFractionDigits: 0 })} ₽`;
  }
  if (bet.status === "WIN") {
    return `+${(bet.amount * bet.odds - bet.amount).toLocaleString("ru-RU", { maximumFractionDigits: 0 })} ₽`;
  }
  return `−${bet.amount.toLocaleString("ru-RU")} ₽`;
};

const EventBetsMobileListView = ({ bets }: EventBetsMobileListProps) => (
  <EventBetsMobileList>
    {bets.map((bet) => (
      <EventBetMobileCard key={bet.id} $status={bet.status}>
        <EventBetMobileTop>
          <EventBetMobileDate>
            {formatIsoDateDots(bet.date)} · {bet.time} · {bet.format}
          </EventBetMobileDate>
          <EventBetMobilePayout $status={bet.status}>{formatPayout(bet)}</EventBetMobilePayout>
        </EventBetMobileTop>

        <EventBetMobileTeams>
          <EventBetMobileTeam $align="left">
            <TeamLogo name={bet.organization1} size={22} />
            <EventBetMobileTeamName>{bet.organization1}</EventBetMobileTeamName>
          </EventBetMobileTeam>
          <EventBetMobileVs>vs</EventBetMobileVs>
          <EventBetMobileTeam $align="right">
            <TeamLogo name={bet.organization2} size={22} />
            <EventBetMobileTeamName>{bet.organization2}</EventBetMobileTeamName>
          </EventBetMobileTeam>
        </EventBetMobileTeams>

        <EventBetMobileFooter>
          <EventBetMobileType>
            <BetDescriptionCell bet={bet} />
          </EventBetMobileType>
          <EventBetMobileMeta>
            <span>{bet.amount.toLocaleString("ru-RU")} ₽</span>
            <span>×{bet.odds.toFixed(2)}</span>
            <EventBetMobileStatus $status={bet.status}>{bet.status}</EventBetMobileStatus>
          </EventBetMobileMeta>
        </EventBetMobileFooter>
      </EventBetMobileCard>
    ))}
  </EventBetsMobileList>
);

export default EventBetsMobileListView;
