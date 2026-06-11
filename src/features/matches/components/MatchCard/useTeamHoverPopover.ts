import { useRef, useState } from "react";

const HOVER_HIDE_DELAY_MS = 140;

export function useTeamHoverPopover() {
  const [hoveredTeam, setHoveredTeam] = useState<1 | 2 | null>(null);
  const hideHoverTimerRef = useRef<number | null>(null);
  const team1AnchorRef = useRef<HTMLDivElement>(null);
  const team2AnchorRef = useRef<HTMLDivElement>(null);

  const showTeamHover = (team: 1 | 2) => {
    if (hideHoverTimerRef.current != null) {
      window.clearTimeout(hideHoverTimerRef.current);
      hideHoverTimerRef.current = null;
    }
    setHoveredTeam(team);
  };

  const scheduleHideTeamHover = () => {
    hideHoverTimerRef.current = window.setTimeout(() => {
      setHoveredTeam(null);
      hideHoverTimerRef.current = null;
    }, HOVER_HIDE_DELAY_MS);
  };

  return {
    hoveredTeam,
    team1AnchorRef,
    team2AnchorRef,
    showTeamHover,
    scheduleHideTeamHover,
  };
}
