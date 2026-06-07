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
