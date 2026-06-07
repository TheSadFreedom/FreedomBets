import styled from "styled-components";

export const BetsTableWrap = styled.div`
  width: 100%;
  overflow-x: auto;
  border-radius: 8px;

  .MuiTable-root {
    background: transparent;
  }

  .MuiTableHead-root .MuiTableCell-root {
    background: rgba(255, 255, 255, 0.04);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .MuiTableBody-root .MuiTableRow-root:hover {
    background: rgba(76, 175, 80, 0.06);
  }
`;
