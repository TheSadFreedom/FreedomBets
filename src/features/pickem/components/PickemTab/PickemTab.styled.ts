import { Accordion } from "@mui/material";
import styled, { css, keyframes } from "styled-components";
const shimmer = keyframes`
  0% { background-position: 200% center; }
  100% { background-position: -200% center; }
`;

export const TabRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;

`;

export const PickemHeroCard = styled.div`
  position: relative;
  overflow: hidden;
  padding: 18px 20px;
  border-radius: 16px;
  background:
    radial-gradient(circle at 100% 0%, rgba(255, 213, 79, 0.2) 0%, transparent 44%),
    radial-gradient(circle at 0% 100%, rgba(156, 39, 176, 0.14) 0%, transparent 42%),
    linear-gradient(145deg, rgba(42, 42, 42, 0.98) 0%, rgba(22, 22, 22, 0.99) 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.28);

`;

export const HeroGlow = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    105deg,
    transparent 30%,
    rgba(255, 255, 255, 0.03) 50%,
    transparent 70%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 8s linear infinite;
`;

export const HeroContent = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;

`;

export const HeroLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
`;

export const HeroIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(255, 213, 79, 0.26) 0%, rgba(255, 179, 0, 0.1) 100%);
  border: 1px solid rgba(255, 213, 79, 0.34);
  color: #ffd54f;
  flex-shrink: 0;
`;

export const HeroText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

export const HeroTitle = styled.h2`
  margin: 0;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 0.01em;
  color: rgba(255, 255, 255, 0.95);

`;

export const HeroHint = styled.span`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.45);

`;

export const PickemSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
`;

export const PickemSectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 0 2px;
`;

export const PickemSectionTitle = styled.h3`
  margin: 0;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.42);
`;

export const PickemSectionCount = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.38);
  font-variant-numeric: tabular-nums;
`;

export const PickemMajorsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const AddButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 14px;
  border: 1px solid rgba(255, 213, 79, 0.38);
  border-radius: 10px;
  background: rgba(255, 213, 79, 0.12);
  color: #ffe082;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition:
    background 0.18s ease,
    border-color 0.18s ease,
    transform 0.15s ease;
  flex-shrink: 0;

  &:hover:not(:disabled) {
    background: rgba(255, 213, 79, 0.2);
    border-color: rgba(255, 213, 79, 0.55);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

`;

export const PickemAccordion = styled(Accordion)<{ $complete?: boolean }>`
  position: relative;
  overflow: hidden !important;
  border-radius: 14px !important;
  background: linear-gradient(
    145deg,
    rgba(44, 50, 44, 0.72) 0%,
    rgba(30, 32, 30, 0.96) 42%,
    rgba(22, 22, 22, 0.99) 100%
  ) !important;
  border: 1px solid rgba(255, 255, 255, 0.09) !important;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.24) !important;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    z-index: 1;
    pointer-events: none;
    background: ${({ $complete }) =>
      $complete
        ? "linear-gradient(90deg, transparent, rgba(255, 213, 79, 0.85) 35%, rgba(255, 213, 79, 0.85) 65%, transparent)"
        : "linear-gradient(90deg, transparent, rgba(156, 39, 176, 0.55) 35%, rgba(156, 39, 176, 0.55) 65%, transparent)"};
  }

  &::before {
    display: none;
  }

  &:hover {
    border-color: rgba(255, 213, 79, 0.22) !important;
  }

  &.Mui-expanded {
    margin: 0 !important;
    border-color: rgba(255, 213, 79, 0.32) !important;
    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.32) !important;
  }

  .MuiAccordionSummary-root {
    align-items: center;
    min-height: 52px;
    padding: 8px 10px 8px 14px;
  }

  .MuiAccordionSummary-content {
    margin: 8px 0 !important;
    align-items: center;
  }

  .MuiAccordionDetails-root {
    padding: 4px 14px 14px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

`;

export const PickemCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-width: 0;

`;

export const EventLogoWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;

  border-radius: 12px;
  background: rgba(0, 0, 0, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;

  .MuiAvatar-root {
    border-radius: 0;
  }
`;

export const PickemCardTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  flex: 1;
`;

export const PickemOrg = styled.span`
  flex-shrink: 0;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: rgba(129, 199, 132, 0.8);
  line-height: 1.2;
  white-space: nowrap;

`;

export const PickemName = styled.span`
  min-width: 0;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.25;
  color: rgba(255, 255, 255, 0.92);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

`;

export const PickemHeaderMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;

`;

export const PickemProgressTrack = styled.div`
  width: 56px;
  height: 4px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;

`;

export const PickemProgressFill = styled.div<{ $value: number; $complete?: boolean }>`
  height: 100%;
  width: ${({ $value }) => `${Math.max(0, Math.min(100, $value * 100))}%`};
  border-radius: inherit;
  background: ${({ $complete }) =>
    $complete
      ? "linear-gradient(90deg, #ffd54f 0%, #ffb300 100%)"
      : "linear-gradient(90deg, #ba68c8 0%, #9c27b0 100%)"};
  transition: width 0.35s ease;
`;

export const PickemStagesBadge = styled.span<{ $complete?: boolean }>`
  display: inline-flex;
  align-items: center;
  min-height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.03em;
  white-space: nowrap;

  ${({ $complete }) =>
    $complete
      ? css`
          color: #ffe082;
          background: rgba(255, 213, 79, 0.14);
          border: 1px solid rgba(255, 213, 79, 0.32);
        `
      : css`
          color: rgba(255, 255, 255, 0.68);
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
        `}
`;

export const PickemStatusBadge = PickemStagesBadge;

export const PickemUploadError = styled.p`
  margin: 0;
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 12px;
  line-height: 1.4;
  color: #ef9a9a;
  background: rgba(239, 83, 80, 0.1);
  border: 1px solid rgba(239, 83, 80, 0.22);
`;

export const DeleteMajorButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  padding: 0;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: rgba(255, 255, 255, 0.32);
  cursor: pointer;
  opacity: 0;
  transition: all 0.18s ease;

  ${PickemAccordion}:hover &,
  ${PickemAccordion}:focus-within &,
  ${PickemAccordion}.Mui-expanded & {
    opacity: 1;
  }

  @media (hover: none) {
    opacity: 1;
  }

  &:hover {
    color: #ef9a9a;
    background: rgba(239, 83, 80, 0.12);
  }
`;

export const StageCountPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 14px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.08);
`;

export const StageCountTitle = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
`;

export const StageCountHint = styled.span`
  font-size: 12px;
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.42);
`;

export const StageCountGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;

  @media (min-width: 560px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

export const StageCountButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-height: 72px;
  padding: 10px 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.72);
  cursor: pointer;
  transition:
    border-color 0.18s ease,
    background 0.18s ease,
    transform 0.15s ease;

  strong {
    font-size: 22px;
    font-weight: 800;
    line-height: 1;
    color: #ffe082;
    font-variant-numeric: tabular-nums;
  }

  span {
    font-size: 10px;
    line-height: 1.3;
    text-align: center;
    color: rgba(255, 255, 255, 0.45);
  }

  &:hover:not(:disabled) {
    border-color: rgba(255, 213, 79, 0.42);
    background: rgba(255, 213, 79, 0.08);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.55;
    cursor: wait;
  }
`;

export const StagesGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const StageCard = styled.div<{ $hasImage?: boolean; $accent?: string }>`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.18);
  border: 1px solid
    ${({ $hasImage, $accent }) =>
      $hasImage ? "rgba(76, 175, 80, 0.28)" : ($accent ?? "rgba(255, 255, 255, 0.1)")};
  box-shadow: inset 3px 0 0 ${({ $accent }) => $accent ?? "transparent"};
