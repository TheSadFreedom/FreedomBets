import styled from "styled-components";
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
} as const;

export const dialogBackdropSx = {
  backdropFilter: "blur(6px)",
  backgroundColor: "rgba(0, 0, 0, 0.65)",
} as const;

export const fieldSx = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: "10px",
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
`;

export const DialogHeader = styled.div`
  padding: 20px 22px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  background: linear-gradient(
    180deg,
    rgba(76, 175, 80, 0.1) 0%,
    rgba(76, 175, 80, 0.02) 100%
  );
`;

export const DialogTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.95);
`;

export const DialogSubtitle = styled.p`
  margin: 4px 0 0;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
`;

export const DialogBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px 22px;

  ${media.down("sm")} {
    padding: 14px 12px;
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

export const BalanceValue = styled.div<{ $positive: boolean }>`
  margin-bottom: 12px;
  font-size: 22px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: ${({ $positive }) => ($positive ? "#81c784" : "#e57373")};
`;

export const ActionRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const ActionButton = styled.button<{ $variant?: "primary" | "danger" | "ghost" }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 14px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.18s ease;

  ${({ $variant }) => {
    if ($variant === "primary") {
      return `
        color: #1b2e1b;
        background: linear-gradient(145deg, #81c784 0%, #66bb6a 100%);
        border: none;
        box-shadow: 0 2px 10px rgba(76, 175, 80, 0.3);
      `;
    }
    if ($variant === "danger") {
      return `
        color: #ffcdd2;
        background: rgba(239, 83, 80, 0.12);
        border: 1px solid rgba(239, 83, 80, 0.35);
      `;
    }
    return `
      color: rgba(255, 255, 255, 0.8);
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.12);
    `;
  }}

  &:hover:not(:disabled) {
    filter: brightness(1.06);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

export const NameRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const DeleteHint = styled.p`
  margin: 0 0 10px;
  font-size: 12px;
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.45);
`;

export const DeleteConfirmBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  border-radius: 10px;
  background: rgba(239, 83, 80, 0.08);
  border: 1px solid rgba(239, 83, 80, 0.25);
`;

export const DialogFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 14px 22px max(20px, env(safe-area-inset-bottom));
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(0, 0, 0, 0.2);

  ${media.down("sm")} {
    padding: 12px 12px max(16px, env(safe-area-inset-bottom));
  }
`;

export const CloseButton = styled.button`
  padding: 9px 18px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.7);
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.12);
  transition: all 0.18s ease;

  &:hover {
    color: rgba(255, 255, 255, 0.95);
    border-color: rgba(255, 255, 255, 0.22);
    background: rgba(255, 255, 255, 0.05);
  }
`;
