import styled from "styled-components";
import { media } from "@/shared/styles/breakpoints";

export const BetDescriptionStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
  max-width: 220px;

  ${media.down("sm")} {
    max-width: none;
    gap: 4px;
  }
`;

export const BetDescriptionMarket = styled.span`
  font-size: 12px;
  font-weight: 600;
  line-height: 1.3;
  color: rgba(255, 255, 255, 0.55);
  word-break: break-word;

  ${media.down("sm")} {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    color: rgba(255, 255, 255, 0.42);
  }
`;

export const BetDescriptionTeam = styled.span`
  font-size: 13px;
  font-weight: 600;
  line-height: 1.35;
  color: rgba(255, 255, 255, 0.92);
  word-break: break-word;

  ${media.down("sm")} {
    font-size: 14px;
    font-weight: 700;
  }
`;
