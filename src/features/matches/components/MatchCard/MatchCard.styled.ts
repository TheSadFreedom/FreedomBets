import styled, { css } from "styled-components";
import type { MatchStatus } from "@/entities/match";
import { media } from "@/shared/styles/breakpoints";

const statusAccent: Record<MatchStatus, string> = {
  scheduled: "rgba(255, 167, 38, 0.85)",
  finished: "rgba(255, 255, 255, 0.22)",
};

const statusGlow: Record<MatchStatus, string> = {
  scheduled: "rgba(255, 167, 38, 0.08)",
  finished: "rgba(76, 175, 80, 0.06)",
};

export const CardRoot = styled.details<{ $status: MatchStatus }>`
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.09);
  background: linear-gradient(
    145deg,
    rgba(44, 50, 44, 0.72) 0%,
    rgba(30, 32, 30, 0.96) 42%,
    rgba(22, 22, 22, 0.99) 100%
  );
  box-shadow:
    0 1px 10px rgba(0, 0, 0, 0.24),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(
      ellipse 90% 80% at 50% -20%,
      ${({ $status }) => statusGlow[$status]} 0%,
      transparent 60%
    );
    pointer-events: none;
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      ${({ $status }) => statusAccent[$status]} 35%,
      ${({ $status }) => statusAccent[$status]} 65%,
      transparent 100%
    );
  }

  &:hover {
    border-color: rgba(76, 175, 80, 0.28);
    box-shadow:
      0 4px 16px rgba(0, 0, 0, 0.28),
      0 0 0 1px rgba(76, 175, 80, 0.08);
    transform: translateY(-1px);
  }
`;

export const CardSummary = styled.summary`
  list-style: none;
  cursor: pointer;
  user-select: none;

  &::-webkit-details-marker {
    display: none;
  }
`;

export const CardInner = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 11px 12px 6px;
`;

export const ExpandRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 6px 12px 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.45);
  transition: color 0.15s ease;

  ${CardRoot}[open] > ${CardSummary} & {
    color: rgba(165, 214, 167, 0.75);
  }

  ${CardRoot}:hover & {
    color: rgba(255, 255, 255, 0.58);
  }
`;

export const ExpandChevron = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.4);
  transition: transform 0.2s ease;

  ${CardRoot}[open] & {
    transform: rotate(180deg);
  }

  svg {
    font-size: 20px;
  }
`;

export const ExpandedBody = styled.div`
  padding: 0 12px 11px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const BetActionsRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  min-width: 0;
`;

export const EventLogoWrap = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;

  .MuiAvatar-root {
    border-radius: 0;
  }
`;

export const CardHeaderText = styled.div`
  flex: 1;
  min-width: 0;
`;

export const EventOrg = styled.div`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: rgba(129, 199, 132, 0.8);
  line-height: 1.2;
`;

export const EventName = styled.div`
  margin-top: 2px;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.3;
  color: rgba(255, 255, 255, 0.9);
  word-break: break-word;
`;

export const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-top: 5px;
`;

export const MetaChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 12px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.48);

  svg {
    font-size: 13px;
    opacity: 0.65;
  }
`;

export const MetaDot = styled.span`
  color: rgba(255, 255, 255, 0.2);
  font-size: 11px;
`;

export const FormatBadge = styled.span`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.03em;
  color: rgba(165, 214, 167, 0.85);
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
`;

const statusStyles: Record<MatchStatus, ReturnType<typeof css>> = {
  scheduled: css`
    color: #ffcc80;
    background: rgba(255, 167, 38, 0.12);
    border: 1px solid rgba(255, 167, 38, 0.28);
  `,
  finished: css`
    color: rgba(255, 255, 255, 0.45);
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
  `,
};

export const StatusBadge = styled.span<{ $status: MatchStatus }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 7px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
  ${({ $status }) => statusStyles[$status]}
`;

export const CardIconButton = styled.button<{ $danger?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  padding: 0;
  border: none;
  border-radius: 7px;
  background: transparent;
  color: rgba(255, 255, 255, 0.28);
  cursor: pointer;
  opacity: 0;
  transition: all 0.18s ease;

  ${CardRoot}:hover &,
  ${CardRoot}:focus-within & {
    opacity: 1;
  }

  &:hover {
    color: ${({ $danger }) => ($danger ? "#ef9a9a" : "#a5d6a7")};
    background: ${({ $danger }) =>
      $danger ? "rgba(239, 83, 80, 0.12)" : "rgba(76, 175, 80, 0.12)"};
  }
`;

export const MatchupArena = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 6px;
  align-items: center;

  ${media.down("xs")} {
    grid-template-columns: 1fr;
    gap: 6px;
  }
`;

export const VsOrb = styled.div<{ $hasScore?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: ${({ $hasScore }) => ($hasScore ? "44px" : "24px")};
  height: ${({ $hasScore }) => ($hasScore ? "28px" : "24px")};
  padding: ${({ $hasScore }) => ($hasScore ? "0 8px" : "0")};
  border-radius: ${({ $hasScore }) => ($hasScore ? "8px" : "50%")};
  font-size: ${({ $hasScore }) => ($hasScore ? "13px" : "10px")};
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  letter-spacing: ${({ $hasScore }) => ($hasScore ? "0.06em" : "normal")};
  color: ${({ $hasScore }) => ($hasScore ? "rgba(255, 255, 255, 0.82)" : "rgba(255, 255, 255, 0.3)")};
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.08);

  ${media.down("xs")} {
    width: auto;
    height: auto;
    margin: -2px auto;
    padding: ${({ $hasScore }) => ($hasScore ? "4px 12px" : "2px 10px")};
    border-radius: 999px;
  }
`;

export const TeamSlot = styled.div<{ $leading?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  padding: 7px 9px;
  border-radius: 10px;
  color: rgba(255, 255, 255, 0.88);
  background: ${({ $leading }) =>
    $leading ? "rgba(76, 175, 80, 0.1)" : "rgba(255, 255, 255, 0.03)"};
  border: 1px solid
    ${({ $leading }) => ($leading ? "rgba(102, 187, 106, 0.35)" : "rgba(255, 255, 255, 0.09)")};
`;

export const TeamBetButton = styled.button<{ $leading?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-width: 0;
  padding: 7px 9px;
  border-radius: 10px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.88);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.09);
  transition:
    border-color 0.18s ease,
    background 0.18s ease,
    box-shadow 0.18s ease;

  &:hover {
    border-color: rgba(102, 187, 106, 0.4);
    background: rgba(76, 175, 80, 0.1);
    box-shadow: 0 2px 10px rgba(76, 175, 80, 0.1);
  }

  &:focus-visible {
    outline: 2px solid #66bb6a;
    outline-offset: 2px;
  }
`;

export const LogoRing = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;

  .MuiAvatar-root {
    border-radius: 0;
  }
`;

export const TeamName = styled.span`
  flex: 1;
  min-width: 0;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.25;
  word-break: break-word;
`;
