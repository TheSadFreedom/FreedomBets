import { useMemo } from "react";
import type { Bet } from "@/entities/bet";
import { calcSummaryStats } from "@/features/bets/lib/calculations";
import BalanceChart from "@/features/summary/components/BalanceChart/BalanceChart";
import { buildBalanceHistory } from "@/features/summary/lib/buildBalanceHistory";
import SummaryGeneralSection from "./SummaryGeneralSection";
import {
  StatCard,
  StatHint,
  StatLabel,
  StatsGrid,
  StatsRoot,
  StatsSection,
  StatsSectionTitle,
  StatValue,
} from "./StatsSummary.styled";

interface StatsSummaryProps {
  bets: Bet[];
  balance: number;
}

const formatWinRate = (value: number | null, settled: number) => {
  if (value === null || settled === 0) return "—";
  return `${value}%`;
};

const StatsSummary = ({ bets, balance }: StatsSummaryProps) => {
  const stats = useMemo(() => calcSummaryStats(bets), [bets]);
  const balanceHistory = useMemo(
    () => buildBalanceHistory(bets, balance),
    [bets, balance]
  );

  return (
    <StatsRoot>
      <SummaryGeneralSection title="Общее" bets={bets} />

      <StatsSection>
        <StatsSectionTitle>График баланса</StatsSectionTitle>
        <BalanceChart points={balanceHistory} />
      </StatsSection>

      <StatsSection>
        <StatsSectionTitle>Винрейт по коэффициенту</StatsSectionTitle>
        <StatsGrid>
          {stats.oddsWinRates.map((bucket) => (
            <StatCard key={bucket.id}>
              <StatLabel>Кэф {bucket.label}</StatLabel>
              <StatValue
                $color={
                  bucket.winRate === null
                    ? undefined
                    : bucket.winRate >= 50
                      ? "#66bb6a"
                      : "#ef5350"
                }
              >
                {formatWinRate(bucket.winRate, bucket.settled)}
              </StatValue>
              <StatHint>
                {bucket.settled > 0 ? `${bucket.settled} закр.` : "нет ставок"}
              </StatHint>
            </StatCard>
          ))}
        </StatsGrid>
      </StatsSection>
    </StatsRoot>
  );
};

export default StatsSummary;
