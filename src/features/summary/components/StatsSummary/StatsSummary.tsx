import { useMemo } from "react";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import ShowChartOutlinedIcon from "@mui/icons-material/ShowChartOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import type { Bet } from "@/entities/bet";
import { calcSummaryStats } from "@/features/bets/lib/calculations";
import BalanceChart from "@/features/summary/components/BalanceChart/BalanceChart";
import { buildBalanceHistory } from "@/features/summary/lib/buildBalanceHistory";
import { formatMoneySigned } from "@/shared/lib/format/money";
import SummaryGeneralSection from "./SummaryGeneralSection";
import WinRateMetricTile from "./WinRateMetricTile";
import {
  FormatGrid,
  OddsGrid,
  StatsHero,
  StatsHeroHint,
  StatsHeroPill,
  StatsHeroPills,
  StatsHeroProfit,
  StatsHeroText,
  StatsPanel,
  StatsRoot,
  StatsSectionHead,
  StatsSectionHint,
  StatsSectionIcon,
  StatsSectionTitle,
} from "./StatsSummary.styled";

interface StatsSummaryProps {
  bets: Bet[];
  balance: number;
}

const StatsSummary = ({ bets, balance }: StatsSummaryProps) => {
  const stats = useMemo(() => calcSummaryStats(bets), [bets]);
  const balanceHistory = useMemo(
    () => buildBalanceHistory(bets, balance),
    [bets, balance]
  );

  const hasSettled = stats.settledCount > 0;
  const profitPositive = stats.profit >= 0;
  const totalBets = stats.settledCount + stats.pendingCount;

  return (
    <StatsRoot>
      <StatsHero>
        <StatsHeroText>
          <StatsHeroProfit $positive={profitPositive} $muted={!hasSettled}>
            {hasSettled ? formatMoneySigned(stats.profit) : "—"}
          </StatsHeroProfit>
          <StatsHeroHint>
            {hasSettled ? "профит по закрытым ставкам" : "нет закрытых ставок"}
          </StatsHeroHint>
        </StatsHeroText>
        <StatsHeroPills>
          <StatsHeroPill>{totalBets} ставок</StatsHeroPill>
          {hasSettled ? <StatsHeroPill>{stats.winRate}% WR</StatsHeroPill> : null}
        </StatsHeroPills>
      </StatsHero>

      <StatsPanel>
        <StatsSectionHead>
          <StatsSectionIcon $tone="primary">
            <InsightsOutlinedIcon />
          </StatsSectionIcon>
          <div>
            <StatsSectionTitle>Общее</StatsSectionTitle>
            <StatsSectionHint>Сводка по всем ставкам профиля</StatsSectionHint>
          </div>
        </StatsSectionHead>
        <SummaryGeneralSection bets={bets} />
      </StatsPanel>

      <StatsPanel>
        <StatsSectionHead>
          <StatsSectionIcon>
            <ShowChartOutlinedIcon />
          </StatsSectionIcon>
          <div>
            <StatsSectionTitle>График баланса</StatsSectionTitle>
            <StatsSectionHint>Баланс на конец каждого дня</StatsSectionHint>
          </div>
        </StatsSectionHead>
        <BalanceChart points={balanceHistory} embedded />
      </StatsPanel>

      <StatsPanel>
        <StatsSectionHead>
          <StatsSectionIcon>
            <LayersOutlinedIcon />
          </StatsSectionIcon>
          <div>
            <StatsSectionTitle>Винрейт по формату</StatsSectionTitle>
            <StatsSectionHint>Эффективность в BO1, BO3 и BO5</StatsSectionHint>
          </div>
        </StatsSectionHead>
        <FormatGrid>
          {stats.formatWinRates.map((bucket) => (
            <WinRateMetricTile
              key={bucket.id}
              label={bucket.label}
              winRate={bucket.winRate}
              wins={bucket.wins}
              losses={bucket.losses}
              pending={bucket.pending}
            />
          ))}
        </FormatGrid>
      </StatsPanel>

      <StatsPanel>
        <StatsSectionHead>
          <StatsSectionIcon>
            <TuneOutlinedIcon />
          </StatsSectionIcon>
          <div>
            <StatsSectionTitle>Винрейт по коэффициенту</StatsSectionTitle>
            <StatsSectionHint>Эффективность в диапазонах кэфов</StatsSectionHint>
          </div>
        </StatsSectionHead>
        <OddsGrid>
          {stats.oddsWinRates.map((bucket) => (
            <WinRateMetricTile
              key={bucket.id}
              label={`Кэф ${bucket.label}`}
              winRate={bucket.winRate}
              wins={bucket.wins}
              losses={bucket.losses}
              pending={bucket.pending}
            />
          ))}
        </OddsGrid>
      </StatsPanel>
    </StatsRoot>
  );
};

export default StatsSummary;
