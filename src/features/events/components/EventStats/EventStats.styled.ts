import { Accordion } from "@mui/material";
import styled, { css } from "styled-components";
import type { EventTier } from "@/entities/event";
import { eventTierStyles } from "@/features/events/lib/eventTier";
import { media } from "@/shared/styles/breakpoints";
import { mobileCardSurface, mobileEmptyState } from "@/shared/styles/mobileTokens";

export const EventStatsRoot = styled.section`
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;

  ${media.down("md")} {
    gap: 14px;
  }
`;

export const EventStatsCard = styled.div`
  ${mobileCardSurface};
  border-radius: 14px;
  overflow: hidden;

  ${media.down("md")} {
    background: transparent;
    border: none;
    box-shadow: none;
    border-radius: 0;
    overflow: visible;
  }
`;

export const FiltersPanel = styled.div`
  padding: 10px 12px;
  background: rgba(0, 0, 0, 0.18);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);

  ${media.down("md")} {
    position: sticky;
    top: 0;
    z-index: 8;
    padding: 12px;
    margin-bottom: 4px;
    border-radius: 14px;
    ${mobileCardSurface};
    border-bottom: none;
    backdrop-filter: blur(10px);
    background:
      linear-gradient(145deg, rgba(36, 36, 36, 0.98) 0%, rgba(22, 22, 22, 0.99) 100%);
  }
`;

export const FiltersHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
`;

export const FiltersTitle = styled.h3`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.01em;
`;

export const FiltersWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;

  ${media.up("md")} {
    display: flex;
    flex-wrap: wrap;
  }
`;

export const FiltersActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

export const filterControlSx = {
  width: { xs: "100%", sm: "auto" },
  minWidth: { xs: 0, sm: 148 },
  flex: { xs: "1 1 100%", sm: "1 1 148px" },
  "& .MuiOutlinedInput-root": {
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: "10px",
  },
};

export const filterSelectMenuProps = {
  PaperProps: {
    sx: {
      maxHeight: 320,
      backgroundImage: "none",
    },
  },
};

export const FilterOptionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  width: 100%;
`;

export const EventScrollArea = styled.div`
  min-width: 0;
  padding: 6px 8px 8px;

  ${media.down("md")} {
    padding: 0 0 10px;
  }
`;

export const EventGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;

  ${media.down("md")} {
    gap: 10px;
  }
`;

export const EmptySearch = styled.p`
  ${mobileEmptyState};

  ${media.down("md")} {
    margin: 0;
  }
`;

export const EventAccordion = styled(Accordion)`
  background: linear-gradient(
    145deg,
    rgba(42, 42, 42, 0.98) 0%,
    rgba(26, 26, 26, 0.99) 100%
  ) !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  border-radius: 14px !important;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.22) !important;
  overflow: hidden !important;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.15s ease;

  &::before {
    display: none;
  }

  &:hover {
    border-color: rgba(76, 175, 80, 0.28) !important;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.28) !important;
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
    min-height: 0 !important;
    padding: 6px 10px 6px 12px;

    ${media.down("md")} {
      padding: 8px 10px 8px 12px;
    }
  }

  .MuiAccordionSummary-content {
    margin: 0 !important;
  }

  .MuiAccordionDetails-root {
    padding: 0 10px 10px;

    ${media.down("md")} {
      padding: 0 10px 12px;
    }
  }
`;

export const EventSummaryContent = styled.div`
  width: 100%;
  min-width: 0;
`;

const eventMetricsTileGap = 8;
const eventMetricsActionsWidth = 36;
const eventMetricsTilesWidth = "372px";
const eventMetricsColumnWidth = "408px";
const eventWinnerTileWidth = 120;

const resolveEventMetricsColumnWidth = (withWinner: boolean) =>
  withWinner
    ? 372 + eventWinnerTileWidth + eventMetricsTileGap + eventMetricsActionsWidth
    : 408;

