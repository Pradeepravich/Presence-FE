import { Stack, Typography, Button, useTheme, Box } from "@mui/material";
import Search from "./Search";
import AddIcon from "../icons/AddIcon";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

interface TabNavbarProps {
  title: string;
  onSearch?: (value: string) => void;
  searchPlaceholder?: string;
  onClick?: () => void;
}

const TabNavbar = ({
  title,
  onSearch,
  searchPlaceholder = "Search",
  onClick,
}: TabNavbarProps) => {
  const theme = useTheme();
  const { user } = useSelector((state: RootState) => state.auth);
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      mb={1}
    >
      <Stack direction="row" gap={"20px"} alignItems="center">
        <Typography variant="h5" fontWeight="600">
          {title}
        </Typography>
        <Search
          onChange={onSearch || (() => {})}
          placeholder={searchPlaceholder}
        />
      </Stack>
      {user?.is_admin && (
        <Button
          variant="contained"
          data-testid="settings-shifts-add-new"
          color="primary"
          startIcon={
            <Box
              component="span"
              display="flex"
              alignItems="center"
              justifyContent="center"
              sx={{mt: "-2px"}}
            >
              <AddIcon/>
            </Box>
          }
          onClick={onClick}
          sx={{
            height: "29px",
            minHeight: "29px",
            textTransform: "none",
            color:
              theme.palette.mode === "light"
                ? theme.palette.common.white
                : "white",
            "& .MuiButton-startIcon": {
              marginRight: "4px",
            },
          }}
        >
          Add New
        </Button>
      )}
    </Stack>
  );
};

export default TabNavbar;
