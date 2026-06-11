import styled, { css } from "styled-components";
export const dialogBackdropSx = {
  backdropFilter: "blur(8px)",
  backgroundColor: "rgba(0, 0, 0, 0.68)",
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
  min-height: 0;
  height: 100%;
  max-height: inherit;
`;

export const DialogHeader = styled.div`
  flex-shrink: 0;
  padding: 18px 20px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  background:
    radial-gradient(circle at 100% 0%, rgba(129, 199, 132, 0.18) 0%, transparent 52%),
    linear-gradient(180deg, rgba(76, 175, 80, 0.12) 0%, rgba(0, 0, 0, 0.08) 100%);

`;

export const DialogHeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 14px;
`;

export const DialogHeaderMain = styled.div`
  flex: 1;
  min-width: 0;
`;

export const DialogProfileHero = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
`;

export const DialogAvatar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  font-size: 20px;
  font-weight: 800;
  line-height: 1;
  color: #142414;
  background: linear-gradient(135deg, #c8e6c9 0%, #66bb6a 100%);
  box-shadow: 0 4px 16px rgba(76, 175, 80, 0.32);
  border: 1px solid rgba(255, 255, 255, 0.16);
`;

export const DialogTitle = styled.h2`
  margin: 0;
  font-size: 19px;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.01em;
  color: rgba(255, 255, 255, 0.96);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const DialogSubtitle = styled.p`
  margin: 3px 0 0;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.3;
  color: rgba(255, 255, 255, 0.42);
`;

export const DialogHeroStats = styled.div`
  display: flex;
  align-items: stretch;
  gap: 8px;
  flex-wrap: wrap;
`;

export const BalanceHero = styled.div<{ $positive: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
  flex: 1 1 140px;
  min-width: 0;
  padding: 10px 12px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.22);
  border: 1px solid
    ${({ $positive }) =>
      $positive ? "rgba(129, 199, 132, 0.28)" : "rgba(229, 115, 115, 0.28)"};
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
`;

export const BalanceHeroLabel = styled.span`
  font-size: 9px;
  font-weight: 700;
  line-height: 1;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgba(255, 255, 255, 0.38);
`;

export const BalanceHeroValue = styled.span<{ $positive: boolean }>`
  font-size: 22px;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
  color: ${({ $positive }) => ($positive ? "#81c784" : "#e57373")};
`;

export const HeroMetaPill = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 52px;
  padding: 0 14px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: rgba(255, 255, 255, 0.72);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  white-space: nowrap;
`;

export const DialogBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 14px 16px 18px;
  -webkit-overflow-scrolling: touch;

`;

export const SectionCard = styled.section<{ $tone?: "default" | "danger" }>`
  padding: 12px 14px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.06);

  ${({ $tone }) =>
    $tone === "danger" &&
    css`
      background: rgba(239, 83, 80, 0.06);
      border-color: rgba(239, 83, 80, 0.18);
    `}
`;

export const SectionHead = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
`;

export const SectionIcon = styled.span<{ $tone?: "default" | "danger" | "primary" }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 9px;
  flex-shrink: 0;

  ${({ $tone = "default" }) => {
    switch ($tone) {
      case "primary":
        return css`
          color: #a5d6a7;
          background: rgba(76, 175, 80, 0.14);
          border: 1px solid rgba(129, 199, 132, 0.24);
        `;
      case "danger":
        return css`
          color: #ef9a9a;
          background: rgba(239, 83, 80, 0.12);
          border: 1px solid rgba(239, 83, 80, 0.24);
        `;
      default:
        return css`
          color: rgba(255, 255, 255, 0.72);
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
        `;
    }
  }}

  svg {
    font-size: 17px;
  }
`;

export const SectionHeadText = styled.div`
  min-width: 0;
`;

export const SectionTitle = styled.h3`
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.2;
  color: rgba(255, 255, 255, 0.9);
`;

export const SectionHint = styled.p`
  margin: 2px 0 0;
  font-size: 11px;
  line-height: 1.35;
  color: rgba(255, 255, 255, 0.4);
`;

export const NameRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

`;

export const SaveNameButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  min-height: 56px;
  padding: 0 16px;
  border: none;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  color: #142414;
  background: linear-gradient(145deg, #a5d6a7 0%, #66bb6a 100%);
  box-shadow: 0 2px 12px rgba(76, 175, 80, 0.28);
  transition:
    transform 0.15s ease,
    opacity 0.15s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.42;
    cursor: not-allowed;
    transform: none;
  }

`;

export const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;

`;

export const ActionTile = styled.button<{ $tone?: "primary" | "default" | "danger" }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    background 0.15s ease,
    transform 0.15s ease;

  ${({ $tone = "default" }) => {
    if ($tone === "primary") {
      return css`
        color: rgba(255, 255, 255, 0.92);
        background: rgba(76, 175, 80, 0.1);
        border: 1px solid rgba(129, 199, 132, 0.28);

        &:hover:not(:disabled) {
          background: rgba(76, 175, 80, 0.16);
          border-color: rgba(129, 199, 132, 0.42);
          transform: translateY(-1px);
        }
      `;
    }
    if ($tone === "danger") {
      return css`
        color: #ffcdd2;
        background: rgba(239, 83, 80, 0.1);
        border: 1px solid rgba(239, 83, 80, 0.28);

        &:hover:not(:disabled) {
          background: rgba(239, 83, 80, 0.16);
          transform: translateY(-1px);
        }
      `;
    }
    return css`
      color: rgba(255, 255, 255, 0.88);
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);

      &:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.07);
        border-color: rgba(255, 255, 255, 0.14);
        transform: translateY(-1px);
      }
    `;
  }}

  &:disabled {
    opacity: 0.42;
    cursor: not-allowed;
    transform: none;
  }
`;

