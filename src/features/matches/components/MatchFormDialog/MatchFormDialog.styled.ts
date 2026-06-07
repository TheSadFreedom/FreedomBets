import styled from "styled-components";

export const dialogPaperSx = {
  p: 0,
  m: 2,
  borderRadius: "18px",
  background:
    "linear-gradient(160deg, rgba(44, 52, 44, 0.98) 0%, rgba(28, 30, 28, 0.99) 42%, rgba(22, 22, 22, 1) 100%)",
  border: "1px solid rgba(76, 175, 80, 0.22)",
  boxShadow: "0 24px 64px rgba(0, 0, 0, 0.55)",
  overflow: "hidden",
  maxHeight: "92dvh",
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
} as const;

export const DialogShell = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

export const DialogHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

export const DialogTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.92);
`;

export const DialogBody = styled.div`
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const DialogFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 12px 20px 18px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
`;

export const FooterButton = styled.button<{ $primary?: boolean }>`
  padding: 10px 18px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  border: 1px solid
    ${({ $primary }) => ($primary ? "transparent" : "rgba(255, 255, 255, 0.14)")};
  color: ${({ $primary }) => ($primary ? "#1b2e1b" : "rgba(255, 255, 255, 0.75)")};
  background: ${({ $primary }) =>
    $primary ? "linear-gradient(145deg, #81c784 0%, #66bb6a 100%)" : "transparent"};

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const FormatRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const ScoreSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ScoreLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.55);
`;

export const ScoreRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 10px;
  align-items: end;
`;

export const ScoreSeparator = styled.span`
  padding-bottom: 10px;
  font-size: 14px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.35);
`;

export const FormatChip = styled.button<{ $active?: boolean }>`
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  color: ${({ $active }) => ($active ? "#c8e6c9" : "rgba(255, 255, 255, 0.65)")};
  background: ${({ $active }) =>
    $active ? "rgba(76, 175, 80, 0.16)" : "rgba(255, 255, 255, 0.04)"};
  border: 1px solid
    ${({ $active }) => ($active ? "rgba(76, 175, 80, 0.4)" : "rgba(255, 255, 255, 0.1)")};
`;
