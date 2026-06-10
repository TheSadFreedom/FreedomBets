import styled from "styled-components";

export const EditorRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const EditorHint = styled.div`
  font-size: 11px;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.45);
`;

export const StageChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  min-height: 28px;
`;

export const StageChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px 4px 10px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.06);
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.82);
`;

export const StageChipRemove = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  padding: 0;
  border: none;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.55);
  font-family: inherit;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;

  &:hover {
    background: rgba(239, 83, 80, 0.2);
    color: #ef9a9a;
  }
`;

export const AddRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-start;
`;

export const QuickAddRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export const QuickAddButton = styled.button`
  padding: 5px 10px;
  border-radius: 999px;
  border: 1px dashed rgba(255, 255, 255, 0.16);
  background: transparent;
  color: rgba(255, 255, 255, 0.55);
  font-family: inherit;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    border-color: rgba(76, 175, 80, 0.45);
    color: rgba(255, 255, 255, 0.82);
  }

  &:disabled {
    opacity: 0.35;
    cursor: default;
  }
`;
