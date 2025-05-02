import { Button as MUIButton, ButtonProps } from "@mui/material";
import { ReactNode } from "react";

interface CustomButtonProps extends ButtonProps {
  text: string;
  startIcon?: ReactNode;
}

const Button = ({ text, startIcon, sx, ...props }: CustomButtonProps) => {
  return (
    <MUIButton
      variant="contained"
      startIcon={startIcon}
      sx={{
        ...sx,
      }}
      {...props}
    >
      {text}
    </MUIButton>
  );
};

export default Button;
