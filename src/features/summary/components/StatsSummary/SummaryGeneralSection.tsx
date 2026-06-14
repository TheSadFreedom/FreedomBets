import { useMemo } from "react";
import type { Bet } from "@/entities/bet";
import { calcSummaryStats } from "@/features/bets/lib/calculations";
import { formatMoney, formatMoneySigned } from "@/shared/lib/format/money";
import {
  StatsMetricLabel,
  StatsMetricsGrid,
  StatsMetricSub,
  StatsMetricTile,
  StatsMetricValue,
} from "./StatsSummary.styled";
import WinRateMetricTile from "./WinRateMetricTile";

interface SummaryGeneralSectionProps {
  bets: Bet[];
  totalDeposited?: number;
  totalWithdrawn?: number;
}

const SummaryGeneralSection = ({
  bets,
  totalDeposited = 0,
  totalWithdrawn = 0,
}: SummaryGeneralSectionProps) => {
  const stats = useMemo(() => calcSummaryStats(bets), [bets]);
  const hasSettled = stats.settledCount > 0;
  const profitPositive = stats.profit >= 0;
  return (
    <StatsMetricsGrid>
      <StatsMetricTile>
        <StatsMetricLabel>Закрытые</StatsMetricLabel>
        <StatsMetricValue>{stats.settledCount}</StatsMetricValue>
        <StatsMetricSub>{formatMoney(stats.settledWagered)} поставлено</StatsMetricSub>
      </StatsMetricTile>

      <StatsMetricTile $accent="#ffa726" $highlight={stats.pendingCount > 0}>
        <StatsMetricLabel>В игре</StatsMetricLabel>
        <StatsMetricValue $color={stats.pendingCount > 0 ? "#ffa726" : undefined}>
          {stats.pendingCount}
        </StatsMetricValue>
        <StatsMetricSub>открытые ставки</StatsMetricSub>
      </StatsMetricTile>

      <StatsMetricTile
        $accent={profitPositive ? "#66bb6a" : "#ef5350"}
        $highlight={hasSettled}
      >
        <StatsMetricLabel>Профит</StatsMetricLabel>
        <StatsMetricValue $color={hasSettled ? (profitPositive ? "#81c784" : "#e57373") : undefined}>
          {hasSettled ? formatMoneySigned(stats.profit) : "—"}
        </StatsMetricValue>
        <StatsMetricSub>только закрытые</StatsMetricSub>
      </StatsMetricTile>

      <WinRateMetricTile
        label="Винрейт"
        winRate={hasSettled ? stats.winRate : null}
        wins={stats.wins}
        losses={stats.losses}
        pending={stats.pendingCount}
      />

      <StatsMetricTile $accent="#66bb6a" $highlight={totalDeposited > 0}>
        <StatsMetricLabel>Пополнено</StatsMetricLabel>
        <StatsMetricValue $color={totalDeposited > 0 ? "#81c784" : undefined}>
          {formatMoney(totalDeposited)}
        </StatsMetricValue>
        <StatsMetricSub>всего внесено</StatsMetricSub>
      </StatsMetricTile>

      <StatsMetricTile $accent="#ef5350" $highlight={totalWithdrawn > 0}>
        <StatsMetricLabel>Выведено</StatsMetricLabel>
        <StatsMetricValue $color={totalWithdrawn > 0 ? "#e57373" : undefined}>
          {formatMoney(totalWithdrawn)}
        </StatsMetricValue>
        <StatsMetricSub>всего снято</StatsMetricSub>
      </StatsMetricTile>
    </StatsMetricsGrid>
  );
};

export default SummaryGeneralSection;
