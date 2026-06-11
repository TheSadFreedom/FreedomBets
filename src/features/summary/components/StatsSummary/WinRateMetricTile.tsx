import {
  StatsMetricLabel,
  StatsMetricTile,
  StatsMetricValue,
  StatsWldBadge,
  StatsWldRow,
} from "./StatsSummary.styled";

interface WinRateMetricTileProps {
  label: string;
  winRate: number | null;
  wins: number;
  losses: number;
  pending: number;
}

const WinRateMetricTile = ({
  label,
  winRate,
  wins,
  losses,
  pending,
}: WinRateMetricTileProps) => {
  const hasSettled = wins + losses > 0;
  const winRateColor = !hasSettled
    ? undefined
    : (winRate ?? 0) >= 50
      ? "#81c784"
      : "#ef5350";

  return (
    <StatsMetricTile $accent={winRateColor}>
      <StatsMetricLabel>{label}</StatsMetricLabel>
      <StatsMetricValue $color={winRateColor}>
        {hasSettled ? `${winRate}%` : "—"}
      </StatsMetricValue>
      <StatsWldRow>
        <StatsWldBadge $variant="win">{wins}</StatsWldBadge>
        <StatsWldBadge $variant="loss">{losses}</StatsWldBadge>
        <StatsWldBadge $variant="pending">{pending}</StatsWldBadge>
      </StatsWldRow>
    </StatsMetricTile>
  );
};

export default WinRateMetricTile;
