import { useCallback, useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Stack,
  Typography,
  styled,
  Chip,
  useTheme,
} from "@mui/material";
import { useEditUserApi } from "../../services/useEditUserApi";
import useUsersApi, {
  User,
  UsersRequestParams,
} from "../../services/useUsersApi";
import { useSyncUsersApi } from "../../services/useSyncUsersApi";
import { enqueueSnackbar } from "notistack";
import GridTable, { Column } from "../../components/design-system/GridTable";
import UserToggle from "./UserToggle";
import Search from "../../components/design-system/Search";
import { Sync, Cancel, CheckCircleOutline } from "@mui/icons-material";
import Dropdown from "../../components/design-system/Dropdown";
import EditIcon from "../../components/icons/EditIcon";
import { IconButtonBase } from "../../components/LayoutComponent";
import { useNavigate } from "react-router-dom";
import { projectsDropdownProps } from "../../utils/types";
import { getExtremeChildren } from "../../utils/LinearToTreeArrayFormat";
import { APP_PATHS } from "../../utils/constants";

import AutocompleteMultiple from "../../components/design-system/AutoCompleteMultiple";
import { useEditProjectsApi } from "../../services/useEditProjectsApi";
import LocationsSection from "./LocationsSection";
import CardComponent from "../../components/design-system/Card";
import { useAllProjectsApi } from "../../services/useAllProjectsApi";
import useGetLocationsApi from "../../services/useGetLocationsApi";

const ProjectChip = styled(Chip)(() => ({
  height: "17px",
  width: "70px",
  borderRadius: "4px",
  backgroundColor: "rgba(3, 155, 229, 0.16)",
  "& .MuiChip-label": {
    padding: "2px 4px",
  },
  fontSize: "10px",
  fontWeight: 400,
}));

