import styled from "styled-components";

export const CalendarRoot = styled.div`
  width: 280px;
  padding: 10px 10px 12px;
`;

export const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.92);
`;

export const CalendarNavButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.75);
  cursor: pointer;

  &:hover {
    border-color: rgba(102, 187, 106, 0.35);
    background: rgba(76, 175, 80, 0.1);
    color: #c8e6c9;
  }
`;

export const CalendarWeekdays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  margin-bottom: 4px;
`;

export const CalendarWeekday = styled.span`
  text-align: center;
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.42);
`;

export const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
`;

export const CalendarDay = styled.button<{ $selected?: boolean; $today?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  aspect-ratio: 1;
  min-height: 34px;
  padding: 0;
  border-radius: 8px;
  border: 1px solid
    ${({ $selected, $today }) =>
      $selected
        ? "rgba(102, 187, 106, 0.55)"
        : $today
          ? "rgba(255, 255, 255, 0.18)"
          : "transparent"};
  background: ${({ $selected }) =>
    $selected ? "rgba(76, 175, 80, 0.22)" : "transparent"};
  color: ${({ $selected }) =>
    $selected ? "#c8e6c9" : "rgba(255, 255, 255, 0.88)"};
  font-family: inherit;
  font-size: 13px;
  font-weight: ${({ $selected, $today }) => ($selected || $today ? 700 : 500)};
  cursor: pointer;
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease;

  &:hover {
    border-color: rgba(102, 187, 106, 0.4);
    background: rgba(76, 175, 80, 0.12);
    color: #e8f5e9;
  }
`;
