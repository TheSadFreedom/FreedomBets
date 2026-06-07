import type { EventStats } from "@/entities/event";
import { formatMoneySigned } from "@/shared/lib/format/money";
import {
  EventMetricsGrid,
  MetricTile,
  MetricTileLabel,
  MetricTileValue,
  WldBadge,
  WldBadges,
} from "./EventStats.styled";

type EventStatsMetricsItem = Pick<
  EventStats,
  "totalBets" | "wins" | "losses" | "pending" | "winRate" | "profit" | "pendingExposure"
>;

interface EventStatsMetricsProps {
  item: EventStatsMetricsItem;
}

const EventStatsMetrics = ({ item }: EventStatsMetricsProps) => {
  const hasSettled = item.wins + item.losses > 0;
  const winRateColor =
    !hasSettled ? undefined : item.winRate >= 50 ? "#66bb6a" : "#ef5350";
  const profitPositive = item.profit >= 0;

  return (
    <EventMetricsGrid>
      <MetricTile>
        <MetricTileLabel>Ставок</MetricTileLabel>
        <MetricTileValue>{item.totalBets}</MetricTileValue>
      </MetricTile>

      <MetricTile $accent={winRateColor}>
        <MetricTileLabel>Винрейт</MetricTileLabel>
        <MetricTileValue $color={winRateColor}>
          {hasSettled ? `${item.winRate}%` : "—"}
        </MetricTileValue>
      </MetricTile>

      <MetricTile>
        <MetricTileLabel>W / L / ⏳</MetricTileLabel>
        <WldBadges>
          <WldBadge $variant="win">{item.wins}</WldBadge>
          <WldBadge $variant="loss">{item.losses}</WldBadge>
          <WldBadge $variant="pending">{item.pending}</WldBadge>
        </WldBadges>
      </MetricTile>

      <MetricTile $accent={profitPositive ? "#66bb6a" : "#ef5350"} $highlight>
        <MetricTileLabel>Профит</MetricTileLabel>
        <MetricTileValue $color={profitPositive ? "#66bb6a" : "#ef5350"}>
          {formatMoneySigned(item.profit)}
        </MetricTileValue>
      </MetricTile>

      {item.pending > 0 && (
        <MetricTile $accent="#ffa726">
          <MetricTileLabel>В игре</MetricTileLabel>
          <MetricTileValue $color="#ffa726">
            {item.pendingExposure.toLocaleString("ru-RU")} ₽
          </MetricTileValue>
        </MetricTile>
      )}
    </EventMetricsGrid>
  );
};

export default EventStatsMetrics;
