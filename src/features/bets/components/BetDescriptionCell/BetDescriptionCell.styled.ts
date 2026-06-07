import styled from "styled-components";

export const BetDescriptionStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
  max-width: 220px;
`;

export const BetDescriptionMarket = styled.span`
  font-size: 12px;
  font-weight: 600;
  line-height: 1.3;
  color: rgba(255, 255, 255, 0.55);
  word-break: break-word;
`;

export const BetDescriptionTeam = styled.span`
  font-size: 13px;
  font-weight: 600;
  line-height: 1.35;
  color: rgba(255, 255, 255, 0.92);
  word-break: break-word;
`;
