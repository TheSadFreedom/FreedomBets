import styled, { css } from "styled-components";

export const DialogShell = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

export const DialogHeader = styled.div`
  flex-shrink: 0;
  padding: 18px 20px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  background:
    radial-gradient(circle at 100% 0%, rgba(129, 199, 132, 0.22) 0%, transparent 52%),
    linear-gradient(180deg, rgba(76, 175, 80, 0.14) 0%, rgba(0, 0, 0, 0.08) 100%);
`;

export const DialogHeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 14px;
`;

export const HeaderIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  color: #a5d6a7;
  background: linear-gradient(135deg, rgba(129, 199, 132, 0.24) 0%, rgba(76, 175, 80, 0.1) 100%);
  border: 1px solid rgba(129, 199, 132, 0.32);
  box-shadow: 0 4px 14px rgba(76, 175, 80, 0.12);

  svg {
    font-size: 22px;
  }
`;

export const HeaderText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
  flex: 1;
`;

export const DialogTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.01em;
  color: rgba(255, 255, 255, 0.96);
`;

export const DialogSubtitle = styled.p`
  margin: 0;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.35;
  color: rgba(255, 255, 255, 0.44);
`;

export const BalanceCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 14px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.24);
  border: 1px solid rgba(129, 199, 132, 0.24);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
`;

export const BalanceCardLabel = styled.span`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.42);
`;

export const BalanceCardValue = styled.span`
  font-size: 24px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  line-height: 1.1;
  color: #a5d6a7;
`;

export const DialogBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 16px 20px 18px;
`;

export const PresetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
`;

export const PresetChip = styled.button<{ $active?: boolean }>`
  padding: 9px 8px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.78);
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    background 0.15s ease,
    color 0.15s ease,
    transform 0.15s ease;

  ${({ $active }) =>
    $active
      ? css`
          color: #c8e6c9;
          background: rgba(76, 175, 80, 0.16);
          border-color: rgba(129, 199, 132, 0.42);
        `
      : ""}

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    border-color: rgba(129, 199, 132, 0.32);
    background: rgba(76, 175, 80, 0.1);
  }

  &:disabled {
    opacity: 0.38;
    cursor: not-allowed;
    transform: none;
  }
`;

export const PreviewCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 10px;
  background: rgba(76, 175, 80, 0.08);
  border: 1px solid rgba(129, 199, 132, 0.2);
`;

export const PreviewLabel = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.52);
`;

export const PreviewValue = styled.span`
  font-size: 15px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  color: #81c784;
`;

export const HintText = styled.p`
  margin: 0;
  font-size: 11px;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.38);
`;

export const DialogFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 20px 18px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(0, 0, 0, 0.12);
`;

export const FooterButton = styled.button<{ $primary?: boolean }>`
  padding: 9px 16px;
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
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const fieldSx = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: "12px",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#81c784",
  },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(102, 187, 106, 0.6)",
  },
} as const;
