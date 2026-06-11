import type { TournamentStatsSummary } from "@/features/summary/lib/calcTournamentExtremes";
import EventLogo from "@/shared/ui/EventLogo/EventLogo";
import { formatMoneySigned } from "@/shared/lib/format/money";
import {
  StatsMetricSub,
  StatsWldBadge,
  StatsWldRow,
  TournamentExtremeCard,
  TournamentExtremeEmpty,
  TournamentExtremeHead,
  TournamentExtremeKind,
  TournamentExtremeMetrics,
  TournamentExtremeName,
  TournamentExtremeProfit,
  TournamentExtremeWinRate,
} from "./StatsSummary.styled";

interface TournamentExtremeTileProps {
  kind: "best" | "worst";
  tournament: TournamentStatsSummary | null;
}

const KIND_LABELS = {
  best: "Самый успешный",
  worst: "Самый неудачный",
} as const;

const TournamentExtremeTile = ({ kind, tournament }: TournamentExtremeTileProps) => {
  if (!tournament) {
    return (
      <TournamentExtremeCard $kind={kind} $empty>
        <TournamentExtremeKind $kind={kind}>{KIND_LABELS[kind]}</TournamentExtremeKind>
        <TournamentExtremeEmpty>Нет закрытых ставок</TournamentExtremeEmpty>
      </TournamentExtremeCard>
    );
  }

  const profitPositive = tournament.profit >= 0;

  return (
    <TournamentExtremeCard $kind={kind}>
      <TournamentExtremeKind $kind={kind}>{KIND_LABELS[kind]}</TournamentExtremeKind>
      <TournamentExtremeHead>
        <EventLogo
          logoSlug={tournament.logoSlug}
          label={tournament.label}
          size={28}
        />
        <TournamentExtremeName title={tournament.label}>{tournament.label}</TournamentExtremeName>
      </TournamentExtremeHead>
      <TournamentExtremeMetrics>
        <TournamentExtremeProfit $positive={profitPositive}>
          {formatMoneySigned(tournament.profit)}
        </TournamentExtremeProfit>
        <StatsMetricSub>профит</StatsMetricSub>
        <TournamentExtremeWinRate $positive={tournament.winRate >= 50}>
          {tournament.winRate}% WR
        </TournamentExtremeWinRate>
        <StatsWldRow>
          <StatsWldBadge $variant="win">{tournament.wins}</StatsWldBadge>
          <StatsWldBadge $variant="loss">{tournament.losses}</StatsWldBadge>
          {tournament.pending > 0 ? (
            <StatsWldBadge $variant="pending">{tournament.pending}</StatsWldBadge>
          ) : null}
        </StatsWldRow>
      </TournamentExtremeMetrics>
    </TournamentExtremeCard>
  );
};

export default TournamentExtremeTile;
