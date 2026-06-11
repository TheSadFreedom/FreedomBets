import styled, { css } from "styled-components";
export { dialogBackdropSx, dialogPaperSx } from "@/shared/styles/dialogSx";

export const fieldSx = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: "10px",
    transition: "border-color 0.2s ease, background-color 0.2s ease",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.06)",
    },
    "&.Mui-focused": {
      backgroundColor: "rgba(76, 175, 80, 0.08)",
    },
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#81c784",
  },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(102, 187, 106, 0.5)",
  },
} as const;

export const compactFieldSx = {
  ...fieldSx,
  "& .MuiOutlinedInput-input": {
    padding: "8px 12px",
    fontSize: "13px",
  },
  "& .MuiInputLabel-root": {
    fontSize: "13px",
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
  gap: 12px;
  padding: 16px 18px 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(
    180deg,
    rgba(76, 175, 80, 0.1) 0%,
    rgba(76, 175, 80, 0.03) 100%
  );
  flex-shrink: 0;

`;

export const HeaderIcon = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: linear-gradient(
    145deg,
    rgba(102, 187, 106, 0.28) 0%,
    rgba(76, 175, 80, 0.14) 100%
  );
  border: 1px solid rgba(102, 187, 106, 0.35);

  svg {
    font-size: 22px;
    color: #a5d6a7;
  }
`;

export const HeaderText = styled.div`
  flex: 1;
  min-width: 0;
  padding-top: 2px;
`;

export const DialogTitle = styled.h2`
  margin: 0 0 2px;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 0.01em;
  color: rgba(255, 255, 255, 0.92);
`;

export const HeaderSubtitle = styled.p`
  margin: 0;
  font-size: 12px;
  line-height: 1.35;
  color: rgba(255, 255, 255, 0.5);
`;

export const DialogBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px 18px 6px;
  overflow-y: auto;
  flex: 1;
  min-height: 0;

`;

export const Section = styled.section`
  padding: 12px 14px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
`;

export const SectionTitle = styled.h3`
  margin: 0 0 10px;
  font-size: 10px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.55);
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

export const FieldsStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const FieldsGrid = styled.div<{ $cols?: 2 | 3 }>`
  display: grid;
  grid-template-columns: ${({ $cols }) =>
    $cols === 3 ? "1fr 1fr 1fr" : $cols === 2 ? "1fr 1fr" : "1fr"};
  gap: 10px;

`;

export const FormatRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const chipActive = css`
  color: #c8e6c9;
  background: rgba(76, 175, 80, 0.16);
  border-color: rgba(76, 175, 80, 0.4);
  box-shadow: 0 2px 10px rgba(76, 175, 80, 0.12);
`;

export const FormatChip = styled.button<{ $active?: boolean }>`
  flex: 1;
  min-width: 52px;
  padding: 7px 10px;
  border-radius: 9px;
  font-size: 12px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  color: ${({ $active }) => ($active ? "#c8e6c9" : "rgba(255, 255, 255, 0.65)")};
  background: ${({ $active }) =>
    $active ? "rgba(76, 175, 80, 0.16)" : "rgba(255, 255, 255, 0.04)"};
  border: 1px solid
    ${({ $active }) => ($active ? "rgba(76, 175, 80, 0.4)" : "rgba(255, 255, 255, 0.1)")};
  transition:
    color 0.15s ease,
    background 0.15s ease,
    border-color 0.15s ease;

  ${({ $active }) => $active && chipActive}

  &:hover {
    border-color: rgba(102, 187, 106, 0.35);
    background: rgba(76, 175, 80, 0.1);
  }
`;

export const TeamsRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 8px;
  align-items: center;

`;

export const VsBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.04em;
  color: rgba(255, 255, 255, 0.45);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);

`;

export const MapsToggle = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0;
  border: none;
  background: transparent;
  font-family: inherit;
  cursor: pointer;
  text-align: left;
`;

export const MapsToggleLabel = styled.span`
  font-size: 10px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.55);
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

export const MapsToggleHint = styled.span`
  font-size: 11px;
  font-weight: 500;
  color: rgba(102, 187, 106, 0.65);
`;

export const MapsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 10px;
`;

export const MapRow = styled.div`
  display: grid;
  grid-template-columns: 22px 1fr 52px auto 52px;
  gap: 6px;
  align-items: center;

`;

export const MapIndex = styled.span`
  width: 22px;
  height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 11px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.42);
  text-align: center;
`;

export const ScoreColon = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.72);
  text-align: center;
`;

export const ScoreFields = styled.div`
  display: contents;

`;

export const HintText = styled.p`
  margin: 6px 0 0;
  font-size: 11px;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.45);
`;

export const DialogFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 10px 18px max(14px, env(safe-area-inset-bottom));
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  flex-shrink: 0;

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
  transition: opacity 0.15s ease, transform 0.15s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
