import styled from "styled-components";

const COMPACT_CELL = 52;
const COMPACT_GAP = 6;
const COMPACT_ICON_ROWS = 2;

export const PickerRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const PickerTitle = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.82);
`;

export const PickerHint = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.45);
`;

export const LogoGrid = styled.div<{ $compact?: boolean; $rows?: number }>`
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(${({ $compact }) => ($compact ? `${COMPACT_CELL}px` : "88px")}, 1fr)
  );
  gap: ${({ $compact }) => ($compact ? `${COMPACT_GAP}px` : "8px")};
  max-height: ${({ $compact, $rows }) => {
    if (!$compact) return "220px";
    if ($rows === COMPACT_ICON_ROWS) {
      return `${COMPACT_ICON_ROWS * COMPACT_CELL + (COMPACT_ICON_ROWS - 1) * COMPACT_GAP}px`;
    }
    return "140px";
  }};
  overflow: auto;
  padding: 2px;
`;

export const LogoOption = styled.button<{ $active?: boolean; $iconOnly?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: ${({ $iconOnly }) => ($iconOnly ? "row" : "column")};
  gap: ${({ $iconOnly }) => ($iconOnly ? "0" : "6px")};
  min-height: ${({ $iconOnly }) => ($iconOnly ? `${COMPACT_CELL}px` : "auto")};
  padding: ${({ $iconOnly }) => ($iconOnly ? "0" : "8px 6px")};
  border-radius: 10px;
  border: 1px solid
    ${({ $active }) => ($active ? "rgba(102, 187, 106, 0.55)" : "rgba(255, 255, 255, 0.08)")};
  background: ${({ $active }) =>
    $active ? "rgba(76, 175, 80, 0.12)" : "rgba(255, 255, 255, 0.03)"};
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    background 0.15s ease;

  &:hover {
    border-color: rgba(102, 187, 106, 0.4);
    background: rgba(76, 175, 80, 0.08);
  }
`;

export const LogoOptionLabel = styled.span`
  font-size: 10px;
  line-height: 1.2;
  text-align: center;
  color: rgba(255, 255, 255, 0.62);
  word-break: break-word;
`;