`;

export const StageCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-width: 0;
`;

export const StageLabel = styled.span`
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: rgba(255, 255, 255, 0.88);
`;

export const PickemImagePanel = styled.div<{ $hasImage?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);
  transition:
    border-color 0.18s ease,
    background 0.18s ease;

  ${({ $hasImage }) =>
    $hasImage &&
    css`
      background: rgba(76, 175, 80, 0.05);
      border-color: rgba(76, 175, 80, 0.18);
    `}

  &:hover {
    background: rgba(255, 255, 255, 0.04);
  }
`;

export const StageCardStatus = styled.span<{ $uploaded?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: ${({ $uploaded }) => ($uploaded ? "#a5d6a7" : "rgba(255, 255, 255, 0.34)")};

  &::before {
    content: "";
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${({ $uploaded }) => ($uploaded ? "#66bb6a" : "rgba(255, 255, 255, 0.22)")};
    box-shadow: ${({ $uploaded }) => ($uploaded ? "0 0 8px rgba(102, 187, 106, 0.65)" : "none")};
  }
`;

export const StageCardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
`;

export const StageUploadButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  aspect-ratio: 16 / 9;
  padding: 12px 10px;
  border: 1px dashed rgba(255, 255, 255, 0.16);
  border-radius: 10px;
  background:
    radial-gradient(circle at 50% 0%, rgba(156, 39, 176, 0.08) 0%, transparent 55%),
    rgba(0, 0, 0, 0.22);
  color: rgba(255, 255, 255, 0.62);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition:
    border-color 0.18s ease,
    background 0.18s ease,
    color 0.18s ease;

  &:hover:not(:disabled) {
    border-color: rgba(255, 213, 79, 0.42);
    background: rgba(255, 213, 79, 0.06);
    color: #ffe082;
  }

  &:disabled {
    opacity: 0.55;
    cursor: wait;
  }

`;

export const StageImageButton = styled.button`
  display: block;
  width: 100%;
  padding: 0;
  border: none;
  border-radius: 10px;
  background: transparent;
  cursor: zoom-in;
  position: relative;
  overflow: hidden;

  &::after {
    content: "Развернуть";
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.55);
    color: #fff;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.03em;
    opacity: 0;
    transition: opacity 0.18s ease;
  }

  &:hover::after,
  &:focus-visible::after {
    opacity: 1;
  }
`;

export const StageImage = styled.img`
  width: 100%;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: block;
  aspect-ratio: 16 / 9;
  object-fit: contain;
  background: rgba(0, 0, 0, 0.28);
`;

export const StageActions = styled.div`
  display: flex;
  justify-content: flex-end;

`;

export const ReplaceImageButton = styled.button`
  padding: 5px 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.55);
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;


  &:hover:not(:disabled) {
    color: rgba(255, 255, 255, 0.88);
    border-color: rgba(255, 213, 79, 0.35);
    background: rgba(255, 213, 79, 0.08);
  }

  &:disabled {
    opacity: 0.55;
    cursor: wait;
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin: 0;
  padding: 36px 20px;
  text-align: center;
  font-size: 14px;
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.48);
  border-radius: 14px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px dashed rgba(255, 255, 255, 0.1);
`;

export const EmptyStateHint = styled.span`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.32);
`;
