import styled, { css, keyframes } from "styled-components";
import { media } from "@/shared/styles/breakpoints";

const shimmer = keyframes`
  0% { background-position: 200% center; }
  100% { background-position: -200% center; }
`;

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
    radial-gradient(circle at 100% 0%, rgba(255, 213, 79, 0.16) 0%, transparent 42%),
    radial-gradient(circle at 0% 100%, rgba(76, 175, 80, 0.12) 0%, transparent 40%),
    linear-gradient(145deg, rgba(42, 42, 42, 0.98) 0%, rgba(22, 22, 22, 0.99) 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.28);

  ${media.down("sm")} {
    padding: 16px;
  }
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

export const HeroText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

export const HeroTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const HeroIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(255, 213, 79, 0.22) 0%, rgba(255, 179, 0, 0.08) 100%);
  border: 1px solid rgba(255, 213, 79, 0.28);
  color: #ffd54f;
  font-size: 18px;
  line-height: 1;
`;

export const HeroTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.01em;
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

export const RankingCard = styled.div`
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

export const Avatar = styled.div<{ $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 16px;
  font-weight: 800;
  letter-spacing: 0.02em;
  color: #141414;
  background: linear-gradient(135deg, rgba(129, 199, 132, 0.85) 0%, rgba(76, 175, 80, 0.85) 100%);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.28);
  border: 2px solid
    ${({ $active }) => ($active ? "rgba(129, 199, 132, 0.9)" : "rgba(255, 255, 255, 0.18)")};
  flex-shrink: 0;
`;

export const ProfileName = styled.span<{ $active?: boolean }>`
  display: block;
  font-weight: ${({ $active }) => ($active ? 700 : 600)};
  font-size: 14px;
  color: ${({ $active }) => ($active ? "#a5d6a7" : "rgba(255, 255, 255, 0.92)")};
  word-break: break-word;
  line-height: 1.25;
`;

export const MetaPill = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: rgba(255, 255, 255, 0.72);
  background: rgba(0, 0, 0, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.08);
  white-space: nowrap;
`;

export const ListSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 14px 14px;

  ${media.down("sm")} {
    padding: 10px 10px 12px;
  }
`;

export const RankingRow = styled.div<{ $active?: boolean }>`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: background 0.15s ease, border-color 0.15s ease, transform 0.15s ease;

  ${({ $active }) =>
    $active &&
    css`
      background: rgba(76, 175, 80, 0.08);
      border-color: rgba(129, 199, 132, 0.28);
    `}

  &:hover {
    background: rgba(76, 175, 80, 0.07);
    border-color: rgba(76, 175, 80, 0.18);
    transform: translateX(2px);
  }

  ${media.down("sm")} {
    grid-template-columns: auto 1fr;
    gap: 10px;
    padding: 12px;
  }
`;

export const RowLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
`;

export const RankNumber = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: rgba(255, 255, 255, 0.62);
  background: rgba(255, 255, 255, 0.06);
  flex-shrink: 0;
`;

export const RowInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
`;

export const RowStats = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export const RowRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  flex-shrink: 0;

  ${media.down("sm")} {
    grid-column: 1 / -1;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 8px 10px;
    margin-top: 2px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.06);
  }
`;

export const ProfitValue = styled.span<{ $positive: boolean }>`
  font-size: 15px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  color: ${({ $positive }) => ($positive ? "#66bb6a" : "#ef5350")};
`;

export const ProfitLabel = styled.span`
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.38);
`;

export const EmptyState = styled.p`
  margin: 0;
  padding: 36px 20px;
  text-align: center;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px dashed rgba(255, 255, 255, 0.1);
`;