export const ActionTileIcon = styled.span<{ $tone?: "primary" | "default" | "danger" }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 8px;

  ${({ $tone = "default" }) => {
    if ($tone === "primary") {
      return css`
        color: #a5d6a7;
        background: rgba(76, 175, 80, 0.18);
      `;
    }
    if ($tone === "danger") {
      return css`
        color: #ef9a9a;
        background: rgba(239, 83, 80, 0.16);
      `;
    }
    return css`
      color: rgba(255, 255, 255, 0.75);
      background: rgba(255, 255, 255, 0.06);
    `;
  }}

  svg {
    font-size: 18px;
  }
`;

export const ActionTileLabel = styled.span`
  font-size: 13px;
  font-weight: 700;
  line-height: 1.2;
`;

export const ActionTileHint = styled.span`
  font-size: 10px;
  font-weight: 500;
  line-height: 1.3;
  color: rgba(255, 255, 255, 0.4);
`;

export const ActionTileWide = styled(ActionTile)`
  grid-column: 1 / -1;
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

export const ActionTileWideText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

export const DeleteConfirmBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  border-radius: 10px;
  background: rgba(239, 83, 80, 0.1);
  border: 1px solid rgba(239, 83, 80, 0.28);
`;

export const DeleteConfirmText = styled.p`
  margin: 0;
  font-size: 12px;
  line-height: 1.45;
  color: rgba(255, 205, 210, 0.92);
`;

export const ConfirmActionRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const ConfirmButton = styled.button<{ $variant?: "danger" | "ghost" }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 9px 14px;
  border-radius: 9px;
  font-size: 13px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: opacity 0.15s ease;

  ${({ $variant = "ghost" }) =>
    $variant === "danger"
      ? css`
          color: #ffcdd2;
          background: rgba(239, 83, 80, 0.2);
          border: 1px solid rgba(239, 83, 80, 0.4);
        `
      : css`
          color: rgba(255, 255, 255, 0.78);
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.12);
        `}

  &:hover:not(:disabled) {
    filter: brightness(1.06);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;
