import styled from "styled-components";

export const ScrollToTopFab = styled.button<{ $visible: boolean }>`
  position: fixed;
  right: max(16px, env(safe-area-inset-right));
  bottom: max(16px, env(safe-area-inset-bottom, 0px));
  z-index: 1090;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 1px solid rgba(102, 187, 106, 0.35);
  border-radius: 50%;
  background: linear-gradient(
    145deg,
    rgba(48, 58, 48, 0.92) 0%,
    rgba(22, 26, 22, 0.98) 100%
  );
  box-shadow:
    0 4px 18px rgba(0, 0, 0, 0.32),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
  color: #a5d6a7;
  cursor: pointer;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  pointer-events: ${({ $visible }) => ($visible ? "auto" : "none")};
  transform: translateY(${({ $visible }) => ($visible ? "0" : "8px")});
  transition:
    opacity 0.2s ease,
    transform 0.2s ease,
    border-color 0.18s ease,
    box-shadow 0.18s ease;

  &:hover {
    border-color: rgba(129, 199, 132, 0.55);
    box-shadow:
      0 6px 22px rgba(76, 175, 80, 0.16),
      0 4px 18px rgba(0, 0, 0, 0.32);
    color: #c8e6c9;
  }

  &:active {
    transform: translateY(1px);
  }

  &:focus-visible {
    outline: 2px solid #66bb6a;
    outline-offset: 2px;
  }

  svg {
    font-size: 24px;
  }
`;
