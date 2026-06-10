import { Accordion } from "@mui/material";
import styled, { css } from "styled-components";
import type { MatchStatus } from "@/entities/match";
import { media } from "@/shared/styles/breakpoints";

const statusAccent: Record<MatchStatus, string> = {
  scheduled: "rgba(255, 167, 38, 0.85)",
  live: "rgba(244, 67, 54, 0.9)",
  finished: "rgba(255, 255, 255, 0.22)",
};

export const MatchAccordion = styled(Accordion)<{ $status: MatchStatus }>`
  position: relative;
  overflow: hidden !important;
  background: linear-gradient(
    160deg,
    rgba(36, 38, 42, 0.98) 0%,
    rgba(24, 24, 26, 0.99) 55%,
    rgba(18, 18, 20, 1) 100%
  ) !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  border-radius: 16px !important;
  box-shadow:
    0 2px 14px rgba(0, 0, 0, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.04) !important;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &::before {
    display: none;
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    z-index: 1;
    pointer-events: none;
    background: linear-gradient(
      90deg,
      transparent 0%,
      ${({ $status }) => statusAccent[$status]} 35%,
      ${({ $status }) => statusAccent[$status]} 65%,
      transparent 100%
    );
  }

  &:hover {
    border-color: rgba(255, 255, 255, 0.14) !important;
    box-shadow:
      0 6px 22px rgba(0, 0, 0, 0.32),
      0 0 0 1px rgba(255, 255, 255, 0.04) !important;
  }

  &.Mui-expanded {
    margin: 0 !important;
    border-color: rgba(76, 175, 80, 0.35) !important;
    box-shadow:
      0 10px 30px rgba(0, 0, 0, 0.38),
      0 0 0 1px rgba(76, 175, 80, 0.1) !important;
  }

  .MuiAccordionSummary-root {
    align-items: stretch;
    min-height: 0;
    padding: 0;
  }

  .MuiAccordionSummary-content {
    margin: 0 !important;
  }

  .MuiAccordionDetails-root {
    padding: 0 16px 16px;

    ${media.down("md")} {
      padding: 0 12px 12px;
    }
  }
`;

export const MatchSummaryContent = styled.div`
  width: 100%;
  min-width: 0;
  padding: 14px 16px 16px;

  ${media.down("md")} {
    padding: 12px;
  }
`;

export const MatchTopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-width: 0;
`;

export const MatchEventRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  flex: 1;
`;

export const EventLogoWrap = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;

  .MuiAvatar-root {
    border-radius: 0;
  }
`;

export const MatchEventTitle = styled.div`
  min-width: 0;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.25;
  color: rgba(255, 255, 255, 0.92);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const StagePill = styled.span`
  flex-shrink: 0;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.72);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-transform: lowercase;
`;

export const MatchTopActions = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
`;

export const MatchDivider = styled.div`
  height: 1px;
  margin: 12px 0 14px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.02) 0%,
    rgba(255, 255, 255, 0.12) 50%,
    rgba(255, 255, 255, 0.02) 100%
  );
`;

export const MatchBody = styled.div`
  display: grid;
  grid-template-columns: 92px minmax(0, 1fr);
  align-items: center;
  gap: 16px;
  min-width: 0;

  ${media.down("md")} {
    grid-template-columns: minmax(0, 1fr);
    gap: 12px;
  }
`;

export const MatchDateCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  min-width: 0;

  ${media.down("md")} {
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
  }
`;

export const MatchDate = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.88);
  font-variant-numeric: tabular-nums;
`;

export const MatchTime = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.55);
  font-variant-numeric: tabular-nums;
`;

export const FormatPill = styled.span`
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.03em;
  color: rgba(255, 255, 255, 0.78);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

export const MatchTeamsCol = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: stretch;
  gap: 12px;
  min-width: 0;

  ${media.down("md")} {
    gap: 8px;
  }
`;

export const MatchScoreCenter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: stretch;
  min-width: 88px;
  padding: 0 4px;

  ${media.down("md")} {
    min-width: 64px;
    padding: 0 2px;
  }
`;

export const ScoreVsLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
  line-height: 1;
  color: rgba(255, 255, 255, 0.32);
  text-transform: lowercase;
  padding: 0 6px;

  ${media.down("md")} {
    font-size: 12px;
    padding: 0 4px;
  }
`;

export const TeamPanelWrap = styled.div`
  position: relative;
  min-width: 0;
  width: 100%;
`;

