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
    145deg,
    rgba(44, 50, 44, 0.72) 0%,
    rgba(30, 32, 30, 0.96) 42%,
    rgba(22, 22, 22, 0.99) 100%
  ) !important;
  border: 1px solid rgba(255, 255, 255, 0.09) !important;
  border-radius: 14px !important;
  box-shadow:
    0 1px 10px rgba(0, 0, 0, 0.24),
    inset 0 1px 0 rgba(255, 255, 255, 0.05) !important;
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
    border-color: rgba(76, 175, 80, 0.28) !important;
    box-shadow:
      0 4px 16px rgba(0, 0, 0, 0.28),
      0 0 0 1px rgba(76, 175, 80, 0.08) !important;
  }

  &.Mui-expanded {
    margin: 0 !important;
    border-color: rgba(76, 175, 80, 0.45) !important;
    box-shadow:
      0 8px 28px rgba(0, 0, 0, 0.35),
      0 0 0 1px rgba(76, 175, 80, 0.12) !important;
  }

  .MuiAccordionSummary-root {
    align-items: center;
    min-height: 56px;
    padding: 10px 8px 10px 14px;

    ${media.down("md")} {
      padding: 10px 10px;
    }
  }

  .MuiAccordionSummary-content {
    margin: 0 !important;
  }

  .MuiAccordionDetails-root {
    padding: 0 14px 14px;

    ${media.down("md")} {
      padding: 0 10px 12px;
    }
  }
`;

export const MatchSummaryContent = styled.div`
  width: 100%;
  min-width: 0;
`;

export const CardGrid = styled.div`
  display: grid;
  width: 100%;
  min-width: 0;
  gap: 10px 14px;
  align-items: center;
  grid-template-columns: minmax(0, 2fr) minmax(0, 3fr) minmax(0, 1fr);
  grid-template-areas: "event matchup actions";

  ${media.down("md")} {
    gap: 6px 8px;
    grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
    grid-template-rows: auto auto auto;
    grid-template-areas:
      "event actions"
      "meta meta"
      "matchup matchup";
  }
`;

export const EventBlock = styled.div`
  grid-area: event;
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`;

export const EventLogoWrap = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;

  ${media.down("md")} {
    width: 36px;
    height: 36px;
  }

  .MuiAvatar-root {
    border-radius: 0;
  }
`;

export const EventText = styled.div`
  flex: 1;
  min-width: 0;
`;

export const EventOrg = styled.div`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: rgba(129, 199, 132, 0.8);
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const EventName = styled.div`
  margin-top: 1px;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.25;
  color: rgba(255, 255, 255, 0.92);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const MetaChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.48);
  flex-shrink: 0;

  svg {
    font-size: 12px;
    opacity: 0.65;
  }

  ${media.down("md")} {
    font-size: 10px;
    color: rgba(255, 255, 255, 0.55);

    svg {
      font-size: 11px;
    }
  }
`;

export const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  margin-top: 3px;

  ${media.down("md")} {
    display: none;
  }
`;

export const MetaBar = styled.div`
  display: none;

  ${media.down("md")} {
    grid-area: meta;
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

export const MetaDot = styled.span`
  color: rgba(255, 255, 255, 0.2);
  font-size: 10px;
  flex-shrink: 0;
`;

export const FormatBadge = styled.span`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.03em;
  color: rgba(165, 214, 167, 0.85);
`;

export const MetaFormatChip = styled.span`
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  min-height: 22px;
  padding: 0 7px;
  border-radius: 999px;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.03em;
  color: rgba(165, 214, 167, 0.9);
  background: rgba(76, 175, 80, 0.08);
  border: 1px solid rgba(102, 187, 106, 0.22);
`;

export const ActionsBlock = styled.div`
  grid-area: actions;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 5px;
  min-width: 0;

  ${media.down("md")} {
    align-self: start;
    gap: 4px;
  }
`;

export const MatchupBlock = styled.div`
  grid-area: matchup;
  display: grid;
  width: 100%;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: stretch;
  gap: 8px;
  min-width: 0;
  padding: 6px 8px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.06);

  ${media.down("md")} {
    gap: 6px;
    padding: 8px 6px;
  }
