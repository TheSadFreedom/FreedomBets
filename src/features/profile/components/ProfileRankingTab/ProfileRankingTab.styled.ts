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

export const HeroSubtitle = styled.p`
  margin: 0;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.52);
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

export const PodiumSection = styled.div<{ $count: number }>`
  display: grid;
  align-items: end;
  gap: 10px;
  padding: 20px 16px 16px;

  ${({ $count }) =>
    $count === 1
      ? css`
          grid-template-columns: minmax(0, 280px);
          justify-content: center;
        `
      : $count === 2
        ? css`
            grid-template-columns: repeat(2, minmax(0, 1fr));
            max-width: 520px;
            margin: 0 auto;
          `
        : css`
            grid-template-columns: 1fr 1.12fr 1fr;
          `}

  ${media.down("sm")} {
    gap: 8px;
    padding: 16px 10px 14px;
  }
`;

const podiumCardStyles = {
  1: css`
    min-height: 168px;
    background:
      radial-gradient(circle at 50% 0%, rgba(255, 213, 79, 0.22) 0%, transparent 55%),
      linear-gradient(180deg, rgba(255, 213, 79, 0.12) 0%, rgba(255, 255, 255, 0.03) 100%);
    border-color: rgba(255, 213, 79, 0.35);
    box-shadow: 0 10px 28px rgba(255, 193, 7, 0.12);
  `,
  2: css`
    min-height: 142px;
    background:
      radial-gradient(circle at 50% 0%, rgba(224, 224, 224, 0.16) 0%, transparent 55%),
      linear-gradient(180deg, rgba(224, 224, 224, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
    border-color: rgba(224, 224, 224, 0.28);
  `,
  3: css`
    min-height: 128px;
    background:
      radial-gradient(circle at 50% 0%, rgba(255, 183, 77, 0.16) 0%, transparent 55%),
      linear-gradient(180deg, rgba(255, 183, 77, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
    border-color: rgba(255, 183, 77, 0.28);
  `,
};

export const PodiumCard = styled.div<{ $rank: 1 | 2 | 3; $active?: boolean; $solo?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 14px 10px 16px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  text-align: center;
  transition: transform 0.18s ease, box-shadow 0.18s ease;

  ${({ $rank }) => podiumCardStyles[$rank]}

  ${({ $solo, $rank }) =>
    $solo &&
    css`
      min-height: 180px;
      ${$rank === 1 ? "max-width: 280px; width: 100%; margin: 0 auto;" : ""}
    `}

  ${({ $active }) =>
    $active &&
    css`
      outline: 2px solid rgba(129, 199, 132, 0.55);
      outline-offset: 2px;
    `}

  &:hover {
    transform: translateY(-2px);
  }

  ${media.down("sm")} {
    padding: 12px 8px 14px;
    gap: 8px;
  }
`;

export const Avatar = styled.div<{ $rank?: 1 | 2 | 3 | null; $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${({ $rank }) => ($rank === 1 ? "54px" : "46px")};
  height: ${({ $rank }) => ($rank === 1 ? "54px" : "46px")};
  border-radius: 50%;
  font-size: ${({ $rank }) => ($rank === 1 ? "20px" : "16px")};
  font-weight: 800;
  letter-spacing: 0.02em;
  color: #141414;
  background: ${({ $rank }) => {
    if ($rank === 1) return "linear-gradient(135deg, #ffe082 0%, #ffb300 100%)";
    if ($rank === 2) return "linear-gradient(135deg, #f5f5f5 0%, #bdbdbd 100%)";
    if ($rank === 3) return "linear-gradient(135deg, #ffcc80 0%, #fb8c00 100%)";
    return "linear-gradient(135deg, rgba(129, 199, 132, 0.85) 0%, rgba(76, 175, 80, 0.85) 100%)";
  }};
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.28);
  border: 2px solid
    ${({ $active }) => ($active ? "rgba(129, 199, 132, 0.9)" : "rgba(255, 255, 255, 0.18)")};
  flex-shrink: 0;
`;

export const RankMedal = styled.span<{ $rank: 1 | 2 | 3 }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  padding: 0 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
  color: ${({ $rank }) => ($rank === 1 ? "#1b1b1b" : "rgba(255, 255, 255, 0.92)")};
  background: ${({ $rank }) => {
    if ($rank === 1) return "linear-gradient(135deg, #ffd54f 0%, #ffb300 100%)";
    if ($rank === 2) return "linear-gradient(135deg, #eeeeee 0%, #9e9e9e 100%)";
    return "linear-gradient(135deg, #ffcc80 0%, #ef6c00 100%)";
  }};
`;

export const ProfileName = styled.span<{ $active?: boolean; $large?: boolean }>`
  display: block;
  font-weight: ${({ $active }) => ($active ? 700 : 600)};
  font-size: ${({ $large }) => ($large ? "15px" : "14px")};
  color: ${({ $active }) => ($active ? "#a5d6a7" : "rgba(255, 255, 255, 0.92)")};
  word-break: break-word;
  line-height: 1.25;
`;

export const PodiumProfit = styled.div<{ $positive: boolean }>`
  font-size: ${({ $positive }) => ($positive ? "15px" : "14px")};
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  color: ${({ $positive }) => ($positive ? "#81c784" : "#ef5350")};
`;

export const PodiumMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px;
  width: 100%;
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
  border-top: 1px solid rgba(255, 255, 255, 0.06);

  ${media.down("sm")} {
    padding: 10px 10px 12px;
  }
`;

export const ListTitle = styled.h3`
  margin: 0 0 4px;
  padding: 0 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgba(255, 255, 255, 0.42);
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
    padding-left: 40px;
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
