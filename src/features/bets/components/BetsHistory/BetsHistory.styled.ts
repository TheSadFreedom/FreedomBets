import styled, { css } from "styled-components";
import type { Bet } from "@/entities/bet";
import { media } from "@/shared/styles/breakpoints";
import { mobileCardSurface, mobileCardSurfaceRaised } from "@/shared/styles/mobileTokens";

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
  padding: 14px 16px;
  background: rgba(0, 0, 0, 0.18);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);

  ${media.down("md")} {
    padding: 12px;
    margin-bottom: 4px;
    border-radius: 14px;
    ${mobileCardSurface};
    border-bottom: none;
    background:
      linear-gradient(145deg, rgba(36, 36, 36, 0.98) 0%, rgba(22, 22, 22, 0.99) 100%);
  }
`;

export const FiltersHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
  flex-wrap: wrap;
`;

export const FiltersTitle = styled.h3`
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.01em;
`;

export const FiltersWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;

  ${media.up("md")} {
    display: flex;
    flex-wrap: wrap;
  }
`;

export const TableScroll = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  padding: 12px 14px 14px;

  ${media.down("md")} {
    padding: 10px 8px 12px;
  }

  .MuiTable-root {
    background: transparent;
  }

  .MuiTableHead-root .MuiTableCell-root {
    background: rgba(255, 255, 255, 0.05);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: rgba(255, 255, 255, 0.5);
    white-space: nowrap;
  }

  .MuiTableBody-root .MuiTableRow-root {
    transition: background 0.15s ease;

    &:nth-of-type(even) {
      background: rgba(255, 255, 255, 0.02);
    }

    &:hover {
      background: rgba(76, 175, 80, 0.07) !important;
    }
  }

  .MuiTableBody-root .MuiTableCell-root {
    vertical-align: middle;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  .MuiTableBody-root .MuiTableRow-root:last-child .MuiTableCell-root {
    border-bottom: none;
  }
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

export const CellContent = styled.div<{ $align?: "left" | "center" | "right" }>`
  display: flex;
  align-items: center;
  justify-content: ${({ $align = "left" }) =>
    $align === "center" ? "center" : $align === "right" ? "flex-end" : "flex-start"};
  min-width: 0;
  width: 100%;
`;

export const CellLogoWrap = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 45px;
`;

export const DateStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const FormatBadge = styled.span`
  display: inline-block;
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.03em;
  color: rgba(255, 255, 255, 0.65);
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  width: fit-content;
`;

export const StatusBadge = styled.span<{ $status: Bet["status"] }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 88px;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.2;

  ${media.down("md")} {
    min-width: 0;
    padding: 4px 8px;
    font-size: 11px;
    border-radius: 999px;
  }

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

export const PayoutValue = styled.span<{ $status: Bet["status"] }>`
  font-weight: 600;
  font-size: 13px;

  ${({ $status }) => {
    switch ($status) {
      case "WIN":
        return css`
          color: #81c784;
        `;
      case "LOSE":
        return css`
          color: #e57373;
        `;
      case "WAIT":
        return css`
          color: #ffb74d;
        `;
    }
  }}
`;

export const AmountValue = styled.span`
  font-weight: 600;
  font-variant-numeric: tabular-nums;
`;

export const OddsValue = styled.span`
  font-variant-numeric: tabular-nums;
  opacity: 0.9;
`;

export const filterControlSx = {
  width: { xs: "100%", sm: "auto" },
  minWidth: { xs: 0, sm: 120 },
  flex: { xs: "1 1 100%", sm: "1 1 140px" },
  "& .MuiOutlinedInput-root": {
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: "10px",
  },
};

export const FilterOptionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  max-width: 320px;
  width: 100%;
`;

export const filterSelectMenuProps = {
  PaperProps: {
    sx: { maxWidth: 400, mt: 0.5 },
  },
} as const;

export const MobileBetList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 2px 0 6px;
`;

const mobileBetStatusAccent = {
  WIN: "rgba(129, 199, 132, 0.55)",
  LOSE: "rgba(239, 154, 154, 0.5)",
  WAIT: "rgba(255, 183, 77, 0.5)",
} as const;

export const MobileBetCard = styled.article<{ $status: Bet["status"] }>`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0;
  overflow: hidden;
  border-radius: 12px;
  ${mobileCardSurfaceRaised};

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      ${({ $status }) => mobileBetStatusAccent[$status]} 40%,
      ${({ $status }) => mobileBetStatusAccent[$status]} 60%,
      transparent 100%
    );
  }
`;

export const MobileBetTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 10px 6px;
`;

export const MobileBetTopRight = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
`;

export const MobileBetDate = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.45);
  font-variant-numeric: tabular-nums;
`;

export const MobileBetPayout = styled.span<{ $status: Bet["status"] }>`
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
        return css`color: #ffb74d;`;
    }
  }}
`;

export const MobileBetBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 0 10px 8px;
`;

export const MobileBetEventStrip = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
`;

export const MobileBetEventText = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const MobileBetEventOrg = styled.span`
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: rgba(129, 199, 132, 0.8);
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const MobileBetEventName = styled.span`
  font-size: 12px;
  font-weight: 600;
  line-height: 1.25;
  color: rgba(255, 255, 255, 0.88);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const MobileBetStageWrap = styled.div`
  margin-top: 2px;
`;

export const MobileBetTeams = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.25;
  color: rgba(255, 255, 255, 0.82);
`;

export const MobileBetVs = styled.span`
  font-size: 10px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.3);
  padding: 0 2px;
`;

export const MobileBetPick = styled.div`
  padding: 6px 8px;
  border-radius: 8px;
  background: rgba(76, 175, 80, 0.06);
  border: 1px solid rgba(129, 199, 132, 0.14);
`;

export const MobileBetMeta = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.42);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
`;

export const MobileBetFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 6px 10px 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
`;

export const MobileBetActions = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-shrink: 0;
`;
