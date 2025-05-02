import { Box, Card, Stack, styled, Typography } from "@mui/material";
import { IconButtonBase } from "./LayoutComponent";
import EditIcon from "../components/icons/EditIcon";

export const SettingsCard = styled(Box)({
  border: "1px solid #EEEEEE",
  borderRadius: 8,
  padding: 16,
});

export const StyledCard = styled(Card)(({ theme }) => ({
  padding: "16px",
  borderRadius: "8px",
  backgroundColor: theme.palette.mode === "light" ? "white" : "#212832",
  boxShadow: "none",
}));

export const ButtonBase = styled(IconButtonBase)<{ colour?: string }>(
  ({ colour, theme }) => ({
    paddingLeft: "4px",
    paddingRight: "4px",
    backgroundColor:
      colour || theme.palette.mode == "light"
        ? "#D7EFFB"
        : "rgba(50, 130, 184, 1)",
    "&:hover": {
      backgroundColor:
        colour || theme.palette.mode == "light"
          ? "#D7EFFB"
          : "rgba(50, 130, 184, 1)",
    },
  })
);

interface DetailsCardProps {
  title: string;
  subTitle: string;
  children: React.ReactNode;
  onEdit?: VoidFunction;
  editTestId?: string; 
}

const DetailsCard = ({
  title,
  subTitle,
  children,
  onEdit,
  editTestId,
}: DetailsCardProps) => {
  return (
    <StyledCard variant="outlined">
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography
          variant="h5"
          fontWeight="600"
          noWrap
          sx={{
            width: "calc(100% - 48px)",
            flexShrink: 0,
          }}
        >
          {title}
        </Typography>
        <ButtonBase onClick={onEdit} data-testid={editTestId}>
          <Box sx={{ color: "common.black", fontSize: "8px", height: "16px", width: "16px" }}>
            <EditIcon />
          </Box>
        </ButtonBase>
      </Stack>
      <Typography
        my={1}
        color="grey.300"
        noWrap
        sx={{
          width: "100%",
          flexShrink: 0,
        }}
      >
        {subTitle}
      </Typography>
      {children}
    </StyledCard>
  );
};

export default DetailsCard;
