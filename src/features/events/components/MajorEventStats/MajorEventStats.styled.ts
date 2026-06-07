import styled from "styled-components";

export const MajorStageBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 12px;

  &:not(:first-child) {
    margin-top: 12px;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }
`;

export const MajorStageHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

export const MajorStageTitle = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.55);
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;
