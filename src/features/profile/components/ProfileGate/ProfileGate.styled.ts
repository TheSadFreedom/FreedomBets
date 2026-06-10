import styled from "styled-components";
import { media } from "@/shared/styles/breakpoints";

export const GateRoot = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 12px 0 28px;

  ${media.down("sm")} {
    padding: 8px 0 20px;
  }
`;

export const GateCard = styled.div`
  width: 100%;
  max-width: 440px;
  border-radius: 14px;
  overflow: hidden;
  background: linear-gradient(
    145deg,
    rgba(42, 42, 42, 0.98) 0%,
    rgba(22, 22, 22, 0.99) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.28);
`;

export const GateHero = styled.div`
  padding: 22px 20px 18px;
  background:
    radial-gradient(circle at 100% 0%, rgba(129, 199, 132, 0.16) 0%, transparent 48%),
    linear-gradient(180deg, rgba(76, 175, 80, 0.1) 0%, rgba(0, 0, 0, 0.12) 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);

  ${media.down("sm")} {
    padding: 18px 16px 14px;
  }
`;

export const GateTitle = styled.h1`
  margin: 0 0 6px;
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: rgba(255, 255, 255, 0.96);
`;

export const GateSubtitle = styled.p`
  margin: 0;
  font-size: 13px;
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.48);
`;

export const GateBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 18px 20px 20px;

  ${media.down("sm")} {
    padding: 14px 16px 16px;
    gap: 14px;
  }
`;

export const GateSectionTitle = styled.h2`
  margin: 0 0 10px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgba(255, 255, 255, 0.38);
`;

export const ProfileList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ProfileListItem = styled.button`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.07);
  background: rgba(255, 255, 255, 0.03);
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  color: inherit;
  transition:
    border-color 0.18s ease,
    background-color 0.18s ease,
    transform 0.15s ease;

  &:hover {
    border-color: rgba(76, 175, 80, 0.35);
    background: rgba(76, 175, 80, 0.08);
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 2px solid #66bb6a;
    outline-offset: 2px;
  }
`;

export const ProfileAvatar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 800;
  line-height: 1;
  color: #142414;
  background: linear-gradient(135deg, #a5d6a7 0%, #66bb6a 100%);
  box-shadow: 0 2px 10px rgba(76, 175, 80, 0.22);
  flex-shrink: 0;
`;

export const ProfileListInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
  min-width: 0;
`;

export const ProfileListName = styled.span`
  font-size: 15px;
  font-weight: 700;
  line-height: 1.2;
  color: rgba(255, 255, 255, 0.94);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ProfileListMeta = styled.span`
  font-size: 11px;
  font-weight: 500;
  line-height: 1.2;
  color: rgba(255, 255, 255, 0.4);
  font-variant-numeric: tabular-nums;
`;

export const ProfileListBalance = styled.span<{ $positive: boolean }>`
  font-size: 14px;
  font-weight: 800;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  color: ${({ $positive }) => ($positive ? "#81c784" : "#e57373")};
`;

export const GateDivider = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.06);
`;

export const CreateRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const CreateButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 12px 18px;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  color: #142414;
  background: linear-gradient(145deg, #a5d6a7 0%, #66bb6a 100%);
  box-shadow: 0 4px 16px rgba(76, 175, 80, 0.28);
  transition:
    transform 0.18s ease,
    opacity 0.18s ease,
    box-shadow 0.18s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(76, 175, 80, 0.34);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
    transform: none;
  }
`;

export const EmptyHint = styled.p`
  margin: 0;
  padding: 14px 12px;
  border-radius: 10px;
  font-size: 13px;
  line-height: 1.4;
  text-align: center;
  color: rgba(255, 255, 255, 0.42);
  background: rgba(0, 0, 0, 0.18);
  border: 1px dashed rgba(255, 255, 255, 0.08);
`;
