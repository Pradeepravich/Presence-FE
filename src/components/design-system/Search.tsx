import { InputAdornment, styled, TextField } from "@mui/material";
import SearchIcon from "../icons/Search1Icon";
import { FC, useRef } from "react";
import { debounce } from "lodash";

const SearchField = styled(TextField)<{
  fullWidth?: boolean;
  backgroundColor?: string;
}>(({ theme, fullWidth, backgroundColor }) => ({
  width: fullWidth ? "100%" : 300,
  "& .MuiOutlinedInput-root": {
    height: 29,
    borderRadius: 4,
    // border: "1.5px solid #EEEEEE",
    border:
      theme.palette.mode === "light"
        ? "1.5px solid rgb(0 0 0 / 12%)"
        : "1.5px solid rgba(168, 168, 168, 1)",
    backgroundColor:
      backgroundColor || (theme.palette.mode === "light" ? "white" : "#3a3b40"),
    "& fieldset": {
      borderColor: "transparent",
    },
    "&:hover fieldset": {
      borderColor: "transparent",
    },
    "&.Mui-focused fieldset": {
      borderColor: "transparent",
    },
  },
}));

interface SearchProps {
  onChange: (value: string) => void;
  placeholder: string;
  fullWidth?: boolean;
  backgroundColor?: string;
  inputTestId?: string;
}

const Search: FC<SearchProps> = ({
  onChange,
  placeholder,
  fullWidth = false,
  backgroundColor,
  inputTestId,
}) => {
  const debouncedChangeHandler = useRef(
    debounce((value: string) => onChange(value), 500)
  ).current;

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    debouncedChangeHandler(e.target.value);
  };

  return (
    <SearchField
      placeholder={placeholder}
      size="small"
      onChange={handleChange}
      type="search"
      fullWidth={fullWidth}
      backgroundColor={backgroundColor}
      inputProps={{ 'data-testid': inputTestId }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  );
};

export default Search;
