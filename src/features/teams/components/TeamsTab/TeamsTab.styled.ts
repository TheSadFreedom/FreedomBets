import styled from "styled-components";
import { media } from "@/shared/styles/breakpoints";

export const TabRoot = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0;
  min-width: 0;
`;

export const TeamsCard = styled.div`
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

export const Toolbar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 14px 16px;
  background: rgba(0, 0, 0, 0.18);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);

  ${media.down("sm")} {
    padding: 12px;
  }
`;

export const ToolbarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

export const ToolbarTitle = styled.h2`
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.01em;
`;

export const FiltersRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  width: 100%;
`;

export const filterControlSx = {
  width: { xs: "100%", sm: "auto" },
  minWidth: { xs: 0, sm: 160 },
  flex: { xs: "1 1 100%", sm: "1 1 180px" },
  "& .MuiOutlinedInput-root": {
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: "10px",
  },
};

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

export const CellContent = styled.div<{ $align?: "left" | "center" | "right" }>`
  display: flex;
  align-items: center;
  justify-content: ${({ $align = "left" }) =>
    $align === "center" ? "center" : $align === "right" ? "flex-end" : "flex-start"};
  min-width: 0;
  width: 100%;
`;

export const TeamCell = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
`;

export const TeamName = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
  word-break: break-word;
`;

export const BetsCount = styled.span`
  font-size: 14px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: rgba(255, 255, 255, 0.88);
`;

export const EmptyState = styled.p`
  margin: 16px;
  padding: 32px 20px;
  text-align: center;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px dashed rgba(255, 255, 255, 0.1);
`;

export const MobileTeamList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px 12px 14px;
`;

export const MobileTeamCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
`;

export const MobileTeamLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  flex: 1;
`;

export const MobileTeamCount = styled.span`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  color: #a5d6a7;
  background: rgba(76, 175, 80, 0.12);
  border: 1px solid rgba(76, 175, 80, 0.28);
`;
