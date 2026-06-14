import type { RankingBaseline } from "@/entities/ranking";
import type { TeamRecentMatchItem } from "@/features/matches/lib/getTeamRecentMatches";
import { findBaselineTeam } from "@/features/rankings/lib/findBaselineTeam";
import TeamLogo from "@/shared/ui/TeamLogo/TeamLogo";
import {
  EmptyNote,
  FormDot,
  FormDots,
  FormSection,
  FormSummary,
  LogoCell,
  LogoRing,
  MatchCenter,
  MatchList,
  MatchRow,
  OpponentName,
  PopoverEyebrow,
  PopoverHeader,
  PopoverHeaderText,
  PopoverRank,
  PopoverRankLabel,
  PopoverRankValue,
  PopoverRoot,
  PopoverTeamName,
  ScoreGroup,
  ScoreValue,
  VsLabel,
} from "./TeamRecentFormPopover.styled";

interface TeamRecentFormPopoverProps {
  teamName: string;
  items: TeamRecentMatchItem[];
  rankingBaseline?: RankingBaseline | null;
}

function PopoverHeaderBlock({
  teamName,
  rankingBaseline,
}: {
  teamName: string;
  rankingBaseline?: RankingBaseline | null;
}) {
  const baselineTeam = findBaselineTeam(rankingBaseline ?? null, teamName);

  return (
    <PopoverHeader>
      <LogoRing>
        <TeamLogo name={teamName} size={28} />
      </LogoRing>
      <PopoverHeaderText>
        <PopoverEyebrow>Форма</PopoverEyebrow>
        <PopoverTeamName title={teamName}>{teamName}</PopoverTeamName>
      </PopoverHeaderText>
      {baselineTeam ? (
        <PopoverRank>
          <PopoverRankValue>#{baselineTeam.globalRank}</PopoverRankValue>
          <PopoverRankLabel>Valve VRS</PopoverRankLabel>
        </PopoverRank>
      ) : null}
    </PopoverHeader>
  );
}

function formatFormSummary(items: TeamRecentMatchItem[]): string {
  const wins = items.filter((item) => item.result === "win").length;
  return `${wins}В · ${items.length - wins}П`;
}

const TeamRecentFormPopover = ({
  teamName,
  items,
  rankingBaseline = null,
}: TeamRecentFormPopoverProps) => {
  if (items.length === 0) {
    return (
      <PopoverRoot onClick={(event) => event.stopPropagation()}>
        <PopoverHeaderBlock teamName={teamName} rankingBaseline={rankingBaseline} />
        <EmptyNote>Нет завершённых матчей в базе</EmptyNote>
      </PopoverRoot>
    );
  }

  const chronological = [...items].reverse();

  return (
    <PopoverRoot onClick={(event) => event.stopPropagation()}>
      <PopoverHeaderBlock teamName={teamName} rankingBaseline={rankingBaseline} />

      <FormSection>
        <FormDots>
          {chronological.map((item) => (
            <FormDot key={item.matchId} $result={item.result} />
          ))}
        </FormDots>
        <FormSummary>{formatFormSummary(items)}</FormSummary>
      </FormSection>

      <MatchList>
        {items.map((item) => (
          <MatchRow key={item.matchId} $result={item.result}>
            <LogoCell>
              <TeamLogo name={teamName} size={26} />
            </LogoCell>
            <MatchCenter>
              <ScoreGroup>
                <ScoreValue $tone={item.result === "win" ? "win" : "lose"}>
                  {item.teamScore}
                </ScoreValue>
                <VsLabel>vs</VsLabel>
                <ScoreValue $tone={item.result === "win" ? "lose" : "win"}>
                  {item.opponentScore}
                </ScoreValue>
              </ScoreGroup>
              <OpponentName title={item.opponent}>{item.opponent}</OpponentName>
            </MatchCenter>
            <LogoCell>
              <TeamLogo name={item.opponent} size={26} />
            </LogoCell>
          </MatchRow>
        ))}
      </MatchList>
    </PopoverRoot>
  );
};

export default TeamRecentFormPopover;
