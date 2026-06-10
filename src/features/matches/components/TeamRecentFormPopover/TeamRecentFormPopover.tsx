import type { TeamRecentMatchItem } from "@/features/matches/lib/getTeamRecentMatches";
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
  PopoverRoot,
  PopoverTeamName,
  ScoreGroup,
  ScoreValue,
  VsLabel,
} from "./TeamRecentFormPopover.styled";

interface TeamRecentFormPopoverProps {
  teamName: string;
  items: TeamRecentMatchItem[];
}

function formatFormSummary(items: TeamRecentMatchItem[]): string {
  const wins = items.filter((item) => item.result === "win").length;
  return `${wins}В · ${items.length - wins}П`;
}

const TeamRecentFormPopover = ({ teamName, items }: TeamRecentFormPopoverProps) => {
  if (items.length === 0) {
    return (
      <PopoverRoot onClick={(event) => event.stopPropagation()}>
        <PopoverHeader>
          <LogoRing>
            <TeamLogo name={teamName} size={28} />
          </LogoRing>
          <PopoverHeaderText>
            <PopoverEyebrow>Форма</PopoverEyebrow>
            <PopoverTeamName title={teamName}>{teamName}</PopoverTeamName>
          </PopoverHeaderText>
        </PopoverHeader>
        <EmptyNote>Нет завершённых матчей в базе</EmptyNote>
      </PopoverRoot>
    );
  }

  const chronological = [...items].reverse();

  return (
    <PopoverRoot onClick={(event) => event.stopPropagation()}>
      <PopoverHeader>
        <LogoRing>
          <TeamLogo name={teamName} size={28} />
        </LogoRing>
        <PopoverHeaderText>
          <PopoverEyebrow>Форма</PopoverEyebrow>
          <PopoverTeamName title={teamName}>{teamName}</PopoverTeamName>
        </PopoverHeaderText>
      </PopoverHeader>

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
