import { useCallback, useRef, useState } from "react";

const HOVER_HIDE_DELAY_MS = 140;

export function useTeamHoverPopover() {
  const [hoveredTeam, setHoveredTeam] = useState<1 | 2 | null>(null);
  const [team1AnchorEl, setTeam1AnchorEl] = useState<HTMLDivElement | null>(null);
  const [team2AnchorEl, setTeam2AnchorEl] = useState<HTMLDivElement | null>(null);
  const hideHoverTimerRef = useRef<number | null>(null);

  const team1AnchorRef = useCallback((node: HTMLDivElement | null) => {
    setTeam1AnchorEl(node);
  }, []);

  const team2AnchorRef = useCallback((node: HTMLDivElement | null) => {
    setTeam2AnchorEl(node);
  }, []);

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
    team1AnchorEl,
    team2AnchorEl,
    team1AnchorRef,
    team2AnchorRef,
    showTeamHover,
    scheduleHideTeamHover,
  };
}
