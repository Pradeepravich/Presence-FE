import { Button, CircularProgress, useTheme } from "@mui/material";
import { ButtonProps as MuiButtonProps } from "@mui/material/Button";
import React from "react";

interface PopupButtonProps extends Omit<MuiButtonProps, "variant"> {
  loading?: boolean;
  backgroundColor?: string;
}

const PopupButton: React.FC<PopupButtonProps> = ({
  children,
  loading = false,
  backgroundColor,
  disabled,
  color,
  sx,
  ...props
}) => {
  const theme = useTheme();

  const buttonStyles = {
    height: 31,
    textTransform: "none" as const,
    backgroundColor: backgroundColor || theme.palette.primary.main,
    color: color || theme.palette.common.white,
    padding: "8px 12px",
  };

  return (
    <Button
      variant="contained"
      {...props}
      disabled={loading || disabled}
      sx={{ ...buttonStyles, ...sx }}
    >
      {loading ? (
        <CircularProgress size={16} sx={{ color: "inherit" }} />
      ) : (
        children
      )}
    </Button>
  );
};

export default PopupButton;
