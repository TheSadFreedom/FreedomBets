import styled, { css } from "styled-components";
import type { BetMarket, MatchFormat } from "@/entities/bet";
import { media } from "@/shared/styles/breakpoints";

export const dialogPaperSx = {
  p: 0,
  m: 2,
  borderRadius: "18px",
  background:
    "linear-gradient(160deg, rgba(44, 52, 44, 0.98) 0%, rgba(28, 30, 28, 0.99) 42%, rgba(22, 22, 22, 1) 100%)",
  border: "1px solid rgba(76, 175, 80, 0.22)",
  boxShadow: "0 24px 64px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.04) inset",
  overflow: "hidden",
  maxHeight: "92dvh",
} as const;

export const dialogPaperMobileSx = {
  m: 0,
  borderRadius: 0,
  maxHeight: "100dvh",
  height: "100dvh",
} as const;

export const dialogBackdropSx = {
  backdropFilter: "blur(6px)",
  backgroundColor: "rgba(0, 0, 0, 0.65)",
} as const;

export const fieldSx = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: "10px",
    transition: "border-color 0.2s ease, background-color 0.2s ease",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.06)",
    },
    "&.Mui-focused": {
      backgroundColor: "rgba(76, 175, 80, 0.06)",
    },
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#81c784",
  },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(102, 187, 106, 0.6)",
  },
} as const;

export const DialogShell = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
  max-height: inherit;
`;

export const DialogHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 22px 24px 18px;

  ${media.down("md")} {
    padding: 16px 14px 14px;
    gap: 10px;
  }
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  background: linear-gradient(
    180deg,
    rgba(76, 175, 80, 0.1) 0%,
    rgba(76, 175, 80, 0.02) 100%
  );
`;

export const HeaderIcon = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: linear-gradient(
    145deg,
    rgba(102, 187, 106, 0.32) 0%,
    rgba(76, 175, 80, 0.18) 100%
  );
  border: 1px solid rgba(129, 199, 132, 0.35);

  svg {
    font-size: 26px;
    color: #a5d6a7;
  }
`;

export const HeaderText = styled.div`
  flex: 1;
  min-width: 0;
  padding-top: 2px;
`;

export const HeaderTitle = styled.h2`
  margin: 0 0 4px;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.01em;
  color: rgba(255, 255, 255, 0.96);
`;

export const HeaderSubtitle = styled.p`
  margin: 0;
  font-size: 13px;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.5);
`;

export const DialogBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px 24px 8px;
  overflow-y: auto;
  flex: 1;
  min-height: 0;

  ${media.down("md")} {
    padding: 14px 12px 8px;
    gap: 12px;
  }
`;

export const PreviewCard = styled.div`
  padding: 14px 16px;
  border-radius: 12px;
  background: linear-gradient(
    135deg,
    rgba(76, 175, 80, 0.14) 0%,
    rgba(76, 175, 80, 0.05) 100%
  );
  border: 1px solid rgba(76, 175, 80, 0.28);
`;

export const PreviewLabel = styled.span`
  display: block;
  margin-bottom: 6px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgba(165, 214, 167, 0.75);
`;

export const PreviewText = styled.p`
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.92);
  word-break: break-word;
`;

export const PreviewMeta = styled.span`
  display: block;
  margin-top: 8px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.45);

  strong {
    color: #81c784;
    font-weight: 600;
  }
`;

export const Section = styled.section`
  padding: 14px 16px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.06);
`;

export const SectionTitle = styled.h3`
  margin: 0 0 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgba(255, 255, 255, 0.42);
`;

export const FieldsStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const FieldsGrid = styled.div<{ $twoCol?: boolean }>`
  display: grid;
  grid-template-columns: ${({ $twoCol }) => ($twoCol ? "1fr 1fr" : "1fr")};
  gap: 12px;

  ${media.down("md")} {
    grid-template-columns: 1fr;
  }
`;

