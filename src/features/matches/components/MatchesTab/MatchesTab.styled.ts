import styled from "styled-components";
import { media } from "@/shared/styles/breakpoints";

export const TabRoot = styled.section`
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 0;
`;

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

export const ToolbarTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
`;

export const AddButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 16px;
  border: none;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  color: #1b2e1b;
  background: linear-gradient(145deg, #81c784 0%, #66bb6a 100%);
  box-shadow: 0 2px 12px rgba(76, 175, 80, 0.3);
  transition: transform 0.18s ease;

  &:hover {
    transform: translateY(-1px);
  }
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

export const FutureSectionRoot = styled.details`
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(0, 0, 0, 0.18);
  overflow: hidden;
`;

export const FutureSectionSummary = styled.summary`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 12px;
  list-style: none;
  cursor: pointer;
  user-select: none;

  &::-webkit-details-marker {
    display: none;
  }

  ${FutureSectionRoot}[open] & {
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }
`;

export const FutureSectionHeading = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.45);
`;

export const FutureSectionCount = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: rgba(165, 214, 167, 0.85);
`;

export const FutureSectionChevron = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.4);
  transition: transform 0.2s ease;

  ${FutureSectionRoot}[open] & {
    transform: rotate(180deg);
  }

  svg {
    font-size: 20px;
  }
`;

export const FutureSectionBody = styled.div`
  padding: 10px 12px 12px;
`;

export const MatchList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
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

  ${media.down("sm")} {
    padding: 24px 16px;
  }
`;
