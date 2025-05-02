import { Card, CardProps, styled } from "@mui/material";
import React, { ReactNode } from "react";
import LoadingOverlay from "./LoadingOverlay";

interface ChildrenProps extends CardProps {
  children: ReactNode;
  isLoading?: boolean;
}

const StyledCardComponent = styled(Card)(({ theme }) => ({
  borderRadius: "8px",
  boxShadow: theme.shadows[1],
  padding: theme.spacing(1.5),
  position: "relative",
  backgroundColor: theme.palette.mode === "dark" ? "#2f2f37" : "#ffffff",
}));

const CardComponent: React.FC<ChildrenProps> = ({
  children,
  isLoading = false,
  ...other
}) => {
  return (
    <StyledCardComponent {...other}>
      {children}
      {isLoading && <LoadingOverlay isLoading={isLoading} />}
    </StyledCardComponent>
  );
};

export default CardComponent;
