import styled, { css } from "styled-components";
import type { EventTier } from "@/entities/event";

const tierAccent: Record<EventTier, string> = {
  Major: "rgba(255, 167, 38, 0.85)",
  Big: "rgba(33, 150, 243, 0.85)",
  Small: "rgba(255, 255, 255, 0.22)",
};

export const EventStatsSummaryCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  min-width: 0;
`;

export const EventStatsSummaryRow = styled.div<{ $tier: EventTier }>`
  position: relative;
  display: grid;
  gap: 12px;
  min-width: 0;
  padding: 14px 16px 16px;
  border-radius: 16px;
  overflow: hidden;
  background: linear-gradient(
    160deg,
    rgba(36, 38, 42, 0.98) 0%,
    rgba(24, 24, 26, 0.99) 55%,
    rgba(18, 18, 20, 1) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    0 2px 14px rgba(0, 0, 0, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
  grid-template-columns: 1fr;
  grid-template-areas:
    "top"
    "metrics";

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    pointer-events: none;
    background: linear-gradient(
      90deg,
      transparent 0%,
      ${({ $tier }) => tierAccent[$tier]} 35%,
      ${({ $tier }) => tierAccent[$tier]} 65%,
      transparent 100%
    );
  }
`;

export const EventStatsSummaryTop = styled.div`
  grid-area: top;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-width: 0;
`;

export const EventStatsSummaryTierCell = styled.div`
  min-width: 0;
`;

export const EventStatsSummaryProfitBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  min-width: 0;
  text-align: right;
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
  gap: 12px;
  min-width: 0;
`;

export const EventStatsSummaryMetricCell = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 4px;
  min-height: 52px;
  padding: 10px 14px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
`;

export const EventStatsSummaryMetricValue = styled.div<{ $color?: string }>`
  font-size: 15px;
  font-weight: 800;
  line-height: 1.15;
  color: ${({ $color }) => $color ?? "rgba(255, 255, 255, 0.92)"};
  font-variant-numeric: tabular-nums;
`;

export const EventStatsSummaryMetricLabel = styled.div`
  font-size: 9px;
  font-weight: 600;
  line-height: 1;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.4);
`;

export const EventStatsSummaryWld = styled.div`
  display: inline-flex;
  flex-wrap: nowrap;
  gap: 4px;
  align-items: center;
`;

export const EventStatsSummaryWldBadge = styled.span<{
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
