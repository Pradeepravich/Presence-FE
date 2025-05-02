import React, { useState, useMemo } from "react";
import { Box, Typography, Chip, Stack, Switch } from "@mui/material";
import EditIcon from "../../components/icons/EditIcon";
import Search from "../../components/design-system/Search";
import GridTable, { Column } from "../../components/design-system/GridTable";
import useGetHolidaysApi, {
  Holidays,
  HolidaysRequestParams,
} from "../../services/useGetHolidaysApi";
import { enqueueSnackbar } from "notistack";
import { useUpdateHolidayApi } from "../../services/useUpdateHolidayApi";
import AddHoliday from "./AddHoliday";
import HolidayForm from "./AddNewHoliday";
import moment from "moment";
import LocationsSection from "./LocationsSection";
import useGetLocationsApi from "../../services/useGetLocationsApi";
import CardComponent from "../../components/design-system/Card";
import { ButtonBase } from "../../components/DetailsCard";

const HolidaysContent: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [selectedHoliday, setSelectedHoliday] = useState<
    Holidays | undefined
  >();
  const [searchTerm, setSearchTerm] = useState("");
  const [orderBy, setOrderBy] = useState<keyof Holidays>("start_date");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);

  const HolidaysApiParams: HolidaysRequestParams = useMemo(
    () => ({
      search: searchTerm,
      page_size: 10,
      ordering: order === "asc" ? orderBy : `-${orderBy}`,
      ...(selectedLocation && { location_id: selectedLocation }),
    }),
    [order, orderBy, searchTerm, selectedLocation]
  );

  const { data, error, hasMore, next, reset, isLoading } =
    useGetHolidaysApi(HolidaysApiParams);
  const { areLocationsLoading, locations } = useGetLocationsApi();

  const { execute: editHoliday } = useUpdateHolidayApi();

  const handleEdit = (row: Holidays) => {
    setSelectedHoliday(row);
    setFormMode("edit");
    setIsFormOpen(true);
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setSelectedHoliday(undefined);
    setFormMode("add");
  };

  const handleSort = (column: keyof Holidays) => {
    if (orderBy === column) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setOrderBy(column);
      setOrder("asc");
    }
    reset();
  };

  const handleHoliday = async (row: Holidays) => {
    const newStatus = !row.is_active;
    try {
      await editHoliday({
        holiday_id: row.id,
        holiday: {
          ...row,
          locations: row?.locations.map((loc) => loc.id),
          shifts: row?.shifts.map((shift) => shift.id),
          is_active: newStatus,
        },
      });
      enqueueSnackbar("Updated Successfully.", {
        variant: "success",
      });
      reset();
    } catch (error) {
      console.error(error);
      enqueueSnackbar("An error occurred", { variant: "error" });
    }
  };

  const handleSearch = (val: string) => {
    setSearchTerm(val);
    reset();
  };

  const handleFormSuccess = async () => {
    reset();
    handleClose();
  };

  const columns: Column<Holidays>[] = [
    {
      field: "name",
      title: "Holiday",
      sortable: true,
    },
    {
      field: "start_date",
      title: "Date",
      sortable: true,
      width: 150,
      component: (row: Holidays) => {
        const startDate = moment(row.start_date, "YYYY-MM-DD");
        const endDate = moment(row.end_date, "YYYY-MM-DD");
        return (
          <Typography variant="body2">
            {startDate.isSame(endDate, "day")
              ? startDate.format("DD MMM YYYY")
              : `${startDate.format("DD")}-${endDate.format("DD MMM YYYY")}`}
          </Typography>
        );
      },
    },
    {
      field: "locations",
      title: "Locations",
      sortable: false,
      component: (row: Holidays) => (
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {row.locations.map((location, index) => (
            <Chip
              key={index}
              label={location.name}
              size="small"
              sx={{
                bgcolor: "rgba(3, 155, 229, 0.16)",
                borderRadius: "4px",
                fontSize: "8px",
              }}
            />
          ))}
        </Stack>
      ),
    },
    {
      field: "shifts",
      title: "Shifts",
      sortable: false,
      component: (row: Holidays) => (
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {row.shifts.map((shift, index) => (
            <Chip
              key={index}
              label={shift.name}
              size="small"
              sx={{
                bgcolor: "rgba(3, 155, 229, 0.16)",
                borderRadius: "4px",
                fontSize: "8px",
              }}
            />
          ))}
        </Stack>
      ),
    },
    {
      field: "is_active",
      title: "Active",
      sortable: true,
      component: (row: Holidays) => (
        <Switch
          checked={row?.is_active}
          onChange={() => handleHoliday(row)}
          color="primary"
          size="small"
        />
      ),
    },
    {
      field: "id",
      title: "Action",
      sortable: false,
      width: 100,
      component: (row: Holidays) => (
        <ButtonBase onClick={() => handleEdit(row)}>
          <Box
            sx={{
              color: "common.black",
              fontSize: "8px",
              height: "16px",
              width: "16px",
            }}
          >
            <EditIcon />
          </Box>
        </ButtonBase>
      ),
    },
  ];

  const handleAddNewClick = () => {
    setFormMode("add");
    setSelectedHoliday(undefined);
    setIsFormOpen(true);
  };

  return (
    <Stack direction="row" sx={{ gap: 2 }}>
      <LocationsSection
        locations={locations || []}
        isLocationsLoading={areLocationsLoading}
        selectedLocation={selectedLocation}
        onLocationChange={(v) => {
          setSelectedLocation(v);
          reset();
        }}
      />
      <Box width="100%">
        <CardComponent
          sx={{ px: 0, pb: "0px !important", height: "calc(100vh - 170px)" }}
          isLoading={isLoading}
        >
          <Stack
            direction="row"
            spacing={"20px"}
            justifyContent="space-between"
            alignItems="center"
            sx={{ px: 2, mb: 3 }}
          >
            <Stack direction="row" spacing={"20px"} alignItems="center">
              <Typography variant="h5" fontWeight="600">
                Holidays
              </Typography>
              <Search
                placeholder="Search"
                onChange={(val) => handleSearch(val)}
              />
            </Stack>
            <AddHoliday onClick={handleAddNewClick} />
            <HolidayForm
              open={isFormOpen}
              onClose={handleClose}
              mode={formMode}
              onSuccess={handleFormSuccess}
              holiday={
                selectedHoliday
                  ? {
                      id: selectedHoliday.id,
                      name: selectedHoliday.name,
                      start_date:
                        selectedHoliday.start_date ||
                        moment().format("YYYY-MM-DD"),
                      end_date:
                        selectedHoliday.end_date ||
                        moment().format("YYYY-MM-DD"),
                      locations: selectedHoliday.locations,
                      shifts: selectedHoliday.shifts,
                    }
                  : undefined
              }
            />
          </Stack>
          <GridTable<Holidays>
            columns={columns}
            orderBy={orderBy}
            setOrderBy={setOrderBy}
            order={order}
            setOrder={setOrder}
            handleSort={handleSort}
            data={data}
            sx={{ maxHeight: "calc(100vh - 310px)" }}
            hasMore={hasMore}
            loadMore={next}
            error={error}
          />
        </CardComponent>
      </Box>
    </Stack>
  );
};

export default HolidaysContent;
