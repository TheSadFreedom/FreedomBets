import styled from "styled-components";

export const ChartCard = styled.div`
  padding: 14px 14px 10px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.07);
`;

export const ChartHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
  flex-wrap: wrap;
`;

export const ChartTitle = styled.div`
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.45);
`;

export const ChartCurrent = styled.div<{ $positive: boolean }>`
  font-size: 20px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: ${({ $positive }) => ($positive ? "#66bb6a" : "#ef5350")};
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
  margin-top: 6px;
  font-size: 10px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.35);
  font-variant-numeric: tabular-nums;
`;

export const ChartEmpty = styled.p`
  margin: 0;
  padding: 28px 8px;
  text-align: center;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.42);
`;

export const ChartTooltip = styled.div`
  margin-top: 8px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  font-variant-numeric: tabular-nums;
`;
