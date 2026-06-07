import styled from "styled-components";
import { media } from "@/shared/styles/breakpoints";

export const ProfileHeaderRoot = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  max-width: 100%;

  ${media.down("md")} {
    justify-content: center;
    gap: 10px;
  }

  ${media.down("xs")} {
    gap: 6px 8px;
    justify-content: center;
    width: 100%;
  }
`;

export const ProfileItem = styled.div`
  display: flex;
  align-items: center;
  white-space: nowrap;
`;

export const ProfileNameButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 4px;
  margin: -2px -4px;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 600;
  font-family: inherit;
  color: rgba(255, 255, 255, 0.92);
  background: transparent;
  cursor: pointer;
  max-width: min(42vw, 200px);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition:
    color 0.18s ease,
    background-color 0.18s ease;

  &:hover {
    color: #a5d6a7;
    background: rgba(76, 175, 80, 0.1);
  }

  &:focus-visible {
    outline: 2px solid #66bb6a;
    outline-offset: 2px;
  }

  ${media.down("xs")} {
    font-size: 14px;
    max-width: min(52vw, 180px);
  }
`;

export const ProfileBalance = styled.span<{ $positive: boolean }>`
  font-size: 15px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: ${({ $positive }) => ($positive ? "#81c784" : "#e57373")};

  ${media.down("xs")} {
    font-size: 14px;
  }
`;

export const ProfileWinRate = styled.span`
  font-size: 15px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: rgba(255, 255, 255, 0.85);
  min-width: 2.5ch;
  text-align: right;

  ${media.down("xs")} {
    font-size: 14px;
  }
`;

export const ProfileDivider = styled.span`
  width: 1px;
  height: 22px;
  background: rgba(255, 255, 255, 0.12);
  flex-shrink: 0;

  ${media.down("xs")} {
    display: none;
  }
`;

export const ProfileStatsRow = styled.div`
  display: contents;

  ${media.down("xs")} {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    flex-basis: 100%;
  }
`;