export const EventCardLayout = styled.div`
  display: grid;
  width: 100%;
  min-width: 0;
  gap: 6px 14px;
  align-items: center;
  grid-template-columns: minmax(0, 1fr) auto;
  grid-template-areas:
    "head stats"
    "tags stats";

  ${media.down("md")} {
    gap: 8px;
    grid-template-columns: 1fr;
    grid-template-areas:
      "head"
      "tags"
      "stats";
  }

  ${media.up("md")} {
    ${media.down("lg")} {
      gap: 8px;
      grid-template-columns: 1fr;
      grid-template-areas:
        "head"
        "tags"
        "stats";
    }
  }

  ${media.up("lg")} {
    align-items: stretch;
    grid-template-columns: minmax(0, 1fr) auto;
  }
`;

export const EventCardHead = styled.div`
  grid-area: head;
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`;

export const EventCardIdentity = styled.div`
  flex: 1;
  min-width: 0;
`;

export const EventCardOrg = styled.div`
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

export const EventCardName = styled.div`
  margin-top: 1px;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.25;
  color: rgba(255, 255, 255, 0.92);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  ${media.down("md")} {
    font-size: 15px;
  }
`;

export const EventCardTags = styled.div`
  grid-area: tags;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  min-width: 0;

  ${media.down("md")} {
    flex-wrap: nowrap;
    gap: 6px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    padding-bottom: 1px;

    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

export const EventWinnerChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  flex-shrink: 0;
  min-height: 22px;
  padding: 0 8px 0 4px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 700;
  color: #ffe082;
  background: rgba(255, 213, 79, 0.1);
  border: 1px solid rgba(255, 213, 79, 0.28);
  white-space: nowrap;
  max-width: 100%;

  span {
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const EventDateChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
  min-height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: rgba(255, 255, 255, 0.58);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  white-space: nowrap;

  svg {
    font-size: 11px;
    opacity: 0.65;
    flex-shrink: 0;
  }

  ${media.up("md")} {
    min-height: 20px;
    padding: 0 7px;
    font-size: 10px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.48);
    background: transparent;
    border: none;
    padding: 0;

    svg {
      font-size: 12px;
    }
  }
`;

export const EventCardStats = styled.div<{ $withWinner?: boolean }>`
  grid-area: stats;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${eventMetricsTileGap}px;
  min-width: 0;

  ${media.up("lg")} {
    width: ${({ $withWinner }) => `${resolveEventMetricsColumnWidth(Boolean($withWinner))}px`};
    flex-shrink: 0;
    align-self: stretch;
  }

  ${media.down("md")} {
    justify-content: stretch;
    width: 100%;
  }
`;

export const EventCardActions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  align-self: stretch;
  gap: 4px;
  flex-shrink: 0;
`;

export const EventEditButton = styled.button<{ $danger?: boolean }>`
  flex-shrink: 0;
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

  ${EventAccordion}:hover &,
  ${EventAccordion}:focus-within &,
  ${EventAccordion}.Mui-expanded & {
    opacity: 1;
  }

  ${media.down("md")} {
    opacity: 1;
  }

  @media (hover: none) {
    opacity: 1;
  }

  &:hover {
    color: ${({ $danger }) => ($danger ? "#ef9a9a" : "#a5d6a7")};
    background: ${({ $danger }) =>
      $danger ? "rgba(239, 83, 80, 0.12)" : "rgba(76, 175, 80, 0.12)"};
  }
`;

export const EventLogoWrap = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;

  ${media.down("md")} {
    width: 34px;
    height: 34px;
  }

  .MuiAvatar-root {
    border-radius: 0;
  }
`;

export const EventTierBadge = styled.span<{ $tier: EventTier }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  min-height: 22px;
  padding: 0 7px;
  border-radius: 999px;
  font-size: 9px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ $tier }) => eventTierStyles[$tier].color};
  background: ${({ $tier }) => eventTierStyles[$tier].bg};
  border: 1px solid ${({ $tier }) => eventTierStyles[$tier].border};

  ${media.up("md")} {
    min-height: 20px;
    padding: 2px 6px;
  }
`;

export const EventMetricsGrid = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  width: auto;

  ${media.up("lg")} {
    width: ${eventMetricsTilesWidth};
    flex: 1 1 ${eventMetricsTilesWidth};
  }

  ${media.down("md")} {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px;
    flex: 1;
    min-width: 0;
    width: auto;
  }
`;

const metricHighlight = css`
  background: rgba(76, 175, 80, 0.08);
  border-color: rgba(76, 175, 80, 0.2);
`;

const metricTileWidths = {
  winner: "120px",
  winRate: "96px",
  record: "112px",
  profit: "148px",
} as const;

export const MetricTile = styled.div<{
  $accent?: string;
  $highlight?: boolean;
  $variant?: keyof typeof metricTileWidths;
}>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  min-height: 50px;
  padding: 7px 10px;
  border-radius: 9px;
  flex: 0 0 auto;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.07);
  transition: background 0.15s ease;
  box-sizing: border-box;

  ${({ $highlight }) => $highlight && metricHighlight}

  ${({ $accent, $highlight }) =>
    $accent &&
    !$highlight &&
    css`
      border-color: ${$accent}33;
      background: ${$accent}0f;
    `}

  ${({ $variant }) =>
    $variant &&
    css`
      ${media.up("lg")} {
        width: ${metricTileWidths[$variant]};
        flex: 0 0 ${metricTileWidths[$variant]};
        align-items: center;
        text-align: center;
      }
    `}

  ${media.down("md")} {
    align-items: center;
    text-align: center;
    min-height: 54px;
    min-width: 0;
    padding: 8px 6px;
    border-radius: 10px;
  }
`;

export const MetricTileLabel = styled.div`
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 4px;
  line-height: 1;

  ${media.down("md")} {
    font-size: 10px;
    margin-bottom: 5px;
  }
`;

export const MetricTileWinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 100%;
  min-width: 0;
  min-height: 18px;
  color: #ffe082;
  font-size: 11px;
  font-weight: 700;
  line-height: 1.1;

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
  }

  ${media.down("md")} {
    font-size: 10px;
  }
