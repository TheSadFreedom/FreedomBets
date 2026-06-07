import styled from "styled-components";
import { media } from "@/shared/styles/breakpoints";

export const StatsRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 14px 16px;
  border-radius: 14px;

  ${media.down("sm")} {
    padding: 12px;
    gap: 12px;
  }
  background: linear-gradient(
    145deg,
    rgba(42, 42, 42, 0.98) 0%,
    rgba(26, 26, 26, 0.99) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.22);
`;

export const StatsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const StatsSectionTitle = styled.h4`
  margin: 0;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.45;
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;

  ${media.up("xs")} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  ${media.up("sm")} {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  ${media.up("lg")} {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

export const StatCard = styled.div<{ $accent?: string }>`
  padding: 12px 14px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.07);
  min-width: 0;

  ${({ $accent }) =>
    $accent &&
    `
    border-color: ${$accent}33;
    background: ${$accent}0f;
  `}
`;

export const StatLabel = styled.div`
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  opacity: 0.55;
  margin-bottom: 6px;
  line-height: 1.25;
`;

export const StatValue = styled.div<{ $color?: string }>`
  font-size: 22px;
  font-weight: 700;
  color: ${({ $color }) => $color ?? "#fff"};
  line-height: 1.2;
`;

export const StatSub = styled.div<{ $color?: string }>`
  margin-top: 4px;
  font-size: 13px;
  font-weight: 500;
  color: ${({ $color }) => $color ?? "rgba(255, 255, 255, 0.65)"};
  line-height: 1.3;
`;

export const StatHint = styled.div`
  margin-top: 4px;
  font-size: 11px;
  opacity: 0.45;
`;
