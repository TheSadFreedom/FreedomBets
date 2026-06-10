import styled, { css, keyframes } from "styled-components";
import { media } from "@/shared/styles/breakpoints";
import { mobileContentBottomInset } from "@/shared/styles/mobileLayout";

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const MobileNavSpacer = styled.div`
  display: none;
  flex-shrink: 0;

  ${media.down("md")} {
    display: block;
    height: ${mobileContentBottomInset};
  }
`;

export const MobileNavBar = styled.nav`
  display: none;

  ${media.down("md")} {
    display: block;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1200;
    padding: 8px 10px calc(8px + env(safe-area-inset-bottom, 0px));
    background: linear-gradient(
      180deg,
      rgba(24, 24, 24, 0.72) 0%,
      rgba(18, 18, 18, 0.96) 24%,
      rgba(14, 14, 14, 0.98) 100%
    );
    backdrop-filter: blur(14px);
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.38);
  }
`;

export const MobileNavInner = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 4px;
  max-width: 520px;
  margin: 0 auto;
  padding: 4px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
`;

export const MobileNavItem = styled.button<{ $active?: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  min-width: 0;
  min-height: 52px;
  padding: 6px 4px;

  ${media.down("xs")} {
    min-height: 48px;
    padding: 6px 2px;
    gap: 2px;
  }
  border: none;
  border-radius: 12px;
  font-family: inherit;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.48);
  background: transparent;
  transition:
    color 0.18s ease,
    background 0.18s ease,
    box-shadow 0.18s ease,
    transform 0.15s ease;

  ${({ $active }) =>
    $active &&
    css`
      color: rgba(255, 255, 255, 0.96);
      background: linear-gradient(
        135deg,
        rgba(76, 175, 80, 0.32) 0%,
        rgba(56, 142, 60, 0.16) 100%
      );
      box-shadow:
        0 4px 14px rgba(76, 175, 80, 0.16),
        inset 0 1px 0 rgba(255, 255, 255, 0.08);

      .mobile-nav-icon {
        color: #a5d6a7;
        transform: scale(1.06);
      }
    `}

  ${({ $active }) =>
    $active &&
    css`
      &::after {
        content: "";
        position: absolute;
        bottom: 5px;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: #81c784;
        box-shadow: 0 0 8px rgba(129, 199, 132, 0.65);
      }
    `}

  &:active {
    transform: scale(0.97);
  }

  &:focus-visible {
    outline: 2px solid rgba(129, 199, 132, 0.65);
    outline-offset: 2px;
  }
`;

export const MobileNavIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  line-height: 0;
  transition:
    color 0.18s ease,
    transform 0.18s ease;

  ${media.down("xs")} {
    width: 26px;
    height: 26px;
  }
`;

export const MobileNavLabel = styled.span`
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0.01em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;

  ${media.down("xs")} {
    font-size: 8px;
    letter-spacing: 0;
    max-width: 52px;
  }
`;

export const MobileNavProfileAvatar = styled.span<{ $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 800;
  line-height: 1;
  color: #142414;
  background: linear-gradient(135deg, #c8e6c9 0%, #66bb6a 100%);
  border: 2px solid
    ${({ $active }) => ($active ? "rgba(165, 214, 167, 0.95)" : "rgba(255, 255, 255, 0.14)")};
  box-shadow: ${({ $active }) =>
    $active ? "0 0 0 2px rgba(76, 175, 80, 0.35)" : "none"};
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease;
`;

export const MobileMoreBackdrop = styled.button`
  position: fixed;
  inset: 0;
  z-index: 1300;
  border: none;
  padding: 0;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(3px);
  cursor: pointer;
  animation: ${slideUp} 0.2s ease;
`;

export const MobileMoreHandle = styled.div`
  width: 36px;
  height: 4px;
  margin: 0 auto 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.22);
`;

export const MobileMoreSheet = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: ${mobileContentBottomInset};
  z-index: 1310;
  padding: 10px 14px 14px;
  border-radius: 20px 20px 16px 16px;
  background: linear-gradient(
    160deg,
    rgba(44, 44, 44, 0.98) 0%,
    rgba(22, 22, 22, 0.99) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.45);
  animation: ${slideUp} 0.22s ease;
`;

export const MobileMoreTitle = styled.h3`
  margin: 0 0 10px;
  padding: 0 4px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgba(255, 255, 255, 0.4);
`;

export const MobileMoreGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;

  ${media.down("xs")} {
    grid-template-columns: 1fr;
  }
`;

export const MobileMoreItem = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: 52px;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.07);
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.88);
  background: rgba(255, 255, 255, 0.03);
  transition:
    border-color 0.15s ease,
    background 0.15s ease,
    transform 0.15s ease;

  ${({ $active }) =>
    $active &&
    css`
      border-color: rgba(129, 199, 132, 0.38);
      background: rgba(76, 175, 80, 0.12);
    `}

  &:active {
    transform: scale(0.98);
  }

  &:focus-visible {
    outline: 2px solid rgba(129, 199, 132, 0.65);
    outline-offset: 2px;
  }
`;

export const MobileMoreItemIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  flex-shrink: 0;
  color: #a5d6a7;
  background: rgba(76, 175, 80, 0.14);
  border: 1px solid rgba(129, 199, 132, 0.22);
`;

export const MobileMoreItemLabel = styled.span`
  font-size: 13px;
  font-weight: 700;
  line-height: 1.2;
`;
