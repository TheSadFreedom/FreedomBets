import styled, { css } from "styled-components";
import type { Bet } from "@/entities/bet";
import { media } from "@/shared/styles/breakpoints";

export const BetsHistoryStyled = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0;
  min-width: 0;
`;

export const HistoryCard = styled.div`
  background: linear-gradient(
    145deg,
    rgba(42, 42, 42, 0.98) 0%,
    rgba(26, 26, 26, 0.99) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.22);
  overflow: hidden;
`;

export const FiltersPanel = styled.div`
  padding: 14px 16px;
  background: rgba(0, 0, 0, 0.18);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);

  ${media.down("sm")} {
    padding: 12px;
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

  ${media.up("sm")} {
    display: flex;
    flex-wrap: wrap;
  }
`;

export const TableScroll = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  padding: 12px 14px 14px;

  ${media.down("sm")} {
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
