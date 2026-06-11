import styled from "styled-components";
export const MedalsBlock = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 16px;
  background:
    radial-gradient(circle at 100% 0%, rgba(255, 193, 7, 0.12) 0%, transparent 40%),
    linear-gradient(145deg, rgba(42, 42, 42, 0.98) 0%, rgba(26, 26, 26, 0.99) 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.22);

`;

export const MedalsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;

`;

export const MedalsTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`;

export const MedalsIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: rgba(255, 193, 7, 0.14);
  border: 1px solid rgba(255, 193, 7, 0.28);
  color: #ffd54f;
  flex-shrink: 0;
`;

export const MedalsTitle = styled.h3`
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
`;

export const MedalsSubtitle = styled.span`
  display: block;
  margin-top: 1px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
`;

export const UploadMedalButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 12px;
  border: 1px solid rgba(255, 193, 7, 0.35);
  border-radius: 10px;
  background: rgba(255, 193, 7, 0.1);
  color: #ffe082;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.18s ease, border-color 0.18s ease;

  &:hover:not(:disabled) {
    background: rgba(255, 193, 7, 0.18);
    border-color: rgba(255, 193, 7, 0.5);
  }

  &:disabled {
    opacity: 0.55;
    cursor: wait;
  }

`;

const SLOT_SIZE = 84;

export const MedalsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

`;

export const MedalTile = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${SLOT_SIZE}px;
  height: ${SLOT_SIZE}px;
  flex-shrink: 0;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.22);
  border: 1px solid rgba(255, 193, 7, 0.16);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
  transition:
    border-color 0.18s ease,
    transform 0.15s ease;

  &:hover {
    border-color: rgba(255, 193, 7, 0.35);
    transform: translateY(-2px);
  }
`;

export const MedalLabel = styled.span`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 4px;
  padding: 0 4px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: rgba(255, 255, 255, 0.95);
  text-align: center;
  line-height: 1.2;
  text-shadow:
    0 1px 2px rgba(0, 0, 0, 0.95),
    0 0 8px rgba(0, 0, 0, 0.85);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease;
`;

export const MedalImageButton = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 8px;
  border: none;
  border-radius: 11px;
  background: transparent;
  cursor: zoom-in;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
    filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.35));
  }

  &:hover ${MedalLabel},
  &:focus-visible ${MedalLabel} {
    opacity: 1;
  }
`;

export const UserMedalTile = styled(MedalTile)``;

export const DeleteMedalButton = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  z-index: 1;
  width: 22px;
  height: 22px;
  padding: 0;
  border: none;
  border-radius: 6px;
  background: rgba(239, 83, 80, 0.9);
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.15s ease;

  ${UserMedalTile}:hover &,
  ${UserMedalTile}:focus-within & {
    opacity: 1;
  }

`;

export const MedalsHint = styled.p`
  margin: 0;
  padding: 10px 12px;
  font-size: 12px;
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.42);
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.16);
  border: 1px dashed rgba(255, 255, 255, 0.08);
`;
