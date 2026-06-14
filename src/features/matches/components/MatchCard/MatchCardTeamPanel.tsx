import { Fade, Popper } from "@mui/material";
import type { BetTeamSide } from "@/entities/bet";
import type { RankingBaseline } from "@/entities/ranking";
import TeamRecentFormPopover from "@/features/matches/components/TeamRecentFormPopover/TeamRecentFormPopover";
import type { TeamRecentMatchItem } from "@/features/matches/lib/getTeamRecentMatches";
import TeamLogo from "@/shared/ui/TeamLogo/TeamLogo";
import type { MouseEvent, Ref } from "react";
import { stopAccordionToggle } from "./matchCardHelpers";
import { LogoRing, TeamName, TeamPanel, TeamPanelWrap } from "./MatchCard.styled";

interface MatchCardTeamPanelProps {
  team: BetTeamSide;
  teamName: string;
  leading: boolean;
  readOnly: boolean;
  placement: "bottom-end" | "bottom-start";
  align: "end" | "start";
  anchorRef: Ref<HTMLDivElement>;
  anchorEl: HTMLDivElement | null;
  hovered: boolean;
  recentMatches: TeamRecentMatchItem[];
  rankingBaseline?: RankingBaseline | null;
  onShowHover: () => void;
  onScheduleHideHover: () => void;
  onBet: (team: BetTeamSide) => void;
}

const MatchCardTeamPanel = ({
  team,
  teamName,
  leading,
  readOnly,
  placement,
  align,
  anchorRef,
  anchorEl,
  hovered,
  recentMatches,
  rankingBaseline = null,
  onShowHover,
  onScheduleHideHover,
  onBet,
}: MatchCardTeamPanelProps) => (
  <>
    <TeamPanelWrap
      ref={anchorRef}
      onMouseEnter={onShowHover}
      onMouseLeave={onScheduleHideHover}
    >
      <TeamPanel
        as={readOnly ? "div" : "button"}
        type={readOnly ? undefined : "button"}
        $align={align}
        $leading={leading}
        $readOnly={readOnly}
        title={readOnly ? teamName : `Ставка на ${teamName}`}
        aria-label={readOnly ? teamName : `Ставка на ${teamName}`}
        onClick={
          readOnly
            ? undefined
            : (event: MouseEvent) => {
                stopAccordionToggle(event);
                onBet(team);
              }
        }
      >
        {align === "end" ? (
          <>
            <TeamName>{teamName}</TeamName>
            <LogoRing>
              <TeamLogo name={teamName} size={36} />
            </LogoRing>
          </>
        ) : (
          <>
            <LogoRing>
              <TeamLogo name={teamName} size={36} />
            </LogoRing>
            <TeamName>{teamName}</TeamName>
          </>
        )}
      </TeamPanel>
    </TeamPanelWrap>

    <Popper
      open={hovered}
      anchorEl={anchorEl}
      placement={placement}
      transition
      modifiers={[{ name: "offset", options: { offset: [0, 6] } }]}
      sx={{ zIndex: 1400 }}
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={160}>
          <div onMouseEnter={onShowHover} onMouseLeave={onScheduleHideHover}>
            <TeamRecentFormPopover
              teamName={teamName}
              items={recentMatches}
              rankingBaseline={rankingBaseline}
            />
          </div>
        </Fade>
      )}
    </Popper>
  </>
);

export default MatchCardTeamPanel;