export const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const chipActive = css`
  color: #c8e6c9;
  background: rgba(76, 175, 80, 0.22);
  border-color: rgba(102, 187, 106, 0.55);
  box-shadow: 0 2px 12px rgba(76, 175, 80, 0.15);
`;

export const ChoiceChip = styled.button<{ $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.55);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition:
    color 0.18s ease,
    background 0.18s ease,
    border-color 0.18s ease,
    box-shadow 0.18s ease;

  svg {
    font-size: 18px;
    opacity: 0.85;
  }

  &:hover {
    color: rgba(255, 255, 255, 0.85);
    border-color: rgba(255, 255, 255, 0.18);
    background: rgba(255, 255, 255, 0.07);
  }

  ${({ $active }) => $active && chipActive}

  &:focus-visible {
    outline: 2px solid #66bb6a;
    outline-offset: 2px;
  }
`;

export const FormatChip = styled(ChoiceChip)<{ $format: MatchFormat }>`
  min-width: 52px;
  justify-content: center;
  font-weight: 700;
`;

export const MarketChip = styled(ChoiceChip)<{ $market: BetMarket }>``;

export const AmountPresetChip = styled(ChoiceChip)`
  min-width: 48px;
  justify-content: center;
  padding: 6px 10px;
  font-size: 12px;
`;

export const TeamPickRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;

  ${media.down("md")} {
    gap: 8px;
  }
`;

export const TeamPickButton = styled.button<{ $active?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 0;
  padding: 14px 12px;
  text-align: center;
  border-radius: 10px;
  font-family: inherit;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.7);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.18s ease;

  ${media.down("md")} {
    gap: 6px;
    padding: 12px 8px;
    border-radius: 12px;
  }

  &:hover {
    border-color: rgba(255, 255, 255, 0.15);
    background: rgba(255, 255, 255, 0.06);
  }

  ${({ $active }) =>
    $active &&
    css`
      color: #c8e6c9;
      background: rgba(76, 175, 80, 0.12);
      border-color: rgba(102, 187, 106, 0.45);
      box-shadow: inset 0 0 0 1px rgba(76, 175, 80, 0.15);
    `}

  &:focus-visible {
    outline: 2px solid #66bb6a;
    outline-offset: 2px;
  }
`;

export const TeamPickLogoWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  flex-shrink: 0;

  ${media.down("md")} {
    width: 40px;
    height: 40px;
  }
`;

export const TeamPickPlaceholder = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 13px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.35);
  background: rgba(255, 255, 255, 0.05);
  border: 1px dashed rgba(255, 255, 255, 0.14);
`;

export const TeamPickName = styled.span`
  width: 100%;
  min-width: 0;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.3;
  word-break: break-word;

  ${media.down("md")} {
    font-size: 12px;
    line-height: 1.25;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

export const SectionHint = styled.p`
  margin: 10px 0 0;
  font-size: 12px;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.4);
`;

export const DialogFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 24px max(22px, env(safe-area-inset-bottom));
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(0, 0, 0, 0.2);
  flex-shrink: 0;

  ${media.down("md")} {
    flex-direction: column-reverse;
    align-items: stretch;
    padding: 12px 12px max(16px, env(safe-area-inset-bottom));

    button {
      width: 100%;
      justify-content: center;
    }
  }
`;

export const FooterButtonSecondary = styled.button`
  padding: 10px 18px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.65);
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.12);
  transition: all 0.18s ease;

  &:hover:not(:disabled) {
    color: rgba(255, 255, 255, 0.9);
    border-color: rgba(255, 255, 255, 0.22);
    background: rgba(255, 255, 255, 0.05);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

export const FooterButtonPrimary = styled.button`
  padding: 10px 22px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  color: #1b2e1b;
  background: linear-gradient(145deg, #81c784 0%, #66bb6a 50%, #4caf50 100%);
  border: none;
  box-shadow: 0 4px 16px rgba(76, 175, 80, 0.35);
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    opacity 0.18s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(76, 175, 80, 0.45);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;
