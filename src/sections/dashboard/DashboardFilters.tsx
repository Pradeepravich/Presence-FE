import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useMemo } from "react";
import FiltersPopup from "./FiltersPopup";
import { SetState } from "../../utils/types";
import { FiltersState } from "../../pages/Dashboard";
import ExpandMoreDownIcon from "../../components/icons/ExpandMoreDownIcon";

interface DashboardFiltersProps {
  filters: FiltersState;
  setFilters: SetState<FiltersState>;
  reset: VoidFunction;
  isFiltersOpen: boolean;
  setFiltersPopupOpen: SetState<boolean>;
}

const DashboardFilters: React.FC<DashboardFiltersProps> = ({
  filters,
  setFilters,
  reset,
  isFiltersOpen = false,
  setFiltersPopupOpen,
}) => {
  const theme = useTheme();

  const appliedFiltersCount = useMemo(() => {
    return (
      (filters.departments.length > 0 ? 1 : 0) +
      (filters.shifts.length > 0 ? 1 : 0) +
      (filters.projects.length > 0 ? 1 : 0) +
      (filters.locations.length > 0 ? 1 : 0)
    );
  }, [
    filters.departments.length,
    filters.locations.length,
    filters.projects.length,
    filters.shifts.length,
  ]);

  return (
    <>
      <Box
        sx={{
          p: 1,
          backgroundColor:
            theme.palette.mode === "light" ? "#ebeff2" : "#212832",
          borderRadius: 1,
          display: "inline-flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 0.5,
          cursor: "pointer",
          height: "33px",
        }}
        onClick={() => setFiltersPopupOpen(true)}
      >
        <Typography
          sx={{
            textAlign: "center",
            color: theme.palette.text.primary,
            fontSize: 10,
            fontFamily: "Sora",
            fontWeight: 400,
            wordWrap: "break-word",
          }}
        >
          Filters {appliedFiltersCount ? `(${appliedFiltersCount})` : ""}
        </Typography>
        <IconButton size="small" sx={{ opacity: 0.8, padding: 0 }} data-testid="timeline-filter">
          <ExpandMoreDownIcon />
        </IconButton>
      </Box>
      {isFiltersOpen ? (
        <FiltersPopup
          open={isFiltersOpen}
          onClose={() => setFiltersPopupOpen(false)}
          filters={filters}
          setFilters={setFilters}
          reset={reset}
        />
      ) : (
        ""
      )}
    </>
  );
};

export default DashboardFilters;
