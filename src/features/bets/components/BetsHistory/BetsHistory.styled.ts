import styled, { css } from "styled-components";
import type { Bet } from "@/entities/bet";
import { media } from "@/shared/styles/breakpoints";
import { mobileCardSurface } from "@/shared/styles/mobileTokens";

export const BetsHistoryStyled = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0;
  min-width: 0;
`;

export const HistoryCard = styled.div`
  ${mobileCardSurface};
  border-radius: 14px;
  overflow: hidden;

  ${media.down("md")} {
    background: transparent;
    border: none;
    box-shadow: none;
    border-radius: 0;
    overflow: visible;
  }
`;

export const FiltersPanel = styled.div`
  padding: 10px 12px;
  background: rgba(0, 0, 0, 0.18);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);

  ${media.down("md")} {
    padding: 12px;
    margin-bottom: 4px;
    border-radius: 14px;
    ${mobileCardSurface};
    border-bottom: none;
    background: linear-gradient(145deg, rgba(36, 36, 36, 0.98) 0%, rgba(22, 22, 22, 0.99) 100%);
  }
`;

export const FiltersWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
`;

export const BetList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 10px 12px 12px;

  ${media.down("md")} {
    padding: 2px 0 6px;
  }
`;

const statusAccent: Record<Bet["status"], string> = {
  WIN: "rgba(129, 199, 132, 0.55)",
  LOSE: "rgba(239, 154, 154, 0.5)",
  WAIT: "rgba(255, 183, 77, 0.5)",
};

export const BetCard = styled.article<{ $status: Bet["status"] }>`
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 10px;
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
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease;

  &::before {
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
      ${({ $status }) => statusAccent[$status]} 35%,
      ${({ $status }) => statusAccent[$status]} 65%,
      transparent 100%
    );
  }

  &:hover {
    border-color: rgba(255, 255, 255, 0.14);
    box-shadow:
      0 6px 22px rgba(0, 0, 0, 0.32),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);
  }
`;

export const BetCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 7px 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  min-width: 0;
`;

export const BetCardHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  flex: 1;
`;

export const BetCardHeaderEvent = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const BetCardHeaderTitle = styled.span`
  font-size: 12px;
  font-weight: 700;
  line-height: 1.25;
  color: rgba(255, 255, 255, 0.92);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const BetCardHeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;

  ${media.down("sm")} {
    flex-wrap: wrap;
    justify-content: flex-end;
    max-width: 48%;
  }
`;

export const BetCardDate = styled.span`
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;

  ${media.down("sm")} {
    font-size: 11px;
  }
`;

export const BetCardBody = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(80px, 0.7fr) minmax(88px, 0.8fr);
  gap: 8px 12px;
  align-items: center;
  padding: 8px 10px;

  ${media.down("sm")} {
    grid-template-columns: 1fr auto;
    grid-template-rows: auto auto;
    gap: 8px 10px;
  }
`;

export const BetCardLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;

  ${media.down("sm")} {
    grid-column: 1 / -1;
  }
`;

export const BetCardTeamRow = styled.div`
  display: flex;
  align-items: center;
  min-width: 0;
`;

export const BetCardCenter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-start;
  justify-content: center;

  ${media.down("sm")} {
    grid-column: 1;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px 14px;
  }
`;

export const BetCardCenterRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

export const BetCardCenterLabel = styled.span`
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.42);
`;

export const BetCardCenterValue = styled.span<{ $multiline?: boolean }>`
  font-size: ${({ $multiline }) => ($multiline ? "12px" : "14px")};
  font-weight: ${({ $multiline }) => ($multiline ? 600 : 700)};
  font-variant-numeric: ${({ $multiline }) => ($multiline ? "normal" : "tabular-nums")};
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.3;
  ${({ $multiline }) =>
    $multiline
      ? css`
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          word-break: break-word;
        `
      : ""}
`;

export const BetCardResult = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  gap: 5px;

  ${media.down("sm")} {
    grid-column: 2;
    grid-row: 2;
    align-self: center;
  }
`;

export const BetCardResultPayout = styled.span<{ $status: Bet["status"] }>`
  font-size: 14px;
  font-weight: 800;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;

  ${({ $status }) => {
    switch ($status) {
      case "WIN":
        return css`color: #81c784;`;
      case "LOSE":
        return css`color: #e57373;`;
      case "WAIT":
        return css`color: rgba(255, 255, 255, 0.88);`;
    }
  }}
`;

export const StatusBadge = styled.span<{ $status: Bet["status"] }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 56px;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.04em;
  line-height: 1.2;

  ${({ $status }) => {
    switch ($status) {
      case "WIN":
        return css`
          color: #a5d6a7;
          background: rgba(102, 187, 106, 0.18);
          border: 1px solid rgba(102, 187, 106, 0.35);
        `;
      case "LOSE":
        return css`
          color: #ef9a9a;
          background: rgba(239, 83, 80, 0.15);
          border: 1px solid rgba(239, 83, 80, 0.35);
        `;
      case "WAIT":
        return css`
          color: #ffcc80;
          background: rgba(255, 167, 38, 0.15);
          border: 1px solid rgba(255, 167, 38, 0.35);
        `;
    }
  }}
`;

export const BetCardActions = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

export const EmptyState = styled.div`
  margin: 16px;
  padding: 32px 20px;
  text-align: center;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px dashed rgba(255, 255, 255, 0.1);
`;
