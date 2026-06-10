import styled, { css } from "styled-components";
import type { EventTier } from "@/entities/event";
import { eventTierStyles } from "@/features/events/lib/eventTier";
import { media } from "@/shared/styles/breakpoints";
import { mobileCardSurface } from "@/shared/styles/mobileTokens";

export const EventStatsSummaryCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;

  ${media.up("lg")} {
    gap: 0;
    border-radius: 12px;
    ${mobileCardSurface};
    overflow: hidden;
  }
`;

export const EventStatsSummaryRow = styled.div<{ $tier: EventTier }>`
  display: grid;
  gap: 10px;
  min-width: 0;
  padding: 12px;
  border-radius: 14px;
  ${mobileCardSurface};
  grid-template-columns: 1fr;
  grid-template-areas:
    "top"
    "metrics";

  ${({ $tier }) => {
    const { color } = eventTierStyles[$tier];
    return css`
      background:
        radial-gradient(circle at 100% 0%, ${color}18 0%, transparent 52%),
        linear-gradient(145deg, rgba(42, 42, 42, 0.98) 0%, rgba(22, 22, 22, 0.99) 100%);
    `;
  }}

  ${media.up("lg")} {
    grid-template-columns: 68px minmax(120px, 1.4fr) 1fr;
    grid-template-areas: "tier profit metrics";
    align-items: center;
    column-gap: 16px;
    row-gap: 0;
    padding: 14px 16px;
    border-radius: 0;
    background: ${({ $tier }) => {
      const { color } = eventTierStyles[$tier];
      return `linear-gradient(90deg, ${color}10 0%, transparent 32%)`;
    }};
    box-shadow: none;
    border: none;

    &:not(:last-child) {
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }
  }
`;

export const EventStatsSummaryTop = styled.div`
  grid-area: top;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  min-width: 0;

  ${media.up("lg")} {
    display: contents;
  }
`;

export const EventStatsSummaryTierCell = styled.div`
  min-width: 0;

  ${media.up("lg")} {
    grid-area: tier;
  }
`;

export const EventStatsSummaryProfitBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  min-width: 0;
  text-align: right;

  ${media.up("lg")} {
    grid-area: profit;
    align-items: flex-start;
    text-align: left;
  }
`;

export const EventStatsSummaryProfitValue = styled.div<{ $positive?: boolean; $muted?: boolean }>`
  font-size: 22px;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;

  color: ${({ $muted, $positive }) =>
    $muted ? "rgba(255, 255, 255, 0.35)" : $positive ? "#81c784" : "#e57373"};

  ${media.up("lg")} {
    font-size: 20px;
  }
`;

export const EventStatsSummaryProfitHint = styled.div`
  margin-top: 3px;
  font-size: 10px;
  font-weight: 500;
  line-height: 1.2;
  color: rgba(255, 255, 255, 0.34);
  font-variant-numeric: tabular-nums;
`;

export const EventStatsSummaryMetrics = styled.div`
  grid-area: metrics;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 6px;
  min-width: 0;

  ${media.up("lg")} {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 20px;
  }
`;

export const EventStatsSummaryMetricCell = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 52px;
  padding: 8px 6px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.06);
  text-align: center;

  ${media.up("lg")} {
    min-height: 0;
    padding: 0;
    border-radius: 0;
    background: transparent;
    border: none;
    min-width: 72px;
  }
`;

export const EventStatsSummaryMetricValue = styled.div<{ $color?: string }>`
  font-size: 15px;
  font-weight: 700;
  line-height: 1.15;
  color: ${({ $color }) => $color ?? "rgba(255, 255, 255, 0.88)"};
  font-variant-numeric: tabular-nums;

  ${media.up("lg")} {
    font-size: 16px;
  }
`;

export const EventStatsSummaryMetricLabel = styled.div`
  margin-top: 4px;
  font-size: 9px;
  font-weight: 600;
  line-height: 1;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.32);

  ${media.up("lg")} {
    margin-top: 3px;
  }
`;

export const EventStatsSummaryWld = styled.div`
  display: inline-flex;
  flex-wrap: nowrap;
  gap: 4px;
  align-items: center;
  justify-content: center;
`;

export const EventStatsSummaryWldBadge = styled.span<{
  $variant: "win" | "loss" | "pending";
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 5px;
  border-radius: 5px;
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
  font-variant-numeric: tabular-nums;

  ${({ $variant }) => {
    switch ($variant) {
      case "win":
        return css`
          color: #a5d6a7;
          background: rgba(102, 187, 106, 0.16);
        `;
      case "loss":
        return css`
          color: #ef9a9a;
          background: rgba(239, 83, 80, 0.14);
        `;
      case "pending":
        return css`
          color: #ffcc80;
          background: rgba(255, 167, 38, 0.14);
        `;
    }
  }}
`;
