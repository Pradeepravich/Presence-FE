import { ExpandLess, ExpandMore } from "@mui/icons-material";
import {
  Box,
  Collapse,
  List,
  ListItemButton,
  ListItemText,
  useMediaQuery,
} from "@mui/material";
import { LocationItem as LocationItemType } from "../services/useGetLocationsApi";

interface LocationItemProps {
  location: LocationItemType;
  openState: {
    [key: string]: boolean;
  };
  toggleLocation: (id: string) => void;
  level?: number;
  selectedLocation: number | null;
  onLocationChange: (value: number | null) => void;
}

const LocationItem = ({
  location,
  openState,
  toggleLocation,
  level = 0,
  selectedLocation,
  onLocationChange,
}: LocationItemProps) => {
  const hasChildren = (location?.subLocations || []).length > 0;
  const isOpen = openState[location.id] || false;
  const isLeaf = !hasChildren;
  const isSelected = selectedLocation === location.id;
  const isMobile = useMediaQuery("(max-width:600px)");

  const handleSelect = () => {
    if (isLeaf) {
      onLocationChange(selectedLocation === location.id ? null : location.id);
    } else {
      toggleLocation(location.id.toString());
    }
  };

  return (
    <>
      <ListItemButton
        onClick={handleSelect}
        sx={{
          pl: 2 + level * 2,
          bgcolor: isSelected ? "rgba(79, 195, 247, 0.2)" : "",
          "&:hover": {
            bgcolor: isSelected ? "rgba(79, 195, 247, 0.2)" : "",
          },
        }}
      >
        <Box sx={{ pl: 2 }}>
          {hasChildren && (isOpen ? <ExpandMore /> : <ExpandLess />)}
        </Box>
        <ListItemText
          primary={location.name}
          sx={{ minWidth: "100px" }}
          slotProps={{
            primary: {
              sx: {
                fontSize: 11,
                fontWeight: hasChildren ? 600 : 400,
                pl: hasChildren ? 2 : 4,
              },
            },
          }}
        />
      </ListItemButton>

      {hasChildren && (
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <List
            component="div"
            disablePadding
            sx={
              isMobile
                ? {
                    maxHeight: "150px",
                    overflowY: "auto",
                    minHeight: "100px",
                    width: "100%",
                  }
                : {}
            }
          >
            {location?.subLocations?.map((subLoc: any) => (
              <LocationItem
                key={subLoc?.id}
                location={subLoc}
                openState={openState}
                toggleLocation={toggleLocation}
                selectedLocation={selectedLocation}
                onLocationChange={onLocationChange}
                level={level + 1}
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

export default LocationItem;
