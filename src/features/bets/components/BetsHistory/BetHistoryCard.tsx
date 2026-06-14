import type { Bet } from "@/entities/bet";
import { formatBetDescription } from "@/entities/bet";
import { formatEventLabel } from "@/features/events/lib/eventDisplay";
import type { Match } from "@/entities/match";
import ActionButtons from "@/features/bets/components/ActionButtons/ActionButtons";
import { resolveEventLogoSlug } from "@/features/events/lib/eventDisplay";
import type { EventRecord } from "@/entities/eventRecord";
import { seriesScoreForBet } from "@/features/matches/lib/betTeamAlignment";
import { findMatchForBet } from "@/features/matches/lib/findBetsForMatch";
import { getMatchSeriesScore } from "@/features/matches/lib/matchMaps";
import EventLogo from "@/shared/ui/EventLogo/EventLogo";
import TeamLogo from "@/shared/ui/TeamLogo/TeamLogo";
import { formatIsoDateDots } from "@/shared/lib/date/isoDate";
import { formatBetPayout } from "./formatBetPayout";
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
  BetCardTeamInfo,
  BetCardTeamRow,
  BetCardTeamScore,
  StatusBadge,
} from "./BetsHistory.styled";

function formatEventTitle(bet: Bet): string {
  return formatEventLabel("", bet.eventName) || "Турнир";
}

function scoreTone(
  side: 1 | 2,
  series: { score1: number; score2: number },
): "win" | "lose" | "neutral" {
  if (series.score1 === series.score2) return "neutral";
  const leading: 1 | 2 = series.score1 > series.score2 ? 1 : 2;
  return side === leading ? "win" : "lose";
}

function resolveBetMatchSeriesScore(
  bet: Bet,
  matches: Match[],
): { score1: number; score2: number } | null {
  const match = findMatchForBet(bet, matches);
  if (!match) return null;
  const series = getMatchSeriesScore(match);
  if (!series) return null;
  return seriesScoreForBet(bet, match, series);
}

interface BetHistoryCardProps {
  bet: Bet;
  matches?: Match[];
  events?: EventRecord[];
  onEdit: (bet: Bet) => void;
  onDelete: (bet: Bet) => void;
  onWin: (id: string) => void;
  onLose: (id: string) => void;
  onRevert: (id: string) => void;
}

const BetHistoryCard = ({
  bet,
  matches = [],
  events = [],
  onEdit,
  onDelete,
  onWin,
  onLose,
  onRevert,
}: BetHistoryCardProps) => {
  const seriesScore = resolveBetMatchSeriesScore(bet, matches);

  return (
  <BetCard $status={bet.status}>
    <BetCardHeader>
      <BetCardHeaderLeft>
        <BetCardHeaderEvent>
          <EventLogo
            logoSlug={resolveEventLogoSlug(bet.eventId, bet.eventName, events)}
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
          {seriesScore ? (
            <BetCardTeamScore $tone={scoreTone(1, seriesScore)} aria-label={`Счёт ${bet.organization1}`}>
              {seriesScore.score1}
            </BetCardTeamScore>
          ) : null}
          <BetCardTeamInfo>
            <TeamLogo name={bet.organization1} size={20} showName />
          </BetCardTeamInfo>
        </BetCardTeamRow>
        <BetCardTeamRow>
          {seriesScore ? (
            <BetCardTeamScore $tone={scoreTone(2, seriesScore)} aria-label={`Счёт ${bet.organization2}`}>
              {seriesScore.score2}
            </BetCardTeamScore>
          ) : null}
          <BetCardTeamInfo>
            <TeamLogo name={bet.organization2} size={20} showName />
          </BetCardTeamInfo>
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
};

export default BetHistoryCard;
