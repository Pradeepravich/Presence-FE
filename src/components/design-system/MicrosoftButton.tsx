import { ButtonBase, styled } from "@mui/material";
import { ReactNode } from "react";

const StyledButtonBase = styled(ButtonBase)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  paddingLeft: 30,
  paddingRight: 30,
  borderRadius: "4px",
  fontSize: "12px",
  fontWeight: 600,
  lineHeight: "15.12px",
  border: `0.5px solid  ${theme.palette.grey[500]}`,
  height: 40,
}));

interface MicrosoftButtonBaseProps {
  title: ReactNode;
  onClick: () => void;
}

const MicrosoftButton: React.FC<MicrosoftButtonBaseProps> = ({
  title,
  onClick,
}) => {
  return <StyledButtonBase onClick={onClick}>{title}</StyledButtonBase>;
};

export default MicrosoftButton;
