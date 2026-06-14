import type { EventStats } from "@/entities/event";
import { formatMoneySigned } from "@/shared/lib/format/money";
import TeamLogo from "@/shared/ui/TeamLogo/TeamLogo";
import {
  EventMetricLabel,
  EventMetricPanel,
  EventMetricValue,
  EventMetricsRow,
  WinnerPanel,
  WinnerPanelInfo,
  WinnerPanelName,
  WldBadge,
  WldBadges,
} from "./EventStats.styled";

type EventStatsMetricsItem = Pick<
  EventStats,
  "wins" | "losses" | "pending" | "winRate" | "profit" | "totalBets"
>;

interface EventStatsMetricsProps {
  item: EventStatsMetricsItem;
  winnerOrganization?: string | null;
  winnerLogoSlug?: string | null;
}

const EventStatsMetrics = ({
  item,
  winnerOrganization,
  winnerLogoSlug,
}: EventStatsMetricsProps) => {
  const hasSettled = item.wins + item.losses > 0;
  const winRateColor =
    !hasSettled ? undefined : item.winRate >= 50 ? "#66bb6a" : "#ef5350";
  const profitPositive = item.profit >= 0;
  const profitColor = profitPositive ? "#66bb6a" : "#ef5350";
  const hasBets = item.totalBets > 0;
  const hasWinner = Boolean(winnerOrganization);

  return (
    <EventMetricsRow $columns={hasWinner ? 5 : 4} $hasWinner={hasWinner}>
      {winnerOrganization ? (
        <WinnerPanel title={`Победитель: ${winnerOrganization}`}>
          <TeamLogo name={winnerOrganization} logoSlug={winnerLogoSlug} size={28} />
          <WinnerPanelInfo>
            <EventMetricLabel>Победитель</EventMetricLabel>
            <WinnerPanelName>{winnerOrganization}</WinnerPanelName>
          </WinnerPanelInfo>
        </WinnerPanel>
      ) : null}

      <EventMetricPanel $accent={winRateColor}>
        <EventMetricLabel>WR</EventMetricLabel>
        <EventMetricValue $color={winRateColor} $large>
          {hasSettled ? `${item.winRate}%` : "—"}
        </EventMetricValue>
      </EventMetricPanel>

      <EventMetricPanel>
        <EventMetricLabel>W·L·⏳</EventMetricLabel>
        <WldBadges>
          <WldBadge $variant="win">{item.wins}</WldBadge>
          <WldBadge $variant="loss">{item.losses}</WldBadge>
          <WldBadge $variant="pending">{item.pending}</WldBadge>
        </WldBadges>
      </EventMetricPanel>

      <EventMetricPanel $accent={hasBets ? "#ffa726" : undefined}>
        <EventMetricLabel>Ставки</EventMetricLabel>
        <EventMetricValue $color={hasBets ? "#ffb74d" : undefined} $large>
          {item.totalBets}
        </EventMetricValue>
      </EventMetricPanel>

      <EventMetricPanel $leading={hasSettled} $accent={profitColor}>
        <EventMetricLabel>Профит</EventMetricLabel>
        <EventMetricValue $color={hasSettled ? profitColor : undefined}>
          {hasSettled ? formatMoneySigned(item.profit) : "—"}
        </EventMetricValue>
      </EventMetricPanel>
    </EventMetricsRow>
  );
};

export default EventStatsMetrics;