`;

export const VsOrb = styled.div<{ $hasScore?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  justify-self: center;
  min-width: ${({ $hasScore }) => ($hasScore ? "48px" : "28px")};
  height: ${({ $hasScore }) => ($hasScore ? "28px" : "28px")};
  padding: ${({ $hasScore }) => ($hasScore ? "0 8px" : "0")};
  border-radius: ${({ $hasScore }) => ($hasScore ? "8px" : "50%")};
  font-size: ${({ $hasScore }) => ($hasScore ? "13px" : "10px")};
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  letter-spacing: ${({ $hasScore }) => ($hasScore ? "0.04em" : "0.02em")};
  color: ${({ $hasScore }) => ($hasScore ? "rgba(255, 255, 255, 0.88)" : "rgba(255, 255, 255, 0.35)")};
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);

  ${media.down("md")} {
    min-width: ${({ $hasScore }) => ($hasScore ? "42px" : "24px")};
    height: 24px;
    font-size: ${({ $hasScore }) => ($hasScore ? "11px" : "9px")};
    padding: ${({ $hasScore }) => ($hasScore ? "0 6px" : "0")};
  }
`;

export const TeamSlot = styled.button<{ $leading?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  width: 100%;
  justify-self: stretch;
  padding: 6px 8px;
  border-radius: 10px;
  font-family: inherit;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.9);
  background: ${({ $leading }) =>
    $leading ? "rgba(76, 175, 80, 0.12)" : "rgba(255, 255, 255, 0.03)"};
  border: 1px solid
    ${({ $leading }) => ($leading ? "rgba(102, 187, 106, 0.38)" : "rgba(255, 255, 255, 0.08)")};
  transition:
    border-color 0.18s ease,
    background 0.18s ease,
    transform 0.15s ease;

  text-align: left;

  &:hover {
    border-color: rgba(102, 187, 106, 0.45);
    background: rgba(76, 175, 80, 0.12);
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus-visible {
    outline: 2px solid #66bb6a;
    outline-offset: 2px;
  }

  ${media.down("md")} {
    justify-content: center;
    flex-direction: row !important;
    text-align: center;
    padding: 6px 4px;
    gap: 0;
  }

  ${media.up("md")} {
    ${media.down("lg")} {
      justify-content: center;
      flex-direction: row !important;
      text-align: center;
      padding: 6px 4px;
      gap: 0;
    }
  }
`;

export const LogoRing = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;

  ${media.down("md")} {
    width: 36px;
    height: 36px;
  }

  .MuiAvatar-root {
    border-radius: 0;
  }
`;

export const TeamName = styled.span`
  flex: 1;
  min-width: 0;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.25;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  ${media.down("md")} {
    display: none;
  }

  ${media.up("md")} {
    ${media.down("lg")} {
      display: none;
    }
  }
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
    background: rgba(255, 167, 38, 0.12);
    border: 1px solid rgba(255, 167, 38, 0.28);
  `,
  live: css`
    color: #ff8a80;
    background: rgba(244, 67, 54, 0.14);
    border: 1px solid rgba(244, 67, 54, 0.38);
  `,
  finished: css`
    color: rgba(255, 255, 255, 0.45);
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
  `,
};

export const StatusBadge = styled.span<{ $status: MatchStatus; $inMetaBar?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
  flex-shrink: 0;
  ${({ $status }) => statusStyles[$status]}

  ${media.down("md")} {
    ${({ $inMetaBar }) =>
      $inMetaBar
        ? css`
            min-height: 22px;
            padding: 0 8px;
            font-size: 10px;
            gap: 3px;
          `
        : css`
            display: none;
          `}
  }

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

          ${media.down("md")} {
            &::before {
              width: 5px;
              height: 5px;
            }
          }
        `
      : ""}
`;

export const CardIconButton = styled.button<{ $danger?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: rgba(255, 255, 255, 0.35);
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
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
  gap: 8px;
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
