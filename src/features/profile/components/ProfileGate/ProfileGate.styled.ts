import styled from "styled-components";
import { media } from "@/shared/styles/breakpoints";

export const GateRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 480px;
  width: 100%;
  margin: 0 auto;
  padding: 8px 0 24px;

  ${media.down("sm")} {
    gap: 14px;
    padding: 4px 0 16px;
  }
`;

export const GateCard = styled.div`
  padding: 22px 20px;
  border-radius: 16px;
  background: linear-gradient(
    145deg,
    rgba(42, 42, 42, 0.98) 0%,
    rgba(26, 26, 26, 0.99) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.28);

  ${media.down("sm")} {
    padding: 16px 14px;
    border-radius: 14px;
  }
`;

export const GateTitle = styled.h1`
  margin: 0 0 6px;
  font-size: 22px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.95);
`;

export const GateSubtitle = styled.p`
  margin: 0 0 18px;
  font-size: 14px;
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.5);
`;

export const ProfileList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ProfileListItem = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  color: inherit;
  transition:
    border-color 0.18s ease,
    background-color 0.18s ease;

  &:hover {
    border-color: rgba(76, 175, 80, 0.35);
    background: rgba(76, 175, 80, 0.08);
  }

  &:focus-visible {
    outline: 2px solid #66bb6a;
    outline-offset: 2px;
  }
`;

export const ProfileListName = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
`;

export const ProfileListMeta = styled.span`
  font-size: 13px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: #81c784;
  white-space: nowrap;
`;

export const CreateRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const CreateButton = styled.button`
  padding: 11px 18px;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  color: #1b2e1b;
  background: linear-gradient(145deg, #81c784 0%, #66bb6a 100%);
  box-shadow: 0 4px 14px rgba(76, 175, 80, 0.3);
  transition:
    transform 0.18s ease,
    opacity 0.18s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
    transform: none;
  }
`;

export const EmptyHint = styled.p`
  margin: 0 0 14px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.45);
`;