const SettingsEmployeeTable = () => {
  const [orderBy, setOrderBy] = useState<keyof User>("name");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [searchName, setSearchName] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
  const [projectSearch, setProjectSearch] = useState("");
  const [userId, setUserId] = useState<number | null>(null);

  const { locations, areLocationsLoading } = useGetLocationsApi();
  const { execute: editUser } = useEditUserApi();

  const UsersApiParams: UsersRequestParams = useMemo(
    () => ({
      page_size: 20,
      name: searchName,
      sort: `${order === "asc" ? "" : "-"}${orderBy}`,
      ...(selectedLocation ? { location_id: selectedLocation } : {}),
    }),
    [order, orderBy, searchName, selectedLocation]
  );

  const { value: projects } = useAllProjectsApi(false);

  const [selectedProjects, setSelectedProjects] = useState<
    projectsDropdownProps[]
  >([]);

  const projectDropdownOptions: projectsDropdownProps[] = useMemo(() => {
    return (
      projects?.map((po) => {
        const matchingOption = selectedProjects.find(
          (option) => option.value === `${po.id}`
        );

        return {
          value: `${po.id}`,
          label: po.name,
          disabled: matchingOption?.role === "Admin",
        };
      }) || []
    );
  }, [projects, selectedProjects]);

  const handleProjectChange = (userData: User) => {
    if (userData.id === userId) {
      setUserId(null);
      setSelectedProjects([]);
      return;
    }
    setUserId(userData.id);
    const projectsSelected = userData.active_projects.map((project) => ({
      value: `${project.id}`,
      label: project.name,
      role: project.role,
      disabled: project.role === "Admin",
    }));
    setSelectedProjects(projectsSelected);
  };

  const { execute: editProjects } = useEditProjectsApi();

  const changeProjects = async () => {
    const data = {
      user_id: userId || 0,
      projects: selectedProjects.map((project) => ({
        project_id: parseInt(project.value),
        role: "Employee",
      })),
    };
    const value = await editProjects(data);
    enqueueSnackbar(value?.message, { variant: "success" });
    setUserId(null);
    setSelectedProjects([]);
    reset();
  };

  const {
    isLoading: usersLoading,
    data,
    error,
    hasMore,
    next,
    reset,
    setData,
  } = useUsersApi(UsersApiParams);

  const updateData = useCallback(
    (resData: User) => {
      const newData = data.map((user) =>
        user.id === resData.id ? resData : user
      );
      setData(newData);
    },
    [data, setData]
  );

  const { execute: syncUsers, isLoading: isSyncLoading } = useSyncUsersApi();

  const handleSort = (column: keyof User) => {
    if (orderBy === column) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setOrderBy(column);
      setOrder("asc");
    }
    reset();
  };

  const handleSync = async () => {
    try {
      const value = await syncUsers();
      if (value?.status === "success") {
        reset();
        enqueueSnackbar(value?.message, { variant: "success" });
      }
    } catch {
      enqueueSnackbar("Something went wrong", { variant: "error" });
    }
  };

  const handleLocationChange = async (userId: number, value: string) => {
    try {
      const res: any = await editUser({
        id: userId.toString(),
        user: {
          ...((value ? { location_id: +value } : {}) as any),
        },
      });
      updateData(res);
      enqueueSnackbar("Location updated successfully", { variant: "success" });
    } catch {
      enqueueSnackbar("Failed to update location", { variant: "error" });
    }
  };

  const navigate = useNavigate();

  const officeLocations = getExtremeChildren(locations || []);

  const dropdownOptions = officeLocations.map((lo) => ({
    value: `${lo.id}`,
    label: lo.name,
  }));

  const theme = useTheme();

  const columns: Column<User>[] = [
    {
      field: "name",
      title: "Employee Name",
      sortable: true,
      width: 300,
      component: (row) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Avatar
            src={row.profile_picture}
            alt={row.display_name}
            sx={{ width: 20, height: 20, borderRadius: "500px" }}
          />
          <Typography variant="body2">{row.display_name}</Typography>
        </Box>
      ),
    },
    {
      field: "location",
      title: "Location",
      sortable: false,
      width: 150,
      component: (row) => (
        <Box width="150px">
          <Dropdown
            options={dropdownOptions}
            value={(row?.location?.id || "").toString()}
            onChange={(value) => handleLocationChange(row.id, value)}
            testId={`location-dropdown-${row.id}`}
            fullWidth
            forceBackgroundColor={
              theme.palette.mode === "light" ? "#ececec" : "#424247"
            }
            placeholder="Select Location"
          />
        </Box>
      ),
    },
    {
      field: "current_shift",
      title: "Current Shift",
      sortable: false,
      width: 160,
      component: (row) => (
        <Stack direction="row" alignItems="center">
          <Typography variant="body2">
            {row.current_shift?.name ?? "Not Set"}
          </Typography>
          <IconButtonBase
            onClick={() => navigate(APP_PATHS.shiftsTab("employee-shifts"))}
          >
            <EditIcon />
          </IconButtonBase>
        </Stack>
      ),
    },
    {
      field: "active_projects",
      title: "Active Projects",
      sortable: false,
      width: 300,
      component: (row) => (
        <Stack direction="row" alignItems="center">
          {row.id !== userId ? (
            <Stack direction="row" gap={1} flexWrap="wrap">
              {row.active_projects?.length > 0 ? (
                row.active_projects?.map((project) => (
                  <ProjectChip
                    key={project.id}
                    label={project.name}
                    size="small"
                  />
                ))
              ) : (
                <Typography
                  padding="2px 4px"
                  bgcolor="customColors.200"
                  color="#000000"
                  borderRadius={1}
                >
                  None
                </Typography>
              )}
            </Stack>
          ) : (
            <>
              <AutocompleteMultiple
                options={projectDropdownOptions}
                selectedOptions={selectedProjects}
                inputValue={projectSearch}
                setInputValue={setProjectSearch}
                placeholder="Select Projects"
                onChange={(val) => {
                  setSelectedProjects(val);
                }}
              />
              <IconButtonBase onClick={changeProjects}>
                <CheckCircleOutline fontSize="inherit" color="success" />
              </IconButtonBase>
            </>
          )}
          <IconButtonBase onClick={() => handleProjectChange(row)}>
            {row.id !== userId ? (
              <EditIcon />
            ) : (
              <Cancel fontSize="inherit" color="error" />
            )}
          </IconButtonBase>
        </Stack>
      ),
    },
    {
      field: "is_admin",
      title: "Admin Access",
      sortable: true,
      width: 200,
      component: (row) => (
        <UserToggle
          user={row}
          field="is_admin"
          editUser={editUser}
          testId={`settings-isadmin-enabled-${row.id}`}
          updateData={updateData}
        />
      ),
    },
    {
      field: "presence_enabled",
      title: "Show in Presence",
      sortable: true,
      width: 200,
      component: (row) => (
        <UserToggle
          user={row}
          field="presence_enabled"
          editUser={editUser}
          testId={`settings-presence-enabled-${row.id}`}
          updateData={updateData}
        />
      ),
    },
  ];

  const handleSelectedLocationChange = useCallback(
    (value: number | null) => {
      setSelectedLocation(value);
      reset();
    },
    [reset]
  );

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      sx={{
        gap: 2,
        height: { xs: "auto", md: "calc(100vh - 170px)" },
      }}
    >
      <LocationsSection
        locations={locations || []}
        isLocationsLoading={areLocationsLoading}
        selectedLocation={selectedLocation}
        onLocationChange={handleSelectedLocationChange}
      />
      <CardComponent
        sx={{
          width: "100%",
          px: { xs: 1, md: 0 },
          pb: "0px !important",
        }}
        isLoading={usersLoading || isSyncLoading}
      >
        <Stack direction="column" spacing="20px">
          <Stack
            direction={{ xs: "column", md: "row" }}
            alignItems={{ xs: "flex-start", md: "center" }}
            gap={2}
            sx={{ px: 2, mb: 3 }}
          >
            <Stack direction="row" gap={2} alignItems="center">
              <Typography variant="h5">Employees</Typography>
              <Button
                variant="contained"
                startIcon={<Sync sx={{ width: "12px", height: "12px" }} />}
                onClick={handleSync}
                size="small"
                disabled={isSyncLoading || usersLoading}
                data-testid="settings-sync"
              >
                Sync
              </Button>
            </Stack>
            <Search
              onChange={(val) => {
                setSearchName(val);
                reset();
              }}
              placeholder="Search Employee..."
            />
          </Stack>
          <GridTable
            sx={{ maxHeight: { xs: "auto", md: "calc(100vh - 250px)" } }}
            columns={columns}
            data={data}
            error={error}
            hasMore={hasMore}
            handleSort={handleSort}
            orderBy={orderBy}
            order={order}
            loadMore={next}
            setOrder={setOrder}
            setOrderBy={setOrderBy}
          />
        </Stack>
      </CardComponent>
    </Stack>
  );
};

export default SettingsEmployeeTable;
