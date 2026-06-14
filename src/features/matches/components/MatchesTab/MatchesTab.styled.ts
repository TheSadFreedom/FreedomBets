import styled from "styled-components";
export const TabRoot = styled.section`
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 0;
`;

export const MatchSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
`;

export const MatchSectionTitle = styled.h3`
  margin: 0;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.45);
`;

export const MatchList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const EmptyState = styled.p`
  margin: 0;
  padding: 32px 20px;
  text-align: center;
  font-size: 15px;
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.5);
  border-radius: 14px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px dashed rgba(255, 255, 255, 0.1);

`;
