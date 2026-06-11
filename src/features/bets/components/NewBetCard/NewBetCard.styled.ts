import styled from "styled-components";
export const NewBetCardRoot = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  gap: 18px;
  width: 100%;
  padding: 20px 22px;


  text-align: left;
  cursor: pointer;
  overflow: hidden;
  border: 1px solid rgba(76, 175, 80, 0.28);
  border-radius: 16px;
  background: linear-gradient(
    125deg,
    rgba(56, 72, 56, 0.55) 0%,
    rgba(34, 40, 34, 0.92) 38%,
    rgba(28, 28, 28, 0.98) 100%
  );
  box-shadow:
    0 2px 16px rgba(0, 0, 0, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.07);
  font-family: inherit;
  color: inherit;
  transition:
    transform 0.22s ease,
    border-color 0.22s ease,
    box-shadow 0.22s ease;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(
      ellipse 80% 120% at 0% 50%,
      rgba(76, 175, 80, 0.14) 0%,
      transparent 55%
    );
    pointer-events: none;
    opacity: 0.85;
    transition: opacity 0.22s ease;
  }

  &::after {
    content: "";
    position: absolute;
    top: -40%;
    right: -8%;
    width: 42%;
    height: 180%;
    background: linear-gradient(
      105deg,
      transparent 0%,
      rgba(76, 175, 80, 0.06) 45%,
      rgba(255, 255, 255, 0.03) 100%
    );
    pointer-events: none;
    transform: rotate(-8deg);
  }

  &:hover {
    transform: translateY(-3px);
    border-color: rgba(102, 187, 106, 0.55);
    box-shadow:
      0 10px 32px rgba(76, 175, 80, 0.14),
      0 4px 20px rgba(0, 0, 0, 0.32),
      inset 0 1px 0 rgba(255, 255, 255, 0.09);

    &::before {
      opacity: 1;
    }
  }

  &:active {
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 2px solid #66bb6a;
    outline-offset: 3px;
  }
`;

export const IconWrap = styled.div`
  position: relative;
  z-index: 1;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: linear-gradient(
    145deg,
    rgba(102, 187, 106, 0.35) 0%,
    rgba(76, 175, 80, 0.2) 100%
  );
  border: 1px solid rgba(129, 199, 132, 0.35);
  box-shadow: 0 4px 14px rgba(76, 175, 80, 0.2);

  svg {
    font-size: 28px;
    color: #a5d6a7;
  }

`;

export const Content = styled.div`
  position: relative;
  z-index: 1;
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Title = styled.span`
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 0.01em;
  color: rgba(255, 255, 255, 0.95);

`;

export const Subtitle = styled.span`
  font-size: 13px;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.55);
`;

export const TagsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
`;

export const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: rgba(165, 214, 167, 0.95);
  background: rgba(76, 175, 80, 0.12);
  border: 1px solid rgba(76, 175, 80, 0.22);
`;

export const ActionWrap = styled.div`
  position: relative;
  z-index: 1;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;

  border-radius: 12px;
  background: rgba(76, 175, 80, 0.15);
  border: 1px solid rgba(76, 175, 80, 0.3);
  transition: background 0.2s ease;

  ${NewBetCardRoot}:hover & {
    background: rgba(76, 175, 80, 0.28);
  }

  svg {
    font-size: 22px;
    color: #81c784;
  }
`;

export const PendingNote = styled.span`
  position: relative;
  z-index: 1;
  flex-shrink: 0;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: #ffcc80;
  background: rgba(255, 167, 38, 0.12);
  border: 1px solid rgba(255, 167, 38, 0.28);

`;
