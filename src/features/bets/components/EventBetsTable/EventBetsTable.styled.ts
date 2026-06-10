import styled, { css } from "styled-components";
import type { Bet } from "@/entities/bet";
import { media } from "@/shared/styles/breakpoints";

export const BetsTableWrap = styled.div`
  width: 100%;
  overflow-x: auto;
  border-radius: 8px;

  .MuiTable-root {
    background: transparent;
  }

  .MuiTableCell-root {
    box-sizing: border-box;
  }

  .MuiTableHead-root .MuiTableCell-root {
    background: rgba(255, 255, 255, 0.04);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .MuiTableBody-root .MuiTableRow-root:hover {
    background: rgba(76, 175, 80, 0.06);
  }

  ${media.down("md")} {
    display: none;
  }
`;

export const EventBetsMobileList = styled.div`
  display: none;

  ${media.down("md")} {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
`;

const statusStyles: Record<Bet["status"], ReturnType<typeof css>> = {
  WAIT: css`
    border-color: rgba(255, 167, 38, 0.28);
    background: rgba(255, 167, 38, 0.06);
  `,
  WIN: css`
    border-color: rgba(102, 187, 106, 0.3);
    background: rgba(76, 175, 80, 0.06);
  `,
  LOSE: css`
    border-color: rgba(239, 83, 80, 0.28);
    background: rgba(239, 83, 80, 0.06);
  `,
};

export const EventBetMobileCard = styled.div<{ $status: Bet["status"] }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(0, 0, 0, 0.16);
  ${({ $status }) => statusStyles[$status]}
`;

export const EventBetMobileTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
`;

export const EventBetMobileDate = styled.div`
  font-size: 11px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.48);
  font-variant-numeric: tabular-nums;
`;

export const EventBetMobilePayout = styled.div<{ $status: Bet["status"] }>`
  font-size: 13px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  color: ${({ $status }) =>
    $status === "WIN" ? "#81c784" : $status === "LOSE" ? "#e57373" : "#ffcc80"};
`;

export const EventBetMobileTeams = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 6px;
`;

export const EventBetMobileVs = styled.span`
  font-size: 9px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.28);
  text-transform: uppercase;
`;

export const EventBetMobileTeam = styled.div<{ $align?: "left" | "right" }>`
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;

  ${({ $align }) =>
    $align === "right"
      ? css`
          flex-direction: row-reverse;
          justify-self: end;
        `
      : css`
          justify-self: start;
        `}
`;

export const EventBetMobileTeamName = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.82);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const EventBetMobileFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding-top: 6px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
`;

export const EventBetMobileType = styled.div`
  flex: 1;
  min-width: 0;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.62);
`;

export const EventBetMobileMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: rgba(255, 255, 255, 0.55);
  white-space: nowrap;
`;

export const EventBetMobileStatus = styled.span<{ $status: Bet["status"] }>`
  display: inline-flex;
  align-items: center;
  min-height: 20px;
  padding: 0 6px;
  border-radius: 999px;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.04em;

  ${({ $status }) => {
    switch ($status) {
      case "WIN":
        return css`
          color: #a5d6a7;
          background: rgba(102, 187, 106, 0.16);
        `;
      case "LOSE":
        return css`
          color: #ef9a9a;
          background: rgba(239, 83, 80, 0.14);
        `;
      case "WAIT":
        return css`
          color: #ffcc80;
          background: rgba(255, 167, 38, 0.14);
        `;
    }
  }}
`;
