import styled from "styled-components";
import { media } from "@/shared/styles/breakpoints";

export const ActionsRoot = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  width: 100%;

  ${media.down("xs")} {
    gap: 8px;
  }
`;

export const ActionButton = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 0;
  padding: 14px 12px;
  border: 1px solid rgba(76, 175, 80, 0.28);
  border-radius: 14px;
  background: linear-gradient(
    145deg,
    rgba(48, 58, 48, 0.72) 0%,
    rgba(30, 32, 30, 0.96) 100%
  );
  box-shadow:
    0 2px 12px rgba(0, 0, 0, 0.22),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.92);
  cursor: pointer;
  transition:
    transform 0.18s ease,
    border-color 0.18s ease,
    box-shadow 0.18s ease;

  ${media.down("xs")} {
    flex-direction: column;
    gap: 6px;
    padding: 12px 8px;
    font-size: 11px;
  }

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(102, 187, 106, 0.5);
    box-shadow:
      0 6px 20px rgba(76, 175, 80, 0.12),
      0 2px 12px rgba(0, 0, 0, 0.24);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus-visible {
    outline: 2px solid #66bb6a;
    outline-offset: 2px;
  }

  svg {
    flex-shrink: 0;
    font-size: 20px;
    color: #a5d6a7;

    ${media.down("xs")} {
      font-size: 22px;
    }
  }
`;