`;

export const MetricTileValue = styled.div<{ $color?: string; $compact?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  min-height: 18px;
  font-size: ${({ $compact }) => ($compact ? "15px" : "17px")};
  font-weight: 800;
  line-height: 1.1;
  color: ${({ $color }) => $color ?? "#fff"};
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  ${media.up("lg")} {
    justify-content: center;
  }

  ${media.down("md")} {
    justify-content: center;
    font-size: ${({ $compact }) => ($compact ? "14px" : "16px")};
    min-height: 18px;
  }
`;

export const WldBadges = styled.div`
  display: inline-flex;
  flex-wrap: nowrap;
  gap: 4px;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  min-height: 20px;

  ${media.up("lg")} {
    justify-content: center;
  }

  ${media.down("md")} {
    justify-content: center;
  }
`;

export const WldBadge = styled.span<{
  $variant: "win" | "loss" | "pending";
}>`
  display: inline-grid;
  place-items: center;
  box-sizing: border-box;
  min-width: 20px;
  height: 20px;
  padding: 0 4px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
  text-align: center;
  font-variant-numeric: tabular-nums;

  ${({ $variant }) => {
    switch ($variant) {
      case "win":
        return css`
          color: #a5d6a7;
          background: rgba(102, 187, 106, 0.18);
          border: 1px solid rgba(102, 187, 106, 0.35);
        `;
      case "loss":
        return css`
          color: #ef9a9a;
          background: rgba(239, 83, 80, 0.15);
          border: 1px solid rgba(239, 83, 80, 0.35);
        `;
      case "pending":
        return css`
          color: #ffcc80;
          background: rgba(255, 167, 38, 0.15);
          border: 1px solid rgba(255, 167, 38, 0.35);
        `;
    }
  }}
`;

export const EventDetailsPanel = styled.div`
  min-width: 0;
  padding: 8px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
  gap: 8px;

  ${media.down("md")} {
    padding: 10px;
    border-radius: 12px;
    gap: 10px;
  }
`;
