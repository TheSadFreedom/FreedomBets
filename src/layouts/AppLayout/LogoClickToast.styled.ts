import styled, { keyframes } from "styled-components";
import { media } from "@/shared/styles/breakpoints";

const toastIn = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, -16px) scale(0.92);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0) scale(1);
  }
`;

const toastOut = keyframes`
  from {
    opacity: 1;
    transform: translate(-50%, 0) scale(1);
  }
  to {
    opacity: 0;
    transform: translate(-50%, -10px) scale(0.96);
  }
`;

const pulseGlow = keyframes`
  0%,
  100% {
    box-shadow:
      0 12px 40px rgba(239, 83, 80, 0.18),
      0 4px 16px rgba(0, 0, 0, 0.35),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
  }
  50% {
    box-shadow:
      0 14px 44px rgba(239, 83, 80, 0.28),
      0 4px 16px rgba(0, 0, 0, 0.35),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }
`;

const progressShrink = keyframes`
  from {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0);
  }
`;

export const LogoToastLayer = styled.div`
  position: fixed;
  top: calc(78px + env(safe-area-inset-top, 0px));
  left: 50%;
  transform: translateX(-50%);
  z-index: 1400;
  pointer-events: none;

  ${media.down("sm")} {
    top: calc(64px + env(safe-area-inset-top, 0px));
    width: min(92vw, 360px);
  }

  ${media.down("md")} {
    top: calc(118px + env(safe-area-inset-top, 0px));
  }
`;

export const LogoToastCard = styled.div<{ $closing?: boolean }>`
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: min(92vw, 380px);
  padding: 14px 14px 16px;
  border-radius: 16px;
  pointer-events: auto;
  overflow: hidden;
  background:
    radial-gradient(circle at 100% 0%, rgba(239, 83, 80, 0.2) 0%, transparent 48%),
    linear-gradient(145deg, rgba(48, 32, 32, 0.98) 0%, rgba(24, 22, 22, 0.99) 100%);
  border: 1px solid rgba(239, 83, 80, 0.38);
  animation: ${({ $closing }) => ($closing ? toastOut : toastIn)} 0.28s ease forwards,
    ${pulseGlow} 2.4s ease-in-out infinite;
  backdrop-filter: blur(10px);

  ${media.down("xs")} {
    gap: 10px;
    padding: 12px 12px 14px;
    border-radius: 14px;
  }
`;

export const LogoToastIconWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 12px;
  color: #ffcdd2;
  background: rgba(239, 83, 80, 0.16);
  border: 1px solid rgba(239, 83, 80, 0.28);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);

  svg {
    font-size: 22px;
  }
`;

export const LogoToastBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  flex: 1;
  padding-top: 2px;
`;

export const LogoToastLabel = styled.span`
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #ef9a9a;
`;

export const LogoToastMessage = styled.p`
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.35;
  color: rgba(255, 255, 255, 0.94);
  word-break: break-word;
`;

export const LogoToastClose = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  margin: 0;
  padding: 0;
  flex-shrink: 0;
  border: none;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.55);
  cursor: pointer;
  transition:
    background 0.15s ease,
    color 0.15s ease;

  &:hover {
    background: rgba(239, 83, 80, 0.18);
    color: #ffcdd2;
  }

  &:focus-visible {
    outline: 2px solid #ef9a9a;
    outline-offset: 2px;
  }

  svg {
    font-size: 18px;
  }
`;

export const LogoToastProgress = styled.div<{ $durationMs: number }>`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 3px;
  transform-origin: left center;
  background: linear-gradient(90deg, #ef5350 0%, #ff8a80 100%);
  animation: ${progressShrink} ${({ $durationMs }) => `${$durationMs}ms`} linear forwards;
`;
