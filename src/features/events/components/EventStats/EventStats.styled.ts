import { Accordion } from "@mui/material";
import styled, { css } from "styled-components";
import type { EventTier } from "@/entities/event";
import { eventTierStyles } from "@/features/events/lib/eventTier";
import { media } from "@/shared/styles/breakpoints";

export const EventStatsRoot = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const EventStatsToolbar = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;

  ${media.up("sm")} {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
  }
`;

export const filterControlSx = {
  width: { xs: "100%", sm: "auto" },
  minWidth: { xs: 0, sm: 160 },
  flex: { xs: "1 1 100%", sm: "1 1 160px" },
  "& .MuiOutlinedInput-root": {
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: "10px",
  },
};

export const EventScrollArea = styled.div`
  min-width: 0;
`;

export const EventGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const EmptySearch = styled.p`
  margin: 0;
  padding: 24px 16px;
  text-align: center;
  opacity: 0.55;
  font-size: 14px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px dashed rgba(255, 255, 255, 0.1);
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
    align-items: flex-start;
    min-height: 56px;
    padding: 4px 8px 4px 16px;
  }

  .MuiAccordionSummary-content {
    margin: 14px 0 !important;
  }

  .MuiAccordionDetails-root {
    padding: 0 14px 14px;
  }
`;

export const EventExpandIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.7);
  transition:
    background 0.2s ease,
    color 0.2s ease;

  .Mui-expanded & {
    background: rgba(76, 175, 80, 0.18);
    color: #81c784;
  }
`;

export const EventSummaryContent = styled.div`
  width: 100%;
  min-width: 0;
  padding-right: 4px;
`;

export const EventCardTop = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
`;

export const EventCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  min-width: 0;
`;

export const EventEditButton = styled.button`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  padding: 0;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: rgba(255, 255, 255, 0.28);
  cursor: pointer;
  opacity: 0;
  transition: all 0.18s ease;

  ${EventAccordion}:hover &,
  ${EventAccordion}:focus-within &,
  ${EventAccordion}.Mui-expanded & {
    opacity: 1;
  }

  &:hover {
    color: #a5d6a7;
    background: rgba(76, 175, 80, 0.12);
  }
`;

export const EventLogoWrap = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
`;

export const EventTitles = styled.div`
  min-width: 0;
  flex: 1;
`;

export const EventTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  line-height: 1.35;
  letter-spacing: 0.01em;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  ${media.down("sm")} {
    white-space: normal;
    word-break: break-word;
    overflow: visible;
    text-overflow: unset;
  }
`;

export const EventTitleName = styled.span`
  font-weight: 500;
  opacity: 0.72;
`;

export const EventTierBadge = styled.span<{ $tier: EventTier }>`
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ $tier }) => eventTierStyles[$tier].color};
  background: ${({ $tier }) => eventTierStyles[$tier].bg};
  border: 1px solid ${({ $tier }) => eventTierStyles[$tier].border};
`;

export const EventDateTime = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
  flex-wrap: wrap;
  font-size: 11px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.45);
  font-variant-numeric: tabular-nums;

  svg {
    font-size: 13px;
    opacity: 0.65;
  }
`;

export const EventMetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  width: 100%;

  @media (min-width: 560px) {
    grid-template-columns: repeat(auto-fill, minmax(118px, 1fr));
  }
`;

const metricHighlight = css`
  background: rgba(76, 175, 80, 0.08);
  border-color: rgba(76, 175, 80, 0.2);
`;

export const MetricTile = styled.div<{
  $accent?: string;
  $highlight?: boolean;
}>`
  padding: 10px 12px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.07);
  min-width: 0;
  transition: background 0.15s ease;

  ${({ $highlight }) => $highlight && metricHighlight}

  ${({ $accent, $highlight }) =>
    $accent &&
    !$highlight &&
    css`
      border-color: ${$accent}33;
      background: ${$accent}0f;
    `}
`;

export const MetricTileLabel = styled.div`
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  opacity: 0.5;
  margin-bottom: 6px;
`;

export const MetricTileValue = styled.div<{ $color?: string }>`
  font-size: 16px;
  font-weight: 700;
  line-height: 1.2;
  color: ${({ $color }) => $color ?? "#fff"};
  word-break: break-word;
`;

export const WldBadges = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
`;

export const WldBadge = styled.span<{
  $variant: "win" | "loss" | "pending";
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 26px;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.3;

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
  padding: 12px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.06);
`;
