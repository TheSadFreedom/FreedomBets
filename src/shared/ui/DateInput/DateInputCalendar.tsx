import { useMemo, useState } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { parseIsoDate, todayIsoDateLocal } from "@/shared/lib/date/isoDate";
import {
  CalendarDay,
  CalendarGrid,
  CalendarHeader,
  CalendarNavButton,
  CalendarRoot,
  CalendarWeekday,
  CalendarWeekdays,
} from "./DateInputCalendar.styled";

const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

const pad2 = (n: number) => String(n).padStart(2, "0");

function isoFromParts(y: number, m: number, d: number): string {
  return `${y}-${pad2(m)}-${pad2(d)}`;
}

function monthLabel(year: number, month: number): string {
  const label = new Date(year, month - 1, 1).toLocaleDateString("ru-RU", {
    month: "long",
    year: "numeric",
  });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function buildMonthCells(year: number, month: number) {
  const firstWeekday = (new Date(year, month - 1, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells: Array<{ day: number | null; iso: string | null }> = [];

  for (let i = 0; i < firstWeekday; i += 1) {
    cells.push({ day: null, iso: null });
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({ day, iso: isoFromParts(year, month, day) });
  }
  return cells;
}

interface DateInputCalendarProps {
  value: string;
  onSelect: (iso: string) => void;
}

const DateInputCalendar = ({ value, onSelect }: DateInputCalendarProps) => {
  const anchor = parseIsoDate(value) ?? parseIsoDate(todayIsoDateLocal());
  const [viewYear, setViewYear] = useState(anchor?.y ?? new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(anchor?.m ?? new Date().getMonth() + 1);

  const cells = useMemo(
    () => buildMonthCells(viewYear, viewMonth),
    [viewYear, viewMonth]
  );

  const shiftMonth = (delta: number) => {
    const date = new Date(viewYear, viewMonth - 1 + delta, 1);
    setViewYear(date.getFullYear());
    setViewMonth(date.getMonth() + 1);
  };

  return (
    <CalendarRoot>
      <CalendarHeader>
        <CalendarNavButton type="button" aria-label="Предыдущий месяц" onClick={() => shiftMonth(-1)}>
          <ChevronLeftIcon fontSize="small" />
        </CalendarNavButton>
        <span>{monthLabel(viewYear, viewMonth)}</span>
        <CalendarNavButton type="button" aria-label="Следующий месяц" onClick={() => shiftMonth(1)}>
          <ChevronRightIcon fontSize="small" />
        </CalendarNavButton>
      </CalendarHeader>
      <CalendarWeekdays>
        {WEEKDAYS.map((day) => (
          <CalendarWeekday key={day}>{day}</CalendarWeekday>
        ))}
      </CalendarWeekdays>
      <CalendarGrid>
        {cells.map((cell, index) =>
          cell.day == null ? (
            <span key={`empty-${index}`} />
          ) : (
            <CalendarDay
              key={cell.iso}
              type="button"
              $selected={cell.iso === value}
              $today={cell.iso === todayIsoDateLocal()}
              onClick={() => cell.iso && onSelect(cell.iso)}
            >
              {cell.day}
            </CalendarDay>
          )
        )}
      </CalendarGrid>
    </CalendarRoot>
  );
};

export default DateInputCalendar;
