import styled from "styled-components";
import { media } from "@/shared/styles/breakpoints";

export const ProfileHeaderRoot = styled.div`
  display: flex;
  justify-content: flex-end;
  max-width: 100%;

  ${media.down("md")} {
    display: none;
  }

  ${media.down("md")} {
    justify-content: center;
    width: 100%;
  }
`;

export const ProfileCard = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: 100%;
  padding: 6px 8px 6px 6px;
  border-radius: 12px;
  background: linear-gradient(
    145deg,
    rgba(42, 42, 42, 0.96) 0%,
    rgba(24, 24, 24, 0.98) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.22);

  ${media.down("xs")} {
    gap: 8px;
    padding: 5px 6px 5px 5px;
    width: 100%;
    max-width: 360px;
  }
`;

export const ProfileAvatar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: 0.02em;
  color: #142414;
  background: linear-gradient(135deg, #a5d6a7 0%, #66bb6a 100%);
  box-shadow: 0 2px 10px rgba(76, 175, 80, 0.28);
  border: 1px solid rgba(255, 255, 255, 0.14);

  ${media.down("xs")} {
    width: 32px;
    height: 32px;
    font-size: 13px;
    border-radius: 8px;
  }
`;

export const ProfileIdentity = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1px;
  min-width: 0;
  flex: 1;
`;

export const ProfileNameButton = styled.button`
  display: block;
  width: 100%;
  padding: 0;
  border: none;
  border-radius: 0;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.2;
  font-family: inherit;
  color: rgba(255, 255, 255, 0.94);
  background: transparent;
  cursor: pointer;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.18s ease;

  &:hover {
    color: #a5d6a7;
  }

  &:focus-visible {
    outline: 2px solid #66bb6a;
    outline-offset: 2px;
    border-radius: 4px;
  }

  ${media.down("xs")} {
    font-size: 13px;
  }
`;

export const ProfileHint = styled.span`
  font-size: 9px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.32);
`;

export const ProfileMetrics = styled.div`
  display: flex;
  align-items: stretch;
  gap: 4px;
  flex-shrink: 0;
`;

export const ProfileMetricTile = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  min-width: 56px;
  padding: 4px 8px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
`;

export const ProfileMetricLabel = styled.span`
  font-size: 8px;
  font-weight: 600;
  line-height: 1;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: rgba(255, 255, 255, 0.36);
  margin-bottom: 2px;
`;

export const ProfileBalance = styled.span<{ $positive: boolean }>`
  font-size: 12px;
  font-weight: 800;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  color: ${({ $positive }) => ($positive ? "#81c784" : "#e57373")};
`;

export const ProfileWinRate = styled.span<{ $color?: string }>`
  font-size: 12px;
  font-weight: 800;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  color: ${({ $color }) => $color ?? "rgba(255, 255, 255, 0.88)"};
`;
