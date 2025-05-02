import React, { Dispatch, SetStateAction } from "react";
import { Autocomplete, InputAdornment, TextField } from "@mui/material";
import useBgColor from "../../hooks/useBgColor";
import ExpandMoreDownIcon from "../icons/ExpandMoreDownIcon";
import SearchIcon from "../icons/Search1Icon";

export interface AutoCompleteSingleOption {
  label: string;
  value: string;
}

interface AutocompleteSingleProps {
  options: AutoCompleteSingleOption[];
  selectedOption: string;
  onChange?: (selected: AutoCompleteSingleOption | null) => void;
  backgroundColor?: string;
  inputValue?: string;
  setInputValue?: Dispatch<SetStateAction<string>>;
  placeholder?: string;
  testId?: string;
  height?: string;
  forcedBackgroundColor?: string;
}

const AutoCompleteSingle: React.FC<AutocompleteSingleProps> = ({
  options,
  selectedOption,
  onChange,
  inputValue = "",
  setInputValue,
  backgroundColor,
  placeholder = "Search Employee",
  testId = "",
  height = "35px",
  forcedBackgroundColor,
}) => {
  const value = options.find((o) => o.value === selectedOption) || null;
  const { bgColor } = useBgColor(backgroundColor);

  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option) => option.label}
      value={value}
      onChange={(_, newValue) => onChange?.(newValue ?? null)}
      sx={{
        width: "300px",
        "& .MuiOutlinedInput-root.MuiInputBase-sizeSmall": {
          paddingTop: 0.4,
          paddingBottom: 0.4,
        },
        "& .MuiAutocomplete-popupIndicator": {
          transform: "none !important",
        },
      }}
      popupIcon={<ExpandMoreDownIcon />}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={placeholder}
          variant="outlined"
          size="small"
          sx={{
            height,
            display: "flex",
            alignItems: "center",
            "& .MuiOutlinedInput-root.MuiInputBase-sizeSmall": {
              height: "100%",
              display: "flex",
              alignItems: "center",
            },
            "& .MuiInputBase-root": {
              paddingRight: "16px",
              fontSize: "12px",
              height: "100%", // Ensure input takes full height
              display: "flex",
              alignItems: "center",
            },
            "& fieldset": { display: "none" },
            backgroundColor: forcedBackgroundColor || bgColor,
            borderRadius: "4px",
          }}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      )}
      inputValue={value ? value.label : inputValue}
      onInputChange={(_, value, reason) => {
        if (reason === "input" || reason === "clear") {
          setInputValue?.(value);
        }
      }}
      clearOnEscape
      data-testid={testId}
      noOptionsText="No results found"
    />
  );
};

export default AutoCompleteSingle;
