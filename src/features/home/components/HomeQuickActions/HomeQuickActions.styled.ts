import styled, { css } from "styled-components";
import { media } from "@/shared/styles/breakpoints";
import {
  MOBILE_FAB_GAP,
  MOBILE_FAB_SIZE_PRIMARY,
  MOBILE_FAB_SIZE_SECONDARY,
  mobileQuickActionsBottomInset,
} from "@/shared/styles/mobileLayout";

export const ActionsRoot = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  width: 100%;

  ${media.down("md")} {
    position: fixed;
    left: auto;
    right: max(12px, env(safe-area-inset-right, 0px));
    bottom: ${mobileQuickActionsBottomInset};
    z-index: 1190;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: ${MOBILE_FAB_GAP};
    width: auto;
    padding: 0;
  }
`;

export const ActionButton = styled.button<{ $primary?: boolean }>`
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

  ${media.down("md")} {
    width: ${({ $primary }) => ($primary ? MOBILE_FAB_SIZE_PRIMARY : MOBILE_FAB_SIZE_SECONDARY)};
    height: ${({ $primary }) => ($primary ? MOBILE_FAB_SIZE_PRIMARY : MOBILE_FAB_SIZE_SECONDARY)};
    padding: 0;
    border-radius: 50%;

    ${({ $primary }) =>
      $primary
        ? css`
            border-color: rgba(129, 199, 132, 0.55);
            background: linear-gradient(
              145deg,
              rgba(76, 175, 80, 0.92) 0%,
              rgba(46, 125, 50, 0.96) 100%
            );
            box-shadow:
              0 8px 28px rgba(76, 175, 80, 0.38),
              inset 0 1px 0 rgba(255, 255, 255, 0.2);

            svg {
              color: #e8f5e9;
            }
          `
        : css`
            border-color: rgba(255, 255, 255, 0.14);
            background: linear-gradient(
              145deg,
              rgba(48, 48, 48, 0.96) 0%,
              rgba(28, 28, 28, 0.98) 100%
            );
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.32);
          `}
  }

  ${media.down("xs")} {
    font-size: 11px;
  }

  &:hover {
    ${media.up("sm")} {
      transform: translateY(-2px);
      border-color: rgba(102, 187, 106, 0.5);
      box-shadow:
        0 6px 20px rgba(76, 175, 80, 0.12),
        0 2px 12px rgba(0, 0, 0, 0.24);
    }
  }

  &:active {
    ${media.down("md")} {
      transform: scale(0.94);
    }

    ${media.up("sm")} {
      transform: translateY(0);
    }
  }

  &:focus-visible {
    outline: 2px solid #66bb6a;
    outline-offset: 2px;
  }

  svg {
    flex-shrink: 0;
    font-size: 20px;
    color: #a5d6a7;

    ${media.down("md")} {
      font-size: ${({ $primary }) => ($primary ? "28px" : "24px")};
    }
  }
`;

export const ActionButtonLabel = styled.span`
  ${media.down("md")} {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
`;
