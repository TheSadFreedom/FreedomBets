import { Accordion } from "@mui/material";
import styled, { css } from "styled-components";
import type { EventTier } from "@/entities/event";
import { eventTierStyles } from "@/features/events/lib/eventTier";

const tierAccent: Record<EventTier, string> = {
  Major: "rgba(255, 167, 38, 0.85)",
  Big: "rgba(33, 150, 243, 0.85)",
  Small: "rgba(255, 255, 255, 0.22)",
};

export const EventStatsRoot = styled.section`
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 0;
`;

export const EventStatsCard = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  border-radius: 16px;
  overflow: hidden;
  background: linear-gradient(
    145deg,
    rgba(42, 42, 42, 0.98) 0%,
    rgba(26, 26, 26, 0.99) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.22);
`;

export const FiltersPanel = styled.div`
  padding: 14px 16px;
  background: rgba(0, 0, 0, 0.18);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`;

export const FiltersHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
`;

export const FiltersWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
`;

export const FiltersActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

export const EventScrollArea = styled.div`
  min-width: 0;
  padding: 14px 16px 16px;
`;

export const EventGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  min-width: 0;
`;

export const EmptySearch = styled.p`
  margin: 0;
  padding: 32px 20px;
  text-align: center;
  font-size: 15px;
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.5);
  border-radius: 14px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px dashed rgba(255, 255, 255, 0.1);
`;

export const EventAccordion = styled(Accordion)<{ $tier: EventTier }>`
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
      ${({ $tier }) => tierAccent[$tier]} 35%,
      ${({ $tier }) => tierAccent[$tier]} 65%,
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
  }
`;

export const EventSummaryContent = styled.div`
  width: 100%;
  min-width: 0;
  padding: 14px 16px 16px;
`;

export const EventTopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-width: 0;
`;

export const EventEventRow = styled.div`
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

export const EventTitleGroup = styled.div`
  min-width: 0;
  flex: 1;
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

export const EventTitle = styled.div`
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

export const EventTopActions = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
`;

const tierBadgeStyles: Record<EventTier, ReturnType<typeof css>> = {
  Major: css`
    color: ${eventTierStyles.Major.color};
    background: ${eventTierStyles.Major.bg};
    border: 1px solid ${eventTierStyles.Major.border};
  `,
  Big: css`
    color: ${eventTierStyles.Big.color};
    background: ${eventTierStyles.Big.bg};
    border: 1px solid ${eventTierStyles.Big.border};
  `,
  Small: css`
    color: ${eventTierStyles.Small.color};
    background: ${eventTierStyles.Small.bg};
    border: 1px solid ${eventTierStyles.Small.border};
  `,
};

export const TierBadge = styled.span<{ $tier: EventTier }>`
  display: inline-flex;
  align-items: center;
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
  text-transform: lowercase;
  ${({ $tier }) => tierBadgeStyles[$tier]}
`;

export const PrizeBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  flex-shrink: 0;
  color: #ffe082;
  background: rgba(255, 193, 7, 0.1);
  border: 1px solid rgba(255, 213, 79, 0.28);

  svg {
    font-size: 14px;
    opacity: 0.8;
    flex-shrink: 0;
  }
`;

export const ProfitBadge = styled.span<{ $positive: boolean; $muted?: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  flex-shrink: 0;
  color: ${({ $muted, $positive }) =>
    $muted ? "rgba(255, 255, 255, 0.35)" : $positive ? "#81c784" : "#e57373"};
  background: ${({ $muted, $positive }) =>
    $muted
      ? "rgba(255, 255, 255, 0.04)"
      : $positive
        ? "rgba(76, 175, 80, 0.12)"
        : "rgba(239, 83, 80, 0.12)"};
  border: 1px solid
    ${({ $muted, $positive }) =>
      $muted
        ? "rgba(255, 255, 255, 0.1)"
        : $positive
          ? "rgba(102, 187, 106, 0.35)"
          : "rgba(239, 83, 80, 0.35)"};
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

  ${EventAccordion}:hover &,
  ${EventAccordion}:focus-within &,
  ${EventAccordion}.Mui-expanded & {
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

export const EventDivider = styled.div`
  height: 1px;
  margin: 12px 0 14px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.02) 0%,
    rgba(255, 255, 255, 0.12) 50%,
    rgba(255, 255, 255, 0.02) 100%
  );
`;

export const EventBody = styled.div`
  display: grid;
  grid-template-columns: 92px minmax(0, 1fr);
  align-items: stretch;
  gap: 16px;
  min-width: 0;
`;

export const EventMetaCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  min-width: 0;
`;

export const EventDate = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.88);
  font-variant-numeric: tabular-nums;
  line-height: 1.3;
`;

export const EventMetricsCol = styled.div`
  min-width: 0;
`;

export const EventMetricsRow = styled.div<{ $columns?: number; $hasWinner?: boolean }>`
  display: grid;
  grid-template-columns: ${({ $columns = 4, $hasWinner }) =>
    $hasWinner
      ? `minmax(0, 1.2fr) repeat(${Math.max($columns - 1, 1)}, minmax(0, 1fr))`
      : `repeat(${$columns}, minmax(0, 1fr))`};
  align-items: stretch;
  gap: 12px;
  min-width: 0;
`;

export const EventMetricPanel = styled.div<{ $leading?: boolean; $accent?: string }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 4px;
  min-width: 0;
  min-height: 52px;
  padding: 10px 14px;
  border-radius: 12px;
  background: ${({ $leading }) =>
    $leading ? "rgba(76, 175, 80, 0.08)" : "rgba(255, 255, 255, 0.04)"};
  border: 1px solid
    ${({ $leading, $accent }) =>
      $leading
        ? "rgba(102, 187, 106, 0.28)"
        : $accent
          ? `${$accent}33`
          : "rgba(255, 255, 255, 0.08)"};
  ${({ $accent, $leading }) =>
    $accent && !$leading
      ? css`
          background: ${$accent}0f;
        `
      : ""}
`;

export const EventMetricLabel = styled.span`
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.4);
  line-height: 1;
`;

export const EventMetricValue = styled.span<{ $color?: string; $large?: boolean }>`
  font-size: ${({ $large }) => ($large ? "20px" : "15px")};
  font-weight: 800;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
  color: ${({ $color }) => $color ?? "rgba(255, 255, 255, 0.92)"};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
`;

export const WinnerPanel = styled(EventMetricPanel)`
  flex-direction: row;
  align-items: center;
  gap: 10px;
  background: rgba(255, 213, 79, 0.08);
  border-color: rgba(255, 213, 79, 0.28);
`;

export const WinnerPanelInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1;
`;

export const WinnerPanelName = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: #ffe082;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const WldBadges = styled.div`
  display: inline-flex;
  flex-wrap: nowrap;
  gap: 4px;
  align-items: center;
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
  padding: 12px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
