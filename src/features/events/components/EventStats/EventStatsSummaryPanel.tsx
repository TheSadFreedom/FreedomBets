import { useMemo } from "react";
import type { EventTier } from "@/entities/event";
import { isEventTier } from "@/entities/event";
import { calcSummaryStats } from "@/features/bets/lib/calculations";
import { formatMoney, formatMoneySigned } from "@/shared/lib/format/money";
import { TierBadge } from "./EventStats.styled";
import type { EventStatsSummarySection } from "./EventStats";
import {
  EventStatsSummaryCard,
  EventStatsSummaryMetricCell,
  EventStatsSummaryTierCell,
  EventStatsSummaryTop,
  EventStatsSummaryMetricLabel,
  EventStatsSummaryMetricValue,
  EventStatsSummaryMetrics,
  EventStatsSummaryProfitBlock,
  EventStatsSummaryProfitHint,
  EventStatsSummaryProfitValue,
  EventStatsSummaryRow,
  EventStatsSummaryWld,
  EventStatsSummaryWldBadge,
} from "./EventStatsSummary.styled";

interface EventStatsSummaryPanelProps {
  sections: EventStatsSummarySection[];
}

const resolveSectionTier = (title: string, tier?: EventTier): EventTier => {
  if (tier) return tier;
  if (isEventTier(title)) return title;
  return "Small";
};

const EventStatsSummaryRowBlock = ({ title, bets, tier }: EventStatsSummarySection) => {
  const sectionTier = resolveSectionTier(title, tier);
  const stats = useMemo(() => calcSummaryStats(bets), [bets]);
  const totalBets = stats.settledCount + stats.pendingCount;
  const hasSettled = stats.settledCount > 0;
  const profitPositive = stats.profit >= 0;
  const winRateColor = !hasSettled
    ? undefined
    : stats.winRate >= 50
      ? "#81c784"
      : "#e57373";

  return (
    <EventStatsSummaryRow $tier={sectionTier}>
      <EventStatsSummaryTop>
        <EventStatsSummaryTierCell>
          <TierBadge $tier={sectionTier}>{title}</TierBadge>
        </EventStatsSummaryTierCell>
        <EventStatsSummaryProfitBlock>
          <EventStatsSummaryProfitValue $positive={profitPositive} $muted={!hasSettled}>
            {hasSettled ? formatMoneySigned(stats.profit) : "—"}
          </EventStatsSummaryProfitValue>
          <EventStatsSummaryProfitHint>
            {hasSettled ? formatMoney(stats.settledWagered) : "нет закрытых"}
          </EventStatsSummaryProfitHint>
        </EventStatsSummaryProfitBlock>
      </EventStatsSummaryTop>

      <EventStatsSummaryMetrics>
        <EventStatsSummaryMetricCell>
          <EventStatsSummaryMetricValue $color={winRateColor}>
            {hasSettled ? `${stats.winRate}%` : "—"}
          </EventStatsSummaryMetricValue>
          <EventStatsSummaryMetricLabel>Винрейт</EventStatsSummaryMetricLabel>
        </EventStatsSummaryMetricCell>

        <EventStatsSummaryMetricCell>
          <EventStatsSummaryWld>
            <EventStatsSummaryWldBadge $variant="win">{stats.wins}</EventStatsSummaryWldBadge>
            <EventStatsSummaryWldBadge $variant="loss">{stats.losses}</EventStatsSummaryWldBadge>
            <EventStatsSummaryWldBadge $variant="pending">{stats.pendingCount}</EventStatsSummaryWldBadge>
          </EventStatsSummaryWld>
          <EventStatsSummaryMetricLabel>W · L · ⏳</EventStatsSummaryMetricLabel>
        </EventStatsSummaryMetricCell>

        <EventStatsSummaryMetricCell>
          <EventStatsSummaryMetricValue>{totalBets}</EventStatsSummaryMetricValue>
          <EventStatsSummaryMetricLabel>
            {stats.pendingCount > 0 ? `${stats.pendingCount} в игре` : "ставок"}
          </EventStatsSummaryMetricLabel>
        </EventStatsSummaryMetricCell>
      </EventStatsSummaryMetrics>
    </EventStatsSummaryRow>
  );
};

const EventStatsSummaryPanel = ({ sections }: EventStatsSummaryPanelProps) => {
  const visibleSections = sections.filter((section) => section.bets.length > 0);
  if (visibleSections.length === 0) return null;

  return (
    <EventStatsSummaryCard>
      {visibleSections.map((section) => (
        <EventStatsSummaryRowBlock key={section.title} {...section} />
      ))}
    </EventStatsSummaryCard>
  );
};

export default EventStatsSummaryPanel;
