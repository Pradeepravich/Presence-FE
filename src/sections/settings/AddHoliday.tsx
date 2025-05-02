import { Box, useTheme } from "@mui/material";
import Button from "../../components/design-system/Button";
import AddIcon from "../../components/icons/AddIcon";
// import AddIcon from "@mui/icons-material/Add";

interface AddHolidayProps {
  onClick: () => void;
}

const AddHoliday = ({ onClick }: AddHolidayProps) => {
  const theme = useTheme();
  return (
    <Button
      text={"Add New"}
      data-testid="settings-holidays-add-new"
      startIcon={
        <Box
          component="span"
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{ mt: "-2px" }}
        >
          <AddIcon />
        </Box>
      }
      sx={{
        bgcolor: "rgba(3, 155, 229, 1)",
        "&:hover": { bgcolor: "rgb(81 179 227)" },
        color: theme.palette.common.white,
        "& .MuiButton-startIcon": {
          marginRight: "4px",
        },
      }}
      onClick={onClick}
    />
  );
};

export default AddHoliday;
