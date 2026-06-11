import { css } from "styled-components";

export const mobileCardSurface = css`
  background: linear-gradient(
    145deg,
    rgba(42, 42, 42, 0.98) 0%,
    rgba(26, 26, 26, 0.99) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.22);
`;

export const mobileCardSurfaceRaised = css`
  ${mobileCardSurface};
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
`;

export const mobileEmptyState = css`
  margin: 0;
  padding: 32px 20px;
  text-align: center;
  font-size: 14px;
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.5);
  border-radius: 14px;
  background:
    radial-gradient(circle at 50% 0%, rgba(76, 175, 80, 0.08) 0%, transparent 55%),
    rgba(255, 255, 255, 0.02);
  border: 1px dashed rgba(255, 255, 255, 0.1);
`;
