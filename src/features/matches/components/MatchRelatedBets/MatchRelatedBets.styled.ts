import styled from "styled-components";
import type { BetStatus } from "@/entities/bet";

const betStatusStyles: Record<BetStatus, { color: string; bg: string; border: string }> = {
  WAIT: {
    color: "#ffcc80",
    bg: "rgba(255, 167, 38, 0.1)",
    border: "rgba(255, 167, 38, 0.28)",
  },
  WIN: {
    color: "#a5d6a7",
    bg: "rgba(76, 175, 80, 0.12)",
    border: "rgba(76, 175, 80, 0.32)",
  },
  LOSE: {
    color: "#ef9a9a",
    bg: "rgba(239, 83, 80, 0.1)",
    border: "rgba(239, 83, 80, 0.28)",
  },
};

export const RelatedList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const RelatedItem = styled.li<{ $own?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  padding: 6px 8px;
  border-radius: 8px;
  background: ${({ $own }) =>
    $own ? "rgba(76, 175, 80, 0.06)" : "rgba(0, 0, 0, 0.18)"};
  border: 1px solid
    ${({ $own }) => ($own ? "rgba(76, 175, 80, 0.18)" : "rgba(255, 255, 255, 0.06)")};
`;

export const BetProfile = styled.div<{ $own?: boolean }>`
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ $own }) => ($own ? "rgba(165, 214, 167, 0.9)" : "rgba(255, 255, 255, 0.38)")};
`;

export const BetStatusChip = styled.span<{ $status: BetStatus }>`
  flex-shrink: 0;
  padding: 2px 6px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.03em;
  color: ${({ $status }) => betStatusStyles[$status].color};
  background: ${({ $status }) => betStatusStyles[$status].bg};
  border: 1px solid ${({ $status }) => betStatusStyles[$status].border};
`;

export const BetInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const BetMarket = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.82);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const BetMeta = styled.div`
  margin-top: 1px;
  font-size: 11px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.42);
  font-variant-numeric: tabular-nums;
`;

export const EditBetButton = styled.button`
  flex-shrink: 0;
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: transparent;
  font-family: inherit;
  font-size: 11px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.55);
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    color: #a5d6a7;
    border-color: rgba(76, 175, 80, 0.35);
    background: rgba(76, 175, 80, 0.08);
  }
`;
