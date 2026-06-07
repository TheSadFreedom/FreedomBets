import styled from "styled-components";
import { media } from "@/shared/styles/breakpoints";

export {
  dialogBackdropSx,
  dialogPaperSx,
} from "@/shared/styles/dialogSx";

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
  height: 100%;
  max-height: inherit;
`;

export const DialogHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  flex-shrink: 0;

  ${media.down("sm")} {
    padding: 14px 12px 10px;
  }
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
  overflow-y: auto;
  flex: 1;
  min-height: 0;

  ${media.down("sm")} {
    padding: 14px 12px;
    gap: 12px;
  }
`;

export const DialogFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 12px 20px max(18px, env(safe-area-inset-bottom));
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  flex-shrink: 0;

  ${media.down("sm")} {
    flex-direction: column-reverse;
    padding: 12px 12px max(14px, env(safe-area-inset-bottom));

    button {
      width: 100%;
    }
  }
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

export const ScoreSeparator = styled.span`
  padding-bottom: 10px;
  font-size: 14px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.35);
`;

export const ScoreRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 10px;
  align-items: end;

  ${media.down("xs")} {
    grid-template-columns: 1fr;
    gap: 8px;

    ${ScoreSeparator} {
      display: none;
    }
  }
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
