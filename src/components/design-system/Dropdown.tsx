import React from "react";
import {
  MenuItem,
  Select,
  Typography,
  SelectChangeEvent,
  Stack,
  styled,
  Box,
} from "@mui/material";
import BlueCheckCircleIcon from "../../assets/blue-check-icon.svg";
import useBgColor from "../../hooks/useBgColor";
import ExpandMoreDownIcon from "../icons/ExpandMoreDownIcon";

const Image = styled("img")(() => ({
  marginLeft: "6px",
}));

export interface DropdownOption {
  value: string;
  label: string;
}

export interface DropdownProps {
  options: DropdownOption[];
  value: string | number;
  onChange: (value: string) => void;
  renderValue?: ((value: string) => React.ReactNode) | undefined;
  backgroundColor?: string;
  forceBackgroundColor?: string;
  testId?: string;
  setState?: (value: string) => void;
  fullWidth?: boolean;
  height?: string;
  placeholder?: string;
}

export const CustomExpandIcon: React.FC<{
  className?: string;
  onClick?: (event: React.MouseEvent) => void;
}> = ({ className, onClick }) => {
  return (
    <Box className={className} onClick={onClick} sx={{ marginTop: "-3px" }}>
      <ExpandMoreDownIcon />
    </Box>
  );
};

const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  renderValue,
  backgroundColor,
  forceBackgroundColor,
  testId = "",
  onChange,
  setState,
  fullWidth,
  height,
  placeholder,
}) => {
  const handleChange = (event: SelectChangeEvent) => {
    onChange?.(event.target.value);
    setState?.(event.target.value);
  };

  const { bgColor } = useBgColor(backgroundColor || "transparent");

  return (
    <Select
      displayEmpty
      value={value.toString()}
      onChange={handleChange}
      renderValue={
        renderValue ||
        ((selected) => {
          if (!selected && placeholder) {
            return (
              <Typography variant="caption" color="#aaa">
                {placeholder}
              </Typography>
            );
          }
          return options.find((option) => option.value === selected)?.label;
        })
      }
      size="small"
      sx={{
        display: "flex",
        alignItems: "center",
        "& fieldset": { display: "none" },
        backgroundColor: forceBackgroundColor || bgColor,
        "& .MuiSelect-icon": {
          transform: "none !important",
          transition: "none !important",
        },
        width: fullWidth ? "100%" : "auto",
        height: height || "32px",
      }}
      IconComponent={CustomExpandIcon}
      data-testid={testId}
    >
      {options?.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          <Stack direction="row" alignItems="center">
            <Typography variant="caption">{option.label}</Typography>
            {value === option.value && (
              <Image src={BlueCheckCircleIcon} alt="Selected" />
            )}
          </Stack>
        </MenuItem>
      ))}
    </Select>
  );
};

export default Dropdown;
