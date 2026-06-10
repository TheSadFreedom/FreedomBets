import styled from "styled-components";

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

export const LogoGrid = styled.div<{ $compact?: boolean }>`
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(${({ $compact }) => ($compact ? "72px" : "88px")}, 1fr)
  );
  gap: ${({ $compact }) => ($compact ? "6px" : "8px")};
  max-height: ${({ $compact }) => ($compact ? "140px" : "220px")};
  overflow: auto;
  padding: 2px;
`;

export const LogoOption = styled.button<{ $active?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 8px 6px;
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
