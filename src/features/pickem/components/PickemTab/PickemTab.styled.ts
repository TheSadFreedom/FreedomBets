import styled from "styled-components";
import { media } from "@/shared/styles/breakpoints";

export const TabRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  flex-wrap: wrap;
`;

export const AddButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border: 1px solid rgba(76, 175, 80, 0.35);
  border-radius: 10px;
  background: rgba(76, 175, 80, 0.12);
  color: #a5d6a7;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.18s ease, border-color 0.18s ease;

  &:hover {
    background: rgba(76, 175, 80, 0.2);
    border-color: rgba(76, 175, 80, 0.5);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

export const PickemCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 14px 16px;
  border-radius: 14px;
  background: linear-gradient(
    145deg,
    rgba(42, 42, 42, 0.98) 0%,
    rgba(26, 26, 26, 0.99) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.22);
`;

export const PickemCardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

export const PickemCardTitle = styled.div`
  flex: 1;
  min-width: 0;
`;

export const PickemOrg = styled.div`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: rgba(129, 199, 132, 0.8);
`;

export const PickemName = styled.div`
  margin-top: 2px;
  font-size: 15px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.92);
`;

export const DeleteMajorButton = styled.button`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid rgba(239, 83, 80, 0.28);
  border-radius: 8px;
  background: rgba(239, 83, 80, 0.08);
  color: #ef9a9a;
  cursor: pointer;

  &:hover {
    background: rgba(239, 83, 80, 0.16);
  }
`;

export const StagesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;

  ${media.up("sm")} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  ${media.up("lg")} {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

export const StageCard = styled.div<{ $hasImage?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid
    ${({ $hasImage }) => ($hasImage ? "rgba(76, 175, 80, 0.28)" : "rgba(255, 255, 255, 0.08)")};
`;

export const StageUploadButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 120px;
  padding: 16px 12px;
  border: 1px dashed rgba(255, 255, 255, 0.18);
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.18);
  color: rgba(255, 255, 255, 0.72);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.18s ease, background 0.18s ease;

  &:hover {
    border-color: rgba(76, 175, 80, 0.45);
    background: rgba(76, 175, 80, 0.08);
    color: #c8e6c9;
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
    background: rgba(0, 0, 0, 0.5);
    color: #fff;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.02em;
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
  max-height: 280px;
  object-fit: contain;
  background: rgba(0, 0, 0, 0.25);
`;

export const ReplaceImageButton = styled.button`
  align-self: flex-start;
  padding: 4px 10px;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.55);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    color: rgba(255, 255, 255, 0.85);
    background: rgba(255, 255, 255, 0.1);
  }
`;

export const EmptyState = styled.p`
  margin: 0;
  padding: 24px 16px;
  text-align: center;
  opacity: 0.55;
  font-size: 14px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px dashed rgba(255, 255, 255, 0.1);
`;
