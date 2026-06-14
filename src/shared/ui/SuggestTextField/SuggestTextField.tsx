import { Autocomplete, InputAdornment, TextField, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { limitInputLength, MAX_INPUT_LENGTH } from "@/shared/lib/limits";
import OrganizationLogo from "@/shared/ui/OrganizationLogo/OrganizationLogo";
import TeamLogo from "@/shared/ui/TeamLogo/TeamLogo";
import { SuggestOptionRow } from "./SuggestTextField.styled";

export type SuggestLogoKind = "team" | "organization";

const LOGO_SIZE = 22;

interface SuggestTextFieldProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder?: string;
  sx?: SxProps<Theme>;
  logo?: SuggestLogoKind;
  /** Имя для логотипа, если оно отличается от текста опции (напр. название турнира → организация) */
  getLogoName?: (option: string) => string;
  maxLength?: number;
}

const renderLogo = (kind: SuggestLogoKind, name: string) => {
  const trimmed = name.trim();
  if (!trimmed) return null;
  return kind === "team" ? (
    <TeamLogo name={trimmed} size={LOGO_SIZE} />
  ) : (
    <OrganizationLogo name={trimmed} size={LOGO_SIZE} />
  );
};

const SuggestTextField = ({
  label,
  value,
  options,
  onChange,
  placeholder,
  sx,
  logo,
  getLogoName,
  maxLength = MAX_INPUT_LENGTH,
}: SuggestTextFieldProps) => {
  const logoNameForValue = (logo && value.trim() ? getLogoName?.(value) ?? value : "").trim();

  return (
    <Autocomplete
      freeSolo
      options={options}
      inputValue={value}
      onInputChange={(_, newValue) => onChange(limitInputLength(newValue, maxLength))}
      onChange={(_, newValue) =>
        onChange(limitInputLength(typeof newValue === "string" ? newValue : "", maxLength))
      }
      slotProps={{
        paper: { sx: { mt: 0.5 } },
        listbox: { sx: { maxHeight: 280 } },
      }}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        const logoName = (getLogoName?.(option) ?? option).trim();
        return (
          <li key={key} {...optionProps}>
            <SuggestOptionRow>
              {logo ? renderLogo(logo, logoName) : null}
              <Typography variant="body2" noWrap title={option} sx={{ flex: 1, minWidth: 0 }}>
                {option}
              </Typography>
            </SuggestOptionRow>
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          fullWidth
          sx={sx}
          slotProps={{
            htmlInput: {
              ...params.inputProps,
              maxLength,
            },
            input: {
              ...params.InputProps,
              startAdornment: (
                <>
                  {logo && logoNameForValue ? (
                    <InputAdornment position="start" sx={{ ml: 0.5, mr: -0.25 }}>
                      {renderLogo(logo, logoNameForValue)}
                    </InputAdornment>
                  ) : null}
                  {params.InputProps.startAdornment}
                </>
              ),
            },
          }}
        />
      )}
    />
  );
};

export default SuggestTextField;
