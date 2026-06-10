import styled, { css } from "styled-components";
import { media } from "@/shared/styles/breakpoints";

export const PopoverRoot = styled.div`
  min-width: 272px;
  max-width: min(340px, 92vw);
  margin-top: 8px;
  padding: 14px 14px 12px;
  border-radius: 14px;
  background: linear-gradient(
    165deg,
    rgba(42, 44, 48, 0.98) 0%,
    rgba(26, 26, 28, 0.99) 55%,
    rgba(16, 16, 18, 1) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow:
    0 16px 40px rgba(0, 0, 0, 0.45),
    0 0 0 1px rgba(255, 255, 255, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
  pointer-events: auto;
`;

export const PopoverHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  margin-bottom: 12px;
`;

export const PopoverHeaderText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

export const PopoverEyebrow = styled.span`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.42);
`;

export const PopoverTeamName = styled.span`
  font-size: 14px;
  font-weight: 700;
  line-height: 1.2;
  color: rgba(255, 255, 255, 0.92);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
`;

export const FormDots = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
`;

export const FormDot = styled.span<{ $result: "win" | "lose" }>`
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: ${({ $result }) => ($result === "win" ? "#66bb6a" : "#ef5350")};
  box-shadow: ${({ $result }) =>
    $result === "win"
      ? "0 0 10px rgba(102, 187, 106, 0.45)"
      : "0 0 10px rgba(239, 83, 80, 0.45)"};
`;

export const FormSummary = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.48);
  font-variant-numeric: tabular-nums;
`;

export const MatchList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 10px;
`;

export const MatchRow = styled.div<{ $result: "win" | "lose" }>`
  display: grid;
  grid-template-columns: 32px minmax(0, 1fr) 32px;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition:
    border-color 0.18s ease,
    background 0.18s ease;

  ${({ $result }) =>
    $result === "win"
      ? css`
          border-color: rgba(76, 175, 80, 0.22);
          background: rgba(76, 175, 80, 0.08);
        `
      : css`
          border-color: rgba(244, 67, 54, 0.22);
          background: rgba(244, 67, 54, 0.08);
        `}

  &:hover {
    border-color: ${({ $result }) =>
      $result === "win" ? "rgba(102, 187, 106, 0.35)" : "rgba(239, 83, 80, 0.35)"};
    background: ${({ $result }) =>
      $result === "win" ? "rgba(76, 175, 80, 0.12)" : "rgba(244, 67, 54, 0.12)"};
  }
`;

export const LogoCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;

  .MuiAvatar-root {
    border-radius: 0;
  }
`;

export const MatchCenter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-width: 0;
`;

export const ScoreGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
`;

export const ScoreValue = styled.span<{ $tone: "win" | "lose" | "neutral" }>`
  min-width: 16px;
  text-align: center;
  font-size: 15px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  color: ${({ $tone }) => {
    if ($tone === "win") return "#66bb6a";
    if ($tone === "lose") return "#ef5350";
    return "rgba(255, 255, 255, 0.78)";
  }};
`;

export const VsLabel = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.35);
  text-transform: lowercase;
`;

export const OpponentName = styled.span`
  max-width: 100%;
  font-size: 11px;
  font-weight: 500;
  line-height: 1.2;
  color: rgba(255, 255, 255, 0.52);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const EmptyNote = styled.div`
  padding: 8px 4px 4px;
  font-size: 12px;
  line-height: 1.45;
  text-align: center;
  color: rgba(255, 255, 255, 0.45);
`;

export const LogoRing = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;

  .MuiAvatar-root {
    border-radius: 0;
  }

  ${media.down("md")} {
    width: 24px;
    height: 24px;
  }
`;
