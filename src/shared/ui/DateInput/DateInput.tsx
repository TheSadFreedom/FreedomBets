import { forwardRef, useCallback, useImperativeHandle, useState } from "react";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import { IconButton, InputAdornment, Popover, TextField, type TextFieldProps } from "@mui/material";
import { formatIsoDateDots } from "@/shared/lib/date/isoDate";
import {
  formatDateWhileTyping,
  isCompleteDateInput,
  isPartialDateInput,
  normalizeDateInput,
} from "@/shared/lib/date/parseDateInput";
import DateInputCalendar from "./DateInputCalendar";

export type DateInputHandle = {
  /** Применить черновик и вернуть ISO-дату */
  commit: () => string;
};

type DateInputProps = Omit<TextFieldProps, "type" | "value" | "onChange"> & {
  /** YYYY-MM-DD */
  value: string;
  onChange: (isoDate: string) => void;
  /** Разрешить очистить поле (для необязательных дат) */
  allowEmpty?: boolean;
  /** Показать кнопку календаря */
  showCalendar?: boolean;
};

const DateInput = forwardRef<DateInputHandle, DateInputProps>(function DateInput(
  { value, onChange, allowEmpty = false, showCalendar = true, sx, slotProps, ...rest },
  ref
) {
  const [draft, setDraft] = useState(() => formatIsoDateDots(value));
  const [focused, setFocused] = useState(false);
  const [calendarAnchor, setCalendarAnchor] = useState<HTMLElement | null>(null);

  const commit = useCallback(() => {
    const trimmed = draft.trim();
    if (!trimmed && allowEmpty) {
      if (value !== "") onChange("");
      setDraft("");
      return "";
    }

    if (!isCompleteDateInput(trimmed)) {
      setDraft(formatIsoDateDots(value));
      return value;
    }

    const normalized = normalizeDateInput(trimmed, value);
    setDraft(formatIsoDateDots(normalized));
    if (normalized !== value) onChange(normalized);
    return normalized;
  }, [allowEmpty, draft, onChange, value]);

  useImperativeHandle(ref, () => ({ commit }), [commit]);

  const displayValue = focused ? draft : formatIsoDateDots(value);

  const applyIsoDate = (iso: string) => {
    onChange(iso);
    setDraft(formatIsoDateDots(iso));
    setFocused(false);
    setCalendarAnchor(null);
  };

  return (
    <>
      <TextField
        {...rest}
        type="text"
        inputMode="numeric"
        placeholder="04.06.2026"
        helperText={rest.helperText ?? "ДД.ММ.ГГГГ"}
        value={displayValue}
        onFocus={() => {
          setFocused(true);
          setDraft(formatIsoDateDots(value));
        }}
        onChange={(e) => {
          const next = formatDateWhileTyping(e.target.value);
          if (!isPartialDateInput(next)) return;
          setDraft(next);
          if (isCompleteDateInput(next)) {
            const normalized = normalizeDateInput(next, value);
            onChange(normalized);
          }
        }}
        onBlur={() => {
          setFocused(false);
          commit();
        }}
        sx={[
          { "& input": { fontVariantNumeric: "tabular-nums", letterSpacing: "0.02em" } },
          ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
        ]}
        slotProps={{
          ...slotProps,
          inputLabel: { shrink: true, ...slotProps?.inputLabel },
          input: {
            ...(typeof slotProps?.input === "object" ? slotProps.input : {}),
            endAdornment:
              showCalendar && !rest.disabled ? (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    aria-label="Открыть календарь"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={(event) => setCalendarAnchor(event.currentTarget)}
                    edge="end"
                    sx={{ color: "rgba(255,255,255,0.55)" }}
                  >
                    <CalendarMonthOutlinedIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : (
                typeof slotProps?.input === "object" ? slotProps.input.endAdornment : undefined
              ),
          },
          htmlInput: {
            maxLength: 10,
            autoComplete: "off",
            ...slotProps?.htmlInput,
          },
        }}
      />
      <Popover
        open={Boolean(calendarAnchor)}
        anchorEl={calendarAnchor}
        onClose={() => setCalendarAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: {
              mt: 0.5,
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.1)",
              background:
                "linear-gradient(165deg, rgba(42, 44, 48, 0.98) 0%, rgba(24, 24, 26, 0.99) 100%)",
              boxShadow: "0 16px 40px rgba(0,0,0,0.45)",
            },
          },
        }}
      >
        <DateInputCalendar value={value} onSelect={applyIsoDate} />
      </Popover>
    </>
  );
});

export default DateInput;
