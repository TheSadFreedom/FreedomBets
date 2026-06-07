import { useMemo } from "react";
import type { Bet } from "@/entities/bet";
import { calcSummaryStats } from "@/features/bets/lib/calculations";
import { formatMoney } from "@/shared/lib/format/money";
import {
  StatCard,
  StatHint,
  StatLabel,
  StatSub,
  StatsGrid,
  StatsSection,
  StatsSectionTitle,
  StatValue,
} from "./StatsSummary.styled";

interface SummaryGeneralSectionProps {
  title: string;
  bets: Bet[];
}

const SummaryGeneralSection = ({ title, bets }: SummaryGeneralSectionProps) => {
  const stats = useMemo(() => calcSummaryStats(bets), [bets]);

  return (
    <StatsSection>
      <StatsSectionTitle>{title}</StatsSectionTitle>
      <StatsGrid>
        <StatCard>
          <StatLabel>Закрытые ставки</StatLabel>
          <StatValue>{stats.settledCount}</StatValue>
          <StatSub>{formatMoney(stats.settledWagered)} поставлено</StatSub>
        </StatCard>

        <StatCard $accent="#ffa726">
          <StatLabel>В игре</StatLabel>
          <StatValue $color="#ffa726">{stats.pendingCount}</StatValue>
          <StatSub $color="#ffb74d">{formatMoney(stats.pendingWagered)} в игре</StatSub>
        </StatCard>

        <StatCard $accent={stats.profit >= 0 ? "#66bb6a" : "#ef5350"}>
          <StatLabel>Профит</StatLabel>
          <StatValue $color={stats.profit >= 0 ? "#66bb6a" : "#ef5350"}>
            {formatMoney(stats.profit)}
          </StatValue>
          <StatHint>только закрытые</StatHint>
        </StatCard>

        <StatCard>
          <StatLabel>Винрейт</StatLabel>
          <StatValue
            $color={
              stats.settledCount === 0
                ? undefined
                : stats.winRate >= 50
                  ? "#66bb6a"
                  : "#ef5350"
            }
          >
            {stats.settledCount === 0 ? "—" : `${stats.winRate}%`}
          </StatValue>
          <StatHint>
            {stats.wins}В / {stats.losses}П
          </StatHint>
        </StatCard>
      </StatsGrid>
    </StatsSection>
  );
};

export default SummaryGeneralSection;
