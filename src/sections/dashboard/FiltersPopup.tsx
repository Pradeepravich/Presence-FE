import { useCallback, useEffect, useState } from "react";
import { useDepartmentsApi } from "../../services/useDepartmentsApi";
import { useGetShiftsApi } from "../../services/useGetShiftsApi";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Box,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Typography,
  Divider,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import useGetLocationsApi from "../../services/useGetLocationsApi";
import { SetState } from "../../utils/types";
import { useAllProjectsApi } from "../../services/useAllProjectsApi";
import { getExtremeChildren } from "../../utils/LinearToTreeArrayFormat";
import { FiltersOption, FiltersState } from "../../pages/Dashboard";
import { isEqual } from "lodash";
import CheckBox from "../../components/design-system/CheckBox";

const categories = ["Departments", "Shifts", "Projects", "Locations"] as const;

interface FiltersPopupProps {
  open: boolean;
  onClose: () => void;
  filters: FiltersState;
  setFilters: SetState<FiltersState>;
  reset: VoidFunction;
}

const FiltersPopup: React.FC<FiltersPopupProps> = ({
  open,
  onClose,
  filters,
  setFilters,
  reset,
}) => {
  const theme = useTheme();
  const [activeCategory, setActiveCategory] = useState("Departments");
  const [localFilters, setLocalFilters] = useState<FiltersState>(filters);
  const [defaultFilters, setDefaultFilters] = useState<FiltersState>(filters);

  useEffect(() => {
    if (open) {
      setLocalFilters(filters);
      setDefaultFilters(filters);
      setActiveCategory("Departments");
    }
  }, [open, filters]);

  const { departments } = useDepartmentsApi();
  const { locations, areLocationsLoading } = useGetLocationsApi();
  const { value: shifts } = useGetShiftsApi({});
  const { value: projects } = useAllProjectsApi(true);

  const noChildLocations = getExtremeChildren(locations || []);
  const noChanges = isEqual(defaultFilters, localFilters);

  const handleToggle = useCallback(
    (option: FiltersOption, key: string, allOptions: FiltersOption[]) => {
      setLocalFilters((prev) => {
        const prevSelected = prev[key as keyof FiltersState];
        const allOption = allOptions[0];
        const isAllSelected = prevSelected.length === allOptions.length;
        const isOptionSelected = prevSelected.some((o) => o.id === option.id);

        if (option.id === allOption.id) {
          return {
            ...prev,
            [key]: isOptionSelected ? [] : allOptions,
          };
        }

        if (isAllSelected && isOptionSelected) {
          return {
            ...prev,
            [key]: allOptions.filter(
              (opt) => opt.id !== option.id && opt.id !== allOption.id
            ),
          };
        }

        const newState = isOptionSelected
          ? prevSelected.filter((item) => item.id !== option.id)
          : [
              ...prevSelected.filter((item) => item.id !== allOption.id),
              option,
            ];

        const nonAllOptions = allOptions.filter(
          (opt) => opt.id !== allOption.id
        );

        if (newState.length === nonAllOptions.length) {
          return {
            ...prev,
            [key]: allOptions,
          };
        }

        return {
          ...prev,
          [key]: newState,
        };
      });
    },
    []
  );

  const getOptions = useCallback(() => {
    switch (activeCategory) {
      case "Departments":
        return {
          options: [
            { label: "All Departments", id: "0" },
            ...(departments?.map((d) => ({ label: d, id: d })) || []),
          ],
          state: localFilters.departments,
        };
      case "Shifts":
        return {
          options: [
            { label: "All Shifts", id: "0" },
            ...(shifts?.map((shift) => ({
              label: shift.name,
              id: shift.id.toString(),
            })) || []),
          ],
          state: localFilters.shifts,
        };
      case "Projects":
        return {
          options: [
            { label: "All Projects", id: "0" },
            ...(projects?.map((project) => ({
              label: project.name,
              id: project.id.toString(),
            })) || []),
          ],
          state: localFilters.projects,
        };
      case "Locations":
        return {
          options: [
            { label: "All Locations", id: "0" },
            ...(noChildLocations?.map((location) => ({
              label: location.name,
              id: location.id.toString(),
            })) || []),
          ],
          state: localFilters.locations,
        };
      default:
        return { options: [], state: [] };
    }
  }, [
    activeCategory,
    departments,
    shifts,
    projects,
    noChildLocations,
    localFilters,
  ]);

  const { options, state } = getOptions();

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        p={1}
        pl={3}
        bgcolor={theme.palette.mode === "light" ? "#EEEEEE" : "#0f1515"}
      >
        <Typography variant="h6" sx={{ fontSize: "16px", fontWeight: 600 }}>
          Filters
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />

      <DialogContent
        sx={{
          display: "flex",
          height: "400px",
          p: 0,
          backgroundColor:
            theme.palette.mode === "light" ? "#ffffff" : "#2f3032",
        }}
      >
        <List
          sx={{
            width: "30%",
            backgroundColor:
              theme.palette.mode === "light"
                ? "#ECF6FF"
                : "rgba(50, 130, 184, 0.1)",
            p: 0,
            pt: 3,
          }}
        >
          {categories.map((category) => (
            <ListItem key={category} disablePadding>
              <ListItemButton
                selected={activeCategory === category}
                onClick={() => setActiveCategory(category)}
                sx={{
                  position: "relative",
                  "&.Mui-selected": {
                    backgroundColor:
                      theme.palette.mode === "light" ? "#FFFFFF" : "#2a333a",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: "4px",
                      backgroundColor: "#4FC3F7",
                    },
                  },
                  "&.Mui-selected:hover": {
                    backgroundColor:
                      theme.palette.mode === "light" ? "#F5F5F5" : "#39454f",
                  },
                  pl: 3,
                }}
              >
                <ListItemText
                  primary={category}
                  slotProps={{
                    primary: {
                      sx: {
                        fontSize: "14px",
                        fontWeight: 500,
                      },
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Box sx={{ flexGrow: 1, p: 2, maxHeight: 400, overflowY: "auto" }}>
          {areLocationsLoading ? (
            <Typography>Loading...</Typography>
          ) : (
            <List>
              {options?.map((option) => (
                <ListItem key={option.id} disablePadding>
                  <ListItemButton
                    onClick={() =>
                      handleToggle(
                        option,
                        activeCategory.toLowerCase(),
                        options
                      )
                    }
                    sx={{ p: "0px" }}
                  >
                    <CheckBox
                      checked={
                        state.find((o) => o.id === option.id) !== undefined
                      }
                    />
                    <ListItemText
                      primary={option.label}
                      slotProps={{
                        primary: {
                          sx: {
                            fontWeight: "bold",
                          },
                        },
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          justifyContent: "center",
          p: 2,
          backgroundColor:
            theme.palette.mode === "light" ? "#ffffff" : "#2f3032",
        }}
      >
        <Button
          variant="contained"
          data-testid="timeline-filter-popup-save"
          color="primary"
          onClick={() => {
            setFilters(localFilters);
            onClose();
            reset();
          }}
          disabled={noChanges}
          sx={{ width: "80px", height: "30px" }}
        >
          Save
        </Button>
        <Button
          onClick={onClose}
          variant="contained"
          data-testid="timeline-filter-popup-cancel"
          sx={{
            width: "80px",
            height: "30px",
            backgroundColor: "#A8A8A8",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#909090",
            },
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FiltersPopup;
