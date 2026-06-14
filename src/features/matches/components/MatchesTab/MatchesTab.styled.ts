import styled, { css, keyframes } from "styled-components";
export const TabRoot = styled.section`
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 0;
`;

export const MatchesCard = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  border-radius: 16px;
  overflow: hidden;
  background: linear-gradient(
    145deg,
    rgba(42, 42, 42, 0.98) 0%,
    rgba(26, 26, 26, 0.99) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.22);
`;

export const FiltersPanel = styled.div`
  padding: 14px 16px;
  background: rgba(0, 0, 0, 0.18);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`;

export const FiltersHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  margin-bottom: 8px;
`;

export const FiltersWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const SearchRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
`;

export const SearchFieldWrap = styled.div`
  flex: 1;
  min-width: 0;
`;

export const StatusFilterRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 6px;
  min-width: 0;
`;

export const StatusFilterChip = styled.button<{ $active?: boolean }>`
  min-width: 0;
  padding: 6px 8px;
  border: 1px solid
    ${({ $active }) =>
      $active ? "rgba(76, 175, 80, 0.45)" : "rgba(255, 255, 255, 0.1)"};
  border-radius: 10px;
  background: ${({ $active }) =>
    $active ? "rgba(76, 175, 80, 0.18)" : "rgba(255, 255, 255, 0.04)"};
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.2;
  text-transform: none;
  color: ${({ $active }) =>
    $active ? "#c8e6c9" : "rgba(255, 255, 255, 0.68)"};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease;

  &:hover {
    border-color: ${({ $active }) =>
      $active ? "rgba(76, 175, 80, 0.55)" : "rgba(255, 255, 255, 0.18)"};
    background: ${({ $active }) =>
      $active ? "rgba(76, 175, 80, 0.24)" : "rgba(255, 255, 255, 0.08)"};
  }

  &:focus-visible {
    outline: 2px solid #81c784;
    outline-offset: 2px;
  }
`;

export const FiltersActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const MatchesScrollArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 0;
  padding: 14px 16px 16px;
`;

export const MatchSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
`;

export const MatchSectionTitle = styled.h3`
  margin: 0;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.45);
`;

export const MatchList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const EmptyState = styled.p`
  margin: 0;
  padding: 32px 20px;
  text-align: center;
  font-size: 15px;
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.5);
  border-radius: 14px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px dashed rgba(255, 255, 255, 0.1);
`;

export const EmptySearch = styled(EmptyState)``;

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const MatchSyncButton = styled.button<{ $syncing?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  padding: 0;
  border: 1px solid rgba(100, 181, 246, 0.35);
  border-radius: 10px;
  background: linear-gradient(
    145deg,
    rgba(38, 50, 62, 0.96) 0%,
    rgba(22, 28, 34, 0.98) 100%
  );
  box-shadow:
    0 2px 10px rgba(0, 0, 0, 0.24),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  font-family: inherit;
  color: #90caf9;
  cursor: pointer;
  transition:
    transform 0.18s ease,
    border-color 0.18s ease,
    box-shadow 0.18s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    border-color: rgba(100, 181, 246, 0.55);
    box-shadow:
      0 6px 18px rgba(33, 150, 243, 0.16),
      0 2px 10px rgba(0, 0, 0, 0.24);
  }

  &:active:not(:disabled) {
    transform: scale(0.96);
  }

  &:disabled {
    cursor: wait;
    opacity: 0.72;
  }

  &:focus-visible {
    outline: 2px solid #64b5f6;
    outline-offset: 2px;
  }

  svg {
    font-size: 20px;
    color: #90caf9;
    animation: ${({ $syncing }) => ($syncing ? css`${spin} 0.9s linear infinite` : "none")};
  }
`;
