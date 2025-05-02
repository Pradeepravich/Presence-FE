import {
  Box,
  ClickAwayListener,
  InputAdornment,
  Paper,
  Popper,
  Stack,
  TextField,
  Typography,
  styled,
  Chip,
} from "@mui/material";
import { useCallback, useRef, useState } from "react";
import SearchIcon from "../../components/icons/Search1Icon";
import InfiniteScrollList from "../InfiniteScrollList";
import LoadingOverlay from "./LoadingOverlay";
import ExpandMoreDownIcon from "../icons/ExpandMoreDownIcon";
import CustomCheckbox from "./CheckBox";

interface Option {
  label: string;
  value: string;
  disabled?: boolean;
}

interface SearchableDropdownWithInfiniteScrollProps {
  options: Option[];
  selectedOptions: Option[];
  onSelectionChange: (selected: Option[]) => void;
  placeholder?: string;
  label?: string;
  onSearch?: (value: string) => void;
  hasMore?: boolean;
  loadMore?: () => void;
  isLoading?: boolean;
  error?: Error | null;
  searchInputTestId?: string; 
}

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    minHeight: "33px",
    height: "auto",
    padding: "4px 8px",
    borderRadius: "4px",
    backgroundColor: theme.palette.grey[600],
    "& fieldset": {
      borderColor: theme.palette.grey[600],
    },
    "&:hover fieldset": {
      borderColor: theme.palette.grey[600],
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.grey[600],
    },
    "& .MuiInputAdornment-root.MuiInputAdornment-positionEnd": {
      marginLeft: "auto",
    },
  },
  "& .MuiOutlinedInput-input": {
    padding: "0",
    cursor: "pointer",
    width: "0px",
    "&::placeholder": {
      opacity: 1,
      color: theme.palette.text.secondary,
    },
  },
}));

interface SearchFieldProps {
  bgcolor?: string;
}

export const SearchField = styled(TextField)<SearchFieldProps>(
  ({ theme, bgcolor }) => ({
    "& .MuiOutlinedInput-root": {
      backgroundColor: bgcolor || "#F5F5F5",
      borderRadius: "4px",
      border: "1px solid #EEEEEE",
      "& fieldset": {
        border: "none",
      },
      "&:hover fieldset": {
        border: "none",
      },
      "&.Mui-focused fieldset": {
        border: "none",
      },
    },
    "& .MuiOutlinedInput-input": {
      padding: "4px 8px",
      fontSize: "10px",
      "&::placeholder": {
        color: theme.palette.text.secondary,
        opacity: 1,
      },
    },
  })
);

const DropdownPaper = styled(Paper)(({ theme }) => ({
  overflow: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  borderRadius: "8px",
  padding: "12px",
  backgroundColor: theme.palette.mode === "light" ? "#ffffff" : "#292a2c",
  height: "189px",
}));

const ChipsContainer = styled(Box)({
  display: "flex",
  flexWrap: "wrap",
  gap: "4px",
  flex: 1,
  minWidth: 0,
  marginRight: "8px",
});

const SearchableDropdownWithInfiniteScroll = ({
  options,
  selectedOptions,
  onSelectionChange,
  placeholder = "Search...",
  label,
  onSearch,
  hasMore = false,
  loadMore,
  isLoading = false,
  error = null,
  searchInputTestId,
}: SearchableDropdownWithInfiniteScrollProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const anchorRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearch(value);
      onSearch?.(value);
    },
    [onSearch]
  );

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setSearch("");
    onSearch?.("");
  }, [onSearch]);

  const handleOptionClick = useCallback(
    (option: Option) => {
      const isSelected = selectedOptions.some(
        (selected) => selected.value === option.value
      );
      if (isSelected) {
        onSelectionChange(
          selectedOptions.filter((selected) => selected.value !== option.value)
        );
      } else {
        onSelectionChange([...selectedOptions, option]);
      }
    },
    [selectedOptions, onSelectionChange]
  );

  return (
    <ClickAwayListener onClickAway={isOpen ? handleClose : () => {}}>
      <Box>
        {label && (
          <Typography variant="body1" mb={1}>
            {label}
          </Typography>
        )}
        <Box ref={anchorRef}>
          <StyledTextField
            fullWidth
            placeholder={!selectedOptions?.length ? placeholder : ""}
            onClick={handleToggle}
            slotProps={{
              input: {
                readOnly: true,
                startAdornment: selectedOptions.length > 0 && (
                  <ChipsContainer>
                    {selectedOptions.map((option) => (
                      <Chip
                        key={option.value}
                        label={option.label}
                        onDelete={(e) => {
                          e.stopPropagation();
                          onSelectionChange(
                            selectedOptions.filter(
                              (selected) => selected.value !== option.value
                            )
                          );
                        }}
                        size="small"
                        sx={{
                          backgroundColor: "rgba(3, 155, 229, 0.16)",
                          borderRadius: "4px",
                          height: "24px",
                          "& .MuiChip-label": {
                            fontSize: "12px",
                            padding: "0 8px",
                          },
                          "& .MuiChip-deleteIcon": {
                            fontSize: "16px",
                            margin: "0 4px 0 -6px",
                          },
                        }}
                      />
                    ))}
                  </ChipsContainer>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <ExpandMoreDownIcon />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>
        <Popper
          open={isOpen}
          anchorEl={anchorRef.current}
          placement="bottom-start"
          style={{ width: anchorRef.current?.clientWidth, zIndex: 1300 }}
        >
          <DropdownPaper>
            <SearchField
              fullWidth
              placeholder="Search"
              value={search}
              onChange={handleSearch}
              inputRef={searchInputRef}
              inputProps={{
                "data-testid": searchInputTestId
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                },
              }}
              bgcolor={"transparent"}
            />
            <Box position="relative" sx={{ flex: 1 }}>
              {isLoading && <LoadingOverlay isLoading={isLoading} />}
              <InfiniteScrollList
                hasMore={hasMore}
                loadMore={loadMore || (() => {})}
                isLoading={isLoading}
                error={error}
              >
                <Stack direction="column" gap="12px">
                  {options.map((option) => (
                    <Box
                      key={option.value}
                      sx={{
                        cursor: option.disabled
                          ? "not-allowed !important"
                          : "pointer",
                        opacity: option.disabled ? 0.5 : 1,
                      }}
                    >
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={0.5}
                        onClick={() => handleOptionClick(option)}
                        sx={{
                          height: "13px",
                          pointerEvents: option.disabled ? "none" : "auto",
                        }}
                      >
                        <CustomCheckbox
                          checked={selectedOptions.some(
                            (selected) => selected.value === option.value
                          )}
                        />
                        <Typography variant="body1">{option.label}</Typography>
                      </Stack>
                    </Box>
                  ))}
                  {options.length === 0 && (
                    <Typography
                      variant="body2"
                      sx={{ p: 1, color: "text.secondary" }}
                    >
                      No results found
                    </Typography>
                  )}
                </Stack>
              </InfiniteScrollList>
            </Box>
          </DropdownPaper>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
};

export default SearchableDropdownWithInfiniteScroll;
