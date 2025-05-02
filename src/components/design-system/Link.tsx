import { Link as DefaultLink } from "react-router-dom";
import { styled } from "@mui/material/styles";

const StyledLink = styled(DefaultLink)`
  text-decoration: none;
  color: inherit;
  transition: color 0.3s ease-in-out;

  &:hover {
    color: #1976d2; /* MUI primary color */
  }
`;

const Link = ({
  to,
  children,
  ...props
}: {
  to: string;
  children: React.ReactNode;
}) => {
  return (
    <StyledLink to={to} {...props}>
      {children}
    </StyledLink>
  );
};

export default Link;
