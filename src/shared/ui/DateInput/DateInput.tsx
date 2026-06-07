import { forwardRef, useCallback, useImperativeHandle, useState } from "react";
import { TextField, type TextFieldProps } from "@mui/material";
import { formatIsoDateDots } from "@/shared/lib/date/isoDate";
import {
  formatDateWhileTyping,
  isCompleteDateInput,
  isPartialDateInput,
  normalizeDateInput,
} from "@/shared/lib/date/parseDateInput";

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
};

const DateInput = forwardRef<DateInputHandle, DateInputProps>(function DateInput(
  { value, onChange, allowEmpty = false, sx, slotProps, ...rest },
  ref
) {
  const [draft, setDraft] = useState(() => formatIsoDateDots(value));
  const [focused, setFocused] = useState(false);

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

  return (
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
        htmlInput: {
          maxLength: 10,
          autoComplete: "off",
          ...slotProps?.htmlInput,
        },
      }}
    />
  );
});

export default DateInput;
