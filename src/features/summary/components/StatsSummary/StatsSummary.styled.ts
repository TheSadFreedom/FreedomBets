import styled, { css } from "styled-components";
import { media } from "@/shared/styles/breakpoints";

export const StatsRoot = styled.section`
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;

  ${media.down("sm")} {
    gap: 12px;
  }
`;

export const StatsHero = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  padding: 16px 18px;
  border-radius: 12px;
  background:
    radial-gradient(circle at 100% 0%, rgba(129, 199, 132, 0.16) 0%, transparent 48%),
    linear-gradient(145deg, rgba(42, 42, 42, 0.98) 0%, rgba(22, 22, 22, 0.99) 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.22);

  ${media.down("sm")} {
    flex-direction: column;
    align-items: stretch;
    padding: 14px;
    gap: 10px;
  }
`;

export const StatsHeroText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

export const StatsHeroTitle = styled.h2`
  margin: 0;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgba(255, 255, 255, 0.45);
`;

export const StatsHeroProfit = styled.div<{ $positive: boolean; $muted?: boolean }>`
  font-size: 28px;
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
  color: ${({ $muted, $positive }) =>
    $muted ? "rgba(255, 255, 255, 0.35)" : $positive ? "#81c784" : "#e57373"};

  ${media.down("sm")} {
    font-size: 24px;
  }
`;

export const StatsHeroHint = styled.p`
  margin: 0;
  font-size: 11px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.38);
`;

export const StatsHeroPills = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: flex-end;

  ${media.down("sm")} {
    justify-content: flex-start;
  }
`;

export const StatsHeroPill = styled.span`
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: rgba(255, 255, 255, 0.72);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  white-space: nowrap;
`;

export const StatsPanel = styled.div`
  padding: 14px 16px;
  border-radius: 12px;
  background: linear-gradient(
    145deg,
    rgba(42, 42, 42, 0.98) 0%,
    rgba(26, 26, 26, 0.99) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.2);

  ${media.down("sm")} {
    padding: 12px;
  }
`;

export const StatsSectionHead = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
`;

export const StatsSectionIcon = styled.span<{ $tone?: "default" | "primary" }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 9px;
  flex-shrink: 0;
  color: ${({ $tone }) => ($tone === "primary" ? "#a5d6a7" : "rgba(255,255,255,0.72)")};
  background: ${({ $tone }) =>
    $tone === "primary" ? "rgba(76, 175, 80, 0.14)" : "rgba(255, 255, 255, 0.05)"};
  border: 1px solid
    ${({ $tone }) =>
      $tone === "primary" ? "rgba(129, 199, 132, 0.24)" : "rgba(255, 255, 255, 0.08)"};

  svg {
    font-size: 17px;
  }
`;

export const StatsSectionTitle = styled.h3`
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.2;
  color: rgba(255, 255, 255, 0.9);
`;

export const StatsSectionHint = styled.p`
  margin: 2px 0 0;
  font-size: 11px;
  line-height: 1.35;
  color: rgba(255, 255, 255, 0.38);
`;

export const StatsMetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;

  ${media.up("sm")} {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

export const StatsMetricTile = styled.div<{
  $accent?: string;
  $highlight?: boolean;
}>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 72px;
  padding: 10px 12px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.035);
  border: 1px solid rgba(255, 255, 255, 0.07);
  min-width: 0;

  ${({ $accent, $highlight }) =>
    $accent &&
    css`
      border-color: ${$accent}${$highlight ? "44" : "28"};
      background: ${$accent}${$highlight ? "12" : "0a"};
    `}
`;

export const StatsMetricLabel = styled.div`
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 4px;
  line-height: 1;
`;

export const StatsMetricValue = styled.div<{ $color?: string }>`
  font-size: 20px;
  font-weight: 800;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
  color: ${({ $color }) => $color ?? "#fff"};

  ${media.down("sm")} {
    font-size: 18px;
  }
`;

export const StatsMetricSub = styled.div<{ $color?: string }>`
  margin-top: 3px;
  font-size: 10px;
  font-weight: 500;
  line-height: 1.25;
  color: ${({ $color }) => $color ?? "rgba(255, 255, 255, 0.42)"};
  font-variant-numeric: tabular-nums;
`;

export const StatsWldRow = styled.div`
  display: inline-flex;
  flex-wrap: nowrap;
  gap: 4px;
  margin-top: 2px;
`;

export const StatsWldBadge = styled.span<{
  $variant: "win" | "loss" | "pending";
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 20px;
  padding: 0 5px;
  border-radius: 5px;
  font-size: 10px;
  font-weight: 700;
  line-height: 1;

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

export const OddsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;

  ${media.down("xs")} {
    grid-template-columns: 1fr;
  }

  ${media.up("sm")} {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  ${media.up("lg")} {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
`;

export const OddsCard = styled.div<{ $accent?: string }>`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 88px;
  padding: 10px 12px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.07);

  ${({ $accent }) =>
    $accent &&
    css`
      border-color: ${$accent}33;
      background: ${$accent}0c;
    `}
`;

export const OddsCardLabel = styled.div`
  font-size: 10px;
  font-weight: 600;
  line-height: 1.2;
  color: rgba(255, 255, 255, 0.48);
`;

export const OddsCardValue = styled.div<{ $color?: string }>`
  font-size: 22px;
  font-weight: 800;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  color: ${({ $color }) => $color ?? "rgba(255,255,255,0.35)"};
`;

export const OddsCardHint = styled.div`
  margin-top: auto;
  font-size: 10px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.34);
`;
