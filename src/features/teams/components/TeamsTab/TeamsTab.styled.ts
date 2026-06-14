import styled, { css, keyframes } from "styled-components";
const shimmer = keyframes`
  0% { background-position: 200% center; }
  100% { background-position: -200% center; }
`;

export type RankTone = "gold" | "silver" | "bronze";

export const TabRoot = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
`;

export const HeroCard = styled.div`
  position: relative;
  overflow: hidden;
  padding: 18px 20px;
  border-radius: 16px;
  background:
    radial-gradient(circle at 100% 0%, rgba(129, 199, 132, 0.18) 0%, transparent 42%),
    radial-gradient(circle at 0% 100%, rgba(76, 175, 80, 0.14) 0%, transparent 40%),
    linear-gradient(145deg, rgba(42, 42, 42, 0.98) 0%, rgba(22, 22, 22, 0.99) 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.28);

`;

export const HeroGlow = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    105deg,
    transparent 30%,
    rgba(255, 255, 255, 0.03) 50%,
    transparent 70%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 8s linear infinite;
`;

export const HeroContent = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
`;

export const HeroLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
`;

export const HeroIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(129, 199, 132, 0.24) 0%, rgba(76, 175, 80, 0.1) 100%);
  border: 1px solid rgba(129, 199, 132, 0.32);
  color: #a5d6a7;
  flex-shrink: 0;
`;

export const HeroText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

export const HeroTitle = styled.h2`
  margin: 0;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 0.01em;
  color: rgba(255, 255, 255, 0.95);
`;

export const HeroHint = styled.span`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.45);
`;

export const HeroBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.78);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  white-space: nowrap;
`;

export const TeamsCard = styled.div`
  background: linear-gradient(
    145deg,
    rgba(42, 42, 42, 0.98) 0%,
    rgba(26, 26, 26, 0.99) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.22);
  overflow: hidden;
`;

export const Toolbar = styled.div`
  padding: 14px 16px;
  background: rgba(0, 0, 0, 0.18);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);

`;

export const FiltersRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-width: 0;
`;

export const SearchFieldWrap = styled.div`
  flex: 1;
  min-width: 0;
`;

export const RefreshButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  margin: 0;
  padding: 0;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: #2e2e2e;
  color: rgba(255, 255, 255, 0.62);
  cursor: pointer;
  transition:
    color 0.15s ease,
    border-color 0.15s ease,
    background 0.15s ease;

  &:hover:not(:disabled) {
    color: rgba(255, 255, 255, 0.92);
    border-color: rgba(129, 199, 132, 0.32);
    background: rgba(76, 175, 80, 0.1);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  svg {
    font-size: 20px;
  }
`;

export const ListSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 14px 14px;

`;

const rankToneStyles: Record<RankTone, ReturnType<typeof css>> = {
  gold: css`
    color: #ffd54f;
    background: linear-gradient(135deg, rgba(255, 213, 79, 0.28) 0%, rgba(255, 179, 0, 0.12) 100%);
    border: 1px solid rgba(255, 213, 79, 0.42);
    box-shadow: 0 0 16px rgba(255, 213, 79, 0.12);
  `,
  silver: css`
    color: #cfd8dc;
    background: linear-gradient(135deg, rgba(176, 190, 197, 0.24) 0%, rgba(144, 164, 174, 0.1) 100%);
    border: 1px solid rgba(176, 190, 197, 0.35);
  `,
  bronze: css`
    color: #ffcc80;
    background: linear-gradient(135deg, rgba(255, 171, 64, 0.24) 0%, rgba(255, 138, 0, 0.1) 100%);
    border: 1px solid rgba(255, 171, 64, 0.35);
  `,
};

const rowToneStyles: Record<RankTone, ReturnType<typeof css>> = {
  gold: css`
    background:
      linear-gradient(90deg, rgba(255, 213, 79, 0.1) 0%, rgba(255, 255, 255, 0.03) 38%),
      rgba(255, 255, 255, 0.03);
    border-color: rgba(255, 213, 79, 0.22);
  `,
  silver: css`
    background:
      linear-gradient(90deg, rgba(176, 190, 197, 0.08) 0%, rgba(255, 255, 255, 0.03) 38%),
      rgba(255, 255, 255, 0.03);
    border-color: rgba(176, 190, 197, 0.18);
  `,
  bronze: css`
    background:
      linear-gradient(90deg, rgba(255, 171, 64, 0.08) 0%, rgba(255, 255, 255, 0.03) 38%),
      rgba(255, 255, 255, 0.03);
    border-color: rgba(255, 171, 64, 0.18);
  `,
};

export const TeamRow = styled.div<{ $tone?: RankTone }>`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: background 0.15s ease, border-color 0.15s ease, transform 0.15s ease;

  ${({ $tone }) => ($tone ? rowToneStyles[$tone] : "")}

  &:hover {
    background: rgba(76, 175, 80, 0.07);
    border-color: rgba(76, 175, 80, 0.18);
    transform: translateX(2px);
  }

`;

export const RowLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
`;

export const RankNumber = styled.span<{ $tone?: RankTone }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 9px;
  font-size: 12px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  color: rgba(255, 255, 255, 0.62);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  flex-shrink: 0;

  ${({ $tone }) => ($tone ? rankToneStyles[$tone] : "")}
`;

export const LogoRing = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  flex-shrink: 0;

  .MuiAvatar-root {
    border-radius: 0;
  }
`;

export const RowInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
  flex: 1;
`;

export const TeamName = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
  word-break: break-word;
  line-height: 1.25;
`;

export const RowStats = styled.span`
  font-size: 11px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.42);
  line-height: 1.2;
`;

export const ShareTrack = styled.div`
  height: 4px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  overflow: hidden;
`;

export const ShareFill = styled.div<{ $share: number; $tone?: RankTone }>`
  height: 100%;
  width: ${({ $share }) => `${Math.max(8, $share * 100)}%`};
  border-radius: inherit;
  background: ${({ $tone }) =>
    $tone === "gold"
      ? "linear-gradient(90deg, #ffd54f 0%, #ffb300 100%)"
      : $tone === "silver"
        ? "linear-gradient(90deg, #b0bec5 0%, #90a4ae 100%)"
        : $tone === "bronze"
          ? "linear-gradient(90deg, #ffab40 0%, #ff8f00 100%)"
          : "linear-gradient(90deg, #66bb6a 0%, #43a047 100%)"};
  transition: width 0.35s ease;
`;

export const RowRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  flex-shrink: 0;

`;

export const BetsCount = styled.span`
  font-size: 16px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  color: #a5d6a7;
`;

export const BetsLabel = styled.span`
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.38);
`;

export const EmptyState = styled.p`
  margin: 16px;
  padding: 36px 20px;
  text-align: center;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px dashed rgba(255, 255, 255, 0.1);
`;
