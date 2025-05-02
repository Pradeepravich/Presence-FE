import { Settings, ExpandMore, ExpandLess } from "@mui/icons-material";
import {
  Card,
  Box,
  Typography,
  IconButton,
  Divider,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import LocationItem from "../../components/LocationItem";
import { useState } from "react";
import { buildTree } from "../../utils/LinearToTreeArrayFormat";
import { LocationProps } from "../../utils/types";
import Link from "../../components/design-system/Link";
import { APP_PATHS } from "../../utils/constants";

interface props extends LocationProps {
  selectedLocation: number | null;
  onLocationChange: (value: number | null) => void;
}
const LocationsSection = ({
  locations,
  isLocationsLoading,
  selectedLocation,
  onLocationChange,
}: props) => {
  const [open, setOpen] = useState<{ [key: string]: boolean }>({});
  const [expandAll, setExpandAll] = useState(false);

  const nestedLocations = buildTree(locations);
  const toggleLocation = (id: string) => {
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleAll = () => {
    setExpandAll((prev) => {
      const newExpandState = !prev;
      const updatedState = Object.fromEntries(
        nestedLocations.map((loc) => [loc.id.toString(), newExpandState])
      );
      setOpen(updatedState);
      return newExpandState;
    });
  };

  return (
    <Card sx={{ 
      width: {
        xs: "100%",
        md: "250px",
      }, 
      borderRadius: "8px" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          px: 2.5,
          py: 1,
        }}
      >
        <Typography variant="h5" sx={{ flexGrow: 1 }}>
          Location
        </Typography>
        <Link to={APP_PATHS.manageLocations}>
          <IconButton size="small">
            <Settings sx={{ fontSize: "16px" }} />
          </IconButton>
        </Link>
      </Box>
      <Divider />

      <List
        sx={{
          maxHeight: "calc(100vh - 250px)",
          overflowY: "auto",
          overflowX: "auto",
          whiteSpace: "nowrap",
        }}
      >
        <ListItemButton onClick={toggleAll}>
          {expandAll ? <ExpandMore /> : <ExpandLess />}
          <ListItemText
            primary="ALL"
            slotProps={{
              primary: { sx: { fontSize: 11, fontWeight: 600, pl: 1 } },
            }}
          />
        </ListItemButton>

        {isLocationsLoading ? (
          <Typography textAlign="center" m={2}>
            Loading...
          </Typography>
        ) : (
          <Box
            sx={{ overflowX: "auto", display: "flex", flexDirection: "column" }}
          >
            {nestedLocations.map((location) => (
              <LocationItem
                key={location.id}
                location={location}
                openState={open}
                toggleLocation={toggleLocation}
                selectedLocation={selectedLocation}
                onLocationChange={onLocationChange}
              />
            ))}
          </Box>
        )}
      </List>
    </Card>
  );
};

export default LocationsSection;