export const TeamPanel = styled.button<{
  $align: "start" | "end";
  $leading?: boolean;
  $readOnly?: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: ${({ $align }) => ($align === "end" ? "flex-end" : "flex-start")};
  flex-direction: row;
  gap: 10px;
  min-width: 0;
  width: 100%;
  min-height: 52px;
  padding: 10px 14px;
  border-radius: 12px;
  font-family: inherit;
  cursor: ${({ $readOnly }) => ($readOnly ? "default" : "pointer")};
  color: rgba(255, 255, 255, 0.92);
  background: ${({ $leading }) =>
    $leading ? "rgba(76, 175, 80, 0.08)" : "rgba(255, 255, 255, 0.04)"};
  border: 1px solid
    ${({ $leading }) => ($leading ? "rgba(102, 187, 106, 0.28)" : "rgba(255, 255, 255, 0.08)")};
  transition:
    border-color 0.18s ease,
    background 0.18s ease,
    transform 0.15s ease;

  &:hover {
    border-color: ${({ $readOnly, $leading }) =>
      $readOnly
        ? $leading
          ? "rgba(102, 187, 106, 0.28)"
          : "rgba(255, 255, 255, 0.08)"
        : "rgba(102, 187, 106, 0.4)"};
    background: ${({ $readOnly, $leading }) =>
      $readOnly
        ? $leading
          ? "rgba(76, 175, 80, 0.08)"
          : "rgba(255, 255, 255, 0.04)"
        : "rgba(76, 175, 80, 0.1)"};
  }

  &:active {
    transform: ${({ $readOnly }) => ($readOnly ? "none" : "scale(0.99)")};
  }

  &:focus-visible {
    outline: 2px solid #66bb6a;
    outline-offset: 2px;
  }

  ${media.down("md")} {
    min-height: 48px;
    padding: 8px 10px;
    gap: 8px;
  }
`;

export const TeamName = styled.span`
  flex: 0 1 auto;
  min-width: 0;
  max-width: 100%;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  ${media.down("md")} {
    font-size: 14px;
  }
`;

export const LogoRing = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;

  .MuiAvatar-root {
    border-radius: 0;
  }

  ${media.down("md")} {
    width: 32px;
    height: 32px;
  }
`;

export const ScoreLine = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
`;

export const ScorePrimary = styled.span<{ $tone: "win" | "lose" | "neutral" }>`
  font-size: 32px;
  font-weight: 800;
  line-height: 1;
  color: ${({ $tone }) =>
    $tone === "win" ? "#66bb6a" : $tone === "lose" ? "#ef5350" : "rgba(255, 255, 255, 0.72)"};

  ${media.down("md")} {
    font-size: 26px;
  }
`;

export const MapsSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 10px 28px;
  padding: 10px 14px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.06);
`;

export const MapItem = styled.div`
  display: inline-flex;
  align-items: baseline;
  gap: 10px;
  min-width: 0;
  font-size: 13px;
  line-height: 1.2;
`;

export const MapName = styled.span`
  flex-shrink: 0;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.52);
`;

export const MapScoreGroup = styled.span`
  display: inline-flex;
  align-items: baseline;
  gap: 5px;
  font-variant-numeric: tabular-nums;
  font-weight: 600;
`;

export const MapScoreSep = styled.span`
  color: rgba(255, 255, 255, 0.45);
  font-weight: 500;
`;

export const MapScore = styled.span<{ $leading?: boolean }>`
  color: ${({ $leading }) => ($leading ? "#81c784" : "rgba(255, 255, 255, 0.88)")};
`;

const livePulse = css`
  @keyframes matchLivePulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.45;
    }
  }
`;

const statusStyles: Record<MatchStatus, ReturnType<typeof css>> = {
  scheduled: css`
    color: #ffcc80;
    background: rgba(255, 167, 38, 0.1);
    border: 1px solid rgba(255, 167, 38, 0.28);
  `,
  live: css`
    color: #ff8a80;
    background: rgba(244, 67, 54, 0.12);
    border: 1px solid rgba(244, 67, 54, 0.35);
  `,
  finished: css`
    color: rgba(255, 255, 255, 0.55);
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.12);
  `,
};

export const StatusBadge = styled.span<{ $status: MatchStatus }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
  text-transform: lowercase;
  ${({ $status }) => statusStyles[$status]}

  ${({ $status }) =>
    $status === "live"
      ? css`
          ${livePulse}

          &::before {
            content: "";
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #ff5252;
            box-shadow: 0 0 6px rgba(255, 82, 82, 0.75);
            animation: matchLivePulse 1.4s ease-in-out infinite;
          }
        `
      : ""}
`;

export const CardIconButton = styled.button<{ $danger?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  padding: 0;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: rgba(255, 255, 255, 0.38);
  cursor: pointer;
  opacity: 0;
  transition: all 0.18s ease;

  ${MatchAccordion}:hover &,
  ${MatchAccordion}:focus-within &,
  ${MatchAccordion}.Mui-expanded & {
    opacity: 1;
  }

  @media (hover: none), ${media.down("md")} {
    opacity: 1;
  }

  &:hover {
    color: ${({ $danger }) => ($danger ? "#ef9a9a" : "#a5d6a7")};
    background: ${({ $danger }) =>
      $danger ? "rgba(239, 83, 80, 0.12)" : "rgba(76, 175, 80, 0.12)"};
  }
`;

export const MatchDetailsPanel = styled.div`
  padding: 12px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const SettleBetsRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const SettleBetsButton = styled.button`
  width: 100%;
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid rgba(102, 187, 106, 0.35);
  background: rgba(76, 175, 80, 0.12);
  color: #a5d6a7;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover:not(:disabled) {
    background: rgba(76, 175, 80, 0.2);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

export const SettlementNote = styled.p`
  margin: 0;
  font-size: 11px;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.42);
`;
