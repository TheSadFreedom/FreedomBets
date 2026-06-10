import styled, { css } from "styled-components";
import type { EventTier } from "@/entities/event";

export const TierLabel = styled.div`
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.55);
`;

export const TierChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const chipActive = css`
  color: #c8e6c9;
  background: rgba(76, 175, 80, 0.22);
  border-color: rgba(102, 187, 106, 0.55);
  box-shadow: 0 2px 12px rgba(76, 175, 80, 0.15);
`;

export const TierChip = styled.button<{ $tier?: EventTier; $active?: boolean }>`
  padding: 8px 14px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.55);
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition:
    color 0.18s ease,
    background 0.18s ease,
    border-color 0.18s ease,
    box-shadow 0.18s ease;

  &:hover {
    color: rgba(255, 255, 255, 0.85);
    border-color: rgba(102, 187, 106, 0.35);
    background: rgba(76, 175, 80, 0.1);
  }

  ${({ $active }) => $active && chipActive}

  &:focus-visible {
    outline: 2px solid #66bb6a;
    outline-offset: 2px;
  }
`;
