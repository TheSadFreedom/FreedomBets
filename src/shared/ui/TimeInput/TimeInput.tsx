import { forwardRef, useCallback, useImperativeHandle, useState } from "react";
import { TextField, type TextFieldProps } from "@mui/material";
import {
  formatTimeWhileTyping,
  isPartialTimeInput,
  normalizeTimeInput,
} from "@/shared/lib/time/parseTimeInput";

export type TimeInputHandle = {
  commit: () => string;
};

type TimeInputProps = Omit<TextFieldProps, "type" | "value" | "onChange"> & {
  value: string;
  onChange: (value: string) => void;
};

const FULL_TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

const TimeInput = forwardRef<TimeInputHandle, TimeInputProps>(function TimeInput(
  { value, onChange, sx, slotProps, ...rest },
  ref
) {
  const [draft, setDraft] = useState(value);
  const [focused, setFocused] = useState(false);

  const commit = useCallback(() => {
    const normalized = normalizeTimeInput(draft, value || "00:00");
    setDraft(normalized);
    onChange(normalized);
    return normalized;
  }, [draft, onChange, value]);

  useImperativeHandle(ref, () => ({ commit }), [commit]);

  const displayValue = focused ? draft : value;

  return (
    <TextField
      {...rest}
      type="text"
      inputMode="numeric"
      placeholder="16:00"
      value={displayValue}
      onFocus={() => {
        setFocused(true);
        setDraft(value);
      }}
      onChange={(e) => {
        const next = formatTimeWhileTyping(e.target.value);
        if (!isPartialTimeInput(next)) return;
        setDraft(next);
        if (FULL_TIME.test(next)) {
          onChange(normalizeTimeInput(next, value || "00:00"));
        }
      }}
      onBlur={() => {
        setFocused(false);
        commit();
      }}
      sx={[
        { "& input": { fontVariantNumeric: "tabular-nums", letterSpacing: "0.04em" } },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
      slotProps={{
        ...slotProps,
        inputLabel: { shrink: true, ...slotProps?.inputLabel },
        htmlInput: {
          maxLength: 5,
          autoComplete: "off",
          ...slotProps?.htmlInput,
        },
      }}
    />
  );
});

export default TimeInput;
