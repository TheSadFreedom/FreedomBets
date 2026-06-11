import styled, { css } from "styled-components";
export const ChartCard = styled.div<{ $embedded?: boolean }>`
  ${({ $embedded }) =>
    $embedded
      ? css`
          padding: 0;
          border: none;
          background: transparent;
          border-radius: 0;
        `
      : css`
          padding: 14px 14px 10px;
          border-radius: 12px;
          background: rgba(0, 0, 0, 0.22);
          border: 1px solid rgba(255, 255, 255, 0.07);

        `}
`;

export const ChartInner = styled.div`
  padding: 12px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.06);
`;

export const ChartHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
  flex-wrap: wrap;
`;

export const ChartTitle = styled.div`
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.38);
`;

export const ChartCurrent = styled.div<{ $positive: boolean }>`
  font-size: 18px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
  color: ${({ $positive }) => ($positive ? "#81c784" : "#e57373")};
`;

export const ChartSvgWrap = styled.div`
  width: 100%;
  height: 200px;


  svg {
    display: block;
    width: 100%;
    height: 100%;
    overflow: visible;
  }
`;

export const ChartFooter = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-top: 8px;
  font-size: 10px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.34);
  font-variant-numeric: tabular-nums;
`;

export const ChartEmpty = styled.p`
  margin: 0;
  padding: 32px 12px;
  text-align: center;
  font-size: 13px;
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.4);
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.16);
  border: 1px dashed rgba(255, 255, 255, 0.08);
`;

export const ChartTooltip = styled.div`
  margin-top: 8px;
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.62);
  font-variant-numeric: tabular-nums;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  width: fit-content;
`;
