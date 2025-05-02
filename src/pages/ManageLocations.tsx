import { Box, Stack, Typography } from "@mui/material";
import LayoutComponent, { IconButtonBase } from "../components/LayoutComponent";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useNavigate } from "react-router-dom";
import { LocationEditor } from "../sections/manage-locations/LocationEditor";
import useGetLocationsApi from "../services/useGetLocationsApi";

const ManageLocations = () => {
  const navigate = useNavigate();
  const { locations, refresh } = useGetLocationsApi();

  return (
    <LayoutComponent>
      <Box component="section" p={3}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <IconButtonBase onClick={() => navigate(-1)}>
            <KeyboardBackspaceIcon />
          </IconButtonBase>
          <Typography variant="h4">Manage Locations</Typography>
        </Stack>
        <LocationEditor locations={locations || []} refresh={refresh} />
      </Box>
    </LayoutComponent>
  );
};

export default ManageLocations;
