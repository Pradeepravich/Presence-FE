import { Dispatch, FC, SetStateAction, useMemo, useState } from "react";
import {
  TextField,
  Autocomplete,
  Chip,
  Box,
  InputAdornment,
  ListItemText,
  ListItem,
  ListItemButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import useBgColor from "../../hooks/useBgColor";
import SearchIcon from "../icons/Search1Icon";
import useDebouncedCallback from "../../hooks/useDebouncedCallback";
import CheckBox from "./CheckBox";
import ExpandMoreDownIcon from "../icons/ExpandMoreDownIcon";

export interface AutoCompleteMultipleOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface AutocompleteMultipleProps {
  options: AutoCompleteMultipleOption[];
  selectedOptions: AutoCompleteMultipleOption[];
  onChange?: (selected: AutoCompleteMultipleOption[]) => void;
  backgroundColor?: string;
  inputValue?: string;
  setInputValue?: Dispatch<SetStateAction<string>>;
  onFocus?: React.FocusEventHandler<HTMLDivElement> | undefined;
  testId?: string;
  placeholder?: string;
  loading?: boolean;
  height?: string;
  forcedBackgroundColor?: string;
}

const AutocompleteMultiple: FC<AutocompleteMultipleProps> = ({
  options,
  selectedOptions,
  onChange,
  backgroundColor,
  setInputValue,
  testId = "",
  placeholder = "Search Employee",
  loading = false,
  height = "auto",
  onFocus,
  inputValue,
  forcedBackgroundColor,
}) => {
  const [text, setText] = useState<string>("");

  const sortedOptions = useMemo(() => {
    const filtered = inputValue
      ? options.filter((opt) =>
          opt.label.toLowerCase().includes(inputValue.toLowerCase())
        )
      : options;

    return filtered.sort((a, b) => a.label.localeCompare(b.label));
  }, [options, inputValue]);

  const { bgColor } = useBgColor(backgroundColor);

  const debouncedSetInputValue = useDebouncedCallback((value: string) => {
    setInputValue?.(value);
  }, 1000);

  return (
    <Autocomplete
      multiple
      options={sortedOptions}
      value={selectedOptions}
      disableClearable
      onChange={(_, newValue) => {
        // Remove duplicates before updating state
        const uniqueValues = newValue.filter(
          (option, index, self) =>
            index === self.findIndex((o) => o.value === option.value)
        );
        onChange?.(uniqueValues);
        setText("");
        setInputValue?.("");
      }}
      onFocus={onFocus}
      renderOption={(props, option) => {
        const isChecked = selectedOptions.some(
          (sel) => sel.value === option.value
        );
        return (
          <Box
            sx={{ cursor: option.disabled ? "not-allowed !important" : "" }}
            whiteSpace="nowrap"
          >
            <Box
              sx={{ pointerEvents: option.disabled ? "none" : "" }}
              component="li"
              {...props}
              onClick={(event) => {
                event.stopPropagation();
                const updatedSelection = isChecked
                  ? selectedOptions.filter((sel) => sel.value !== option.value)
                  : [...selectedOptions, option];

                // Ensure no duplicates in selection
                const uniqueSelection = updatedSelection.filter(
                  (opt, index, self) =>
                    index === self.findIndex((o) => o.value === opt.value)
                );

                onChange?.(uniqueSelection);
              }}
            >
              <ListItem key={option.value} disablePadding>
                <ListItemButton
                  sx={{
                    p: "0px",
                    height: "20px",
                    "&:hover": {
                      backgroundColor: "transparent",
                      cursor: "default",
                    },
                  }}
                >
                  <CheckBox checked={isChecked} />
                  <ListItemText primary={option.label} />
                </ListItemButton>
              </ListItem>
            </Box>
          </Box>
        );
      }}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => (
          <Chip
            label={option.label}
            size="small"
            sx={{ fontSize: 8, height: "16px" }}
            deleteIcon={<CloseIcon sx={{ fontSize: 10 }} />}
            {...getTagProps({ index })}
            disabled={option.disabled}
          />
        ))
      }
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          size="small"
          placeholder={placeholder}
          sx={{
            minHeight: height,
            "& .MuiInputBase-root": {
              paddingRight: "16px",
              fontSize: "12px",
            },

            "& fieldset": { display: "none" },
            backgroundColor: forcedBackgroundColor || bgColor,
            borderRadius: "4px",
            paddingTop: 0.3,
            paddingBottom: 0.3,
          }}
          slotProps={{
            input: {
              ...params.InputProps, // Important to keep dropdown working
              startAdornment: (
                <>
                  <InputAdornment position="start">
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        pl: 0.5,
                        pt: 0.25,
                      }}
                    >
                      <SearchIcon />
                    </Box>
                  </InputAdornment>
                  {params.InputProps.startAdornment}
                </>
              ),              
            },
          }}
        />
      )}
      popupIcon={<ExpandMoreDownIcon />}
      sx={{
        width: "100%",
        position: "relative",
        "& .MuiOutlinedInput-root.MuiInputBase-sizeSmall": {
          paddingTop: 0.4,
          paddingBottom: 0.4,
        },
      }}
      limitTags={2}
      inputValue={text}
      onInputChange={(_, value) => {
        debouncedSetInputValue(value);
        setText(value);
      }}
      disableCloseOnSelect
      data-testid={testId}
      noOptionsText="No results found"
      loading={loading}
    />
  );
};

export default AutocompleteMultiple;
