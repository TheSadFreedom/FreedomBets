import styled from "styled-components";
import type { EventTier } from "@/entities/event";
import { eventTierStyles } from "@/features/events/lib/eventTier";

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

export const TierChip = styled.button<{ $tier: EventTier; $active?: boolean }>`
  padding: 7px 14px;
  border-radius: 999px;
  border: 1px solid
    ${({ $tier, $active }) =>
      $active ? eventTierStyles[$tier].border : "rgba(255, 255, 255, 0.12)"};
  background: ${({ $tier, $active }) =>
    $active ? eventTierStyles[$tier].bg : "rgba(255, 255, 255, 0.04)"};
  color: ${({ $tier, $active }) =>
    $active ? eventTierStyles[$tier].color : "rgba(255, 255, 255, 0.55)"};
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease;

  &:hover {
    border-color: ${({ $tier }) => eventTierStyles[$tier].border};
    color: ${({ $tier }) => eventTierStyles[$tier].color};
    background: ${({ $tier }) => eventTierStyles[$tier].bg};
  }
`;
