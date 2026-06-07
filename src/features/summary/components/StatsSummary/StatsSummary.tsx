import { useMemo } from "react";
import type { Bet } from "@/entities/bet";
import { calcSummaryStats } from "@/features/bets/lib/calculations";
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
}

const formatWinRate = (value: number | null, settled: number) => {
  if (value === null || settled === 0) return "—";
  return `${value}%`;
};

const StatsSummary = ({ bets }: StatsSummaryProps) => {
  const stats = useMemo(() => calcSummaryStats(bets), [bets]);

  return (
    <StatsRoot>
      <SummaryGeneralSection title="Общее" bets={bets} />

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
