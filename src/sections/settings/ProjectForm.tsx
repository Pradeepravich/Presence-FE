import {
  Stack,
  Typography,
  useTheme,
  TextField,
  styled,
  Box,
  FormControlLabel,
} from "@mui/material";
import { useCallback, useState, useEffect, useMemo } from "react";
import DatePicker from "../../components/design-system/date-range/DatePicker";
import moment, { Moment } from "moment";
import type { Projects } from "../../services/useProjectsApi";
import Search from "../../components/design-system/Search";
import SearchableDropdownWithInfiniteScroll from "../../components/design-system/SearchableDropdownWithInfiniteScroll";
import Drawer from "../../components/design-system/Drawer";
import { useAddProjectsApi } from "../../services/usePostProjectApi";
import { useEditProjectApi } from "../../services/useEditProjectApi";
import { useDeleteProjectApi } from "../../services/useDeleteProjectApi";
import { enqueueSnackbar } from "notistack";
import { useInfiniteScrollUserDropdownApi } from "../../services/useInfiniteScrollUserDropdownApi";
import InfiniteScrollList from "../../components/InfiniteScrollList";
import useConfirm from "../../hooks/useConfirm";
import PopupButton from "../../components/design-system/PopupButton";
import LoadingOverlay from "../../components/design-system/LoadingOverlay";
import useDebouncedCallback from "../../hooks/useDebouncedCallback";
import CustomCheckbox from "../../components/design-system/CheckBox";

interface User {
  id: number;
  name: string;
  profile_picture?: string;
}

interface ProjectFormProps {
  open: boolean;
  onClose: () => void;
  project?: Projects;
  mode: "add" | "edit";
  onSuccess?: () => void;
}

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "4px",
    backgroundColor: theme.palette.grey[600],
    "& fieldset": {
      borderColor: "transparent",
    },
    "&:hover fieldset": {
      borderColor: "transparent",
    },
    "&.Mui-focused fieldset": {
      borderColor: "transparent",
    },
  },
  "& .MuiOutlinedInput-input": {
    padding: "4px 8px",
    fontSize: "12px",
    height: "28px",
  },
}));

const EmployeeList = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "light" ? "#f6f6f6" : "transparent",
  borderRadius: "4px",
  marginTop: "8px",
  overflow: "auto",
  gap: "16px",
  padding: "2px 8px",
}));

const ProjectForm = ({
  open,
  onClose,
  project,
  mode,
  onSuccess,
}: ProjectFormProps) => {
  const theme = useTheme();
  const [name, setName] = useState(project?.name || "");
  const [startDate, setStartDate] = useState<Moment>(
    project?.start_date ? moment(project.start_date) : moment()
  );
  const [endDate, setEndDate] = useState<Moment>(
    project?.end_date ? moment(project.end_date) : moment()
  );
  const [selectedAdmins, setSelectedAdmins] = useState<User[]>(
    project?.admins || []
  );
  const [selectedEmployees, setSelectedEmployees] = useState<User[]>(
    project?.employees || []
  );
  const [, setEmployeeSearch] = useState("");
  const [projectHasChanges, setProjectHasChanges] = useState(false);

  const [employeeDebounceSearch, setEmployeeDebounceSearch] = useState("");
  const [adminDebounceSearch, setAdminDebounceSearch] = useState("");

  const employeedebouncereset = useDebouncedCallback((val: string) => {
    employeeReset();
    setEmployeeDebounceSearch(val);
  }, 400);

  const adminDebouncereset = useDebouncedCallback((val: string) => {
    adminReset();
    setAdminDebounceSearch(val);
  }, 400);

  const adminParams = useMemo(
    () => ({
      query: adminDebounceSearch,
      sort: "name",
      page_size: 30,
      isAll: true,
    }),
    [adminDebounceSearch]
  );

  const employeeParams = useMemo(
    () => ({
      query: employeeDebounceSearch,
      sort: "name",
      page_size: 30,
      isAll: true,
    }),
    [employeeDebounceSearch]
  );

  const {
    data: adminData,
    hasMore: adminHasMore,
    next: adminNext,
    isLoading: adminIsLoading,
    error: adminError,
    reset: adminReset,
  } = useInfiniteScrollUserDropdownApi(adminParams, true);

  const {
    data: employeeData,
    hasMore,
    next,
    isLoading,
    error,
    reset: employeeReset,
  } = useInfiniteScrollUserDropdownApi(employeeParams, true);

  const { CreateProject, isLoading: isCreateLoading } = useAddProjectsApi();
  const { execute: editProject, isLoading: isEditLoading } =
    useEditProjectApi();
  const { deleteProject, isLoading: isDeleteLoading } = useDeleteProjectApi();

  const isFormValid = name.trim() !== "" && startDate !== null;

  useEffect(() => {
    if (mode === "edit" && project) {
      const hasNameChange = name !== project.name;
      const hasStartDateChange = !moment(project.start_date).isSame(
        startDate,
        "day"
      );
      const hasEndDateChange = !moment(project.end_date).isSame(endDate, "day");
      const hasAdminsChange =
        JSON.stringify(selectedAdmins.map((admin) => admin.id).sort()) !==
        JSON.stringify(project.admins.map((admin) => admin.id).sort());
      const hasEmployeesChange =
        JSON.stringify(
          selectedEmployees.map((employee) => employee.id).sort()
        ) !==
        JSON.stringify(project.employees.map((employee) => employee.id).sort());

      setProjectHasChanges(
        hasNameChange ||
          hasStartDateChange ||
          hasEndDateChange ||
          hasAdminsChange ||
          hasEmployeesChange
      );
    }
  }, [
    mode,
    project,
    name,
    startDate,
    endDate,
    selectedAdmins,
    selectedEmployees,
  ]);

  useEffect(() => {
    if (!open) {
      setName("");
      setStartDate(moment());
      setEndDate(moment());
      setSelectedAdmins([]);
      setSelectedEmployees([]);
      setEmployeeSearch("");
      setProjectHasChanges(false);
    } else if (project && mode === "edit") {
      setName(project.name || "");
      setStartDate(project.start_date ? moment(project.start_date) : moment());
      setEndDate(project.end_date ? moment(project.end_date) : moment());
      setSelectedAdmins(project.admins || []);
      setSelectedEmployees(project.employees || []);
      setProjectHasChanges(false);
    }
  }, [open, project, mode]);

  const handleAdminChange = useCallback(
    (selected: { label: string; value: string }[]) => {
      const selectedAdminUsers = selected
        .map((selectedAdmin) => {
          const existingAdmin = selectedAdmins.find(
            (admin) => admin.id.toString() === selectedAdmin.value
          );
          if (existingAdmin) {
            return existingAdmin;
          }
          return adminData.find(
            (admin) => admin.id.toString() === selectedAdmin.value
          );
        })
        .filter(Boolean) as User[];

      setSelectedAdmins(selectedAdminUsers);
    },
    [adminData, selectedAdmins]
  );

  const handleEmployeeToggle = useCallback(
    (employee: User) => {
      const isSelected = selectedEmployees.some((e) => e.id === employee.id);
      if (isSelected) {
        setSelectedEmployees(
          selectedEmployees.filter((e) => e.id !== employee.id)
        );
      } else {
        setSelectedEmployees([...selectedEmployees, employee]);
      }
    },
    [selectedEmployees]
  );

  const handleSubmit = useCallback(async () => {
    try {
      const projectData = {
        name: name.trim(),
        start_date: startDate.format("YYYY-MM-DD"),
        end_date: endDate.format("YYYY-MM-DD"),
        admins: selectedAdmins.map((admin) => admin.id),
        employees: selectedEmployees.map((employee) => employee.id),
      };

      if (mode === "add") {
        await CreateProject(projectData);
        enqueueSnackbar("Project added successfully", { variant: "success" });
      } else if (project?.id) {
        await editProject({
          project_id: project.id.toString(),
          project: projectData,
        });
        enqueueSnackbar("Project edited successfully", { variant: "success" });
      }
      onSuccess?.();
      employeeReset();
      onClose();
      setEmployeeDebounceSearch("");
    } catch (error) {
      console.error(`Failed to ${mode} project:`, error);
      enqueueSnackbar("Something went wrong", { variant: "error" });
    }
  }, [
    mode,
    project,
    name,
    startDate,
    endDate,
    selectedAdmins,
    selectedEmployees,
    employeeReset,
    CreateProject,
    editProject,
    onClose,
    onSuccess,
  ]);

  const { confirm } = useConfirm();

  const ConfirmDeleteContent = () => (
    <>
      <Typography>
        Are you sure you want to delete{" "}
        <Typography fontWeight="bold" display="inline-block">
          {project?.name}?
        </Typography>
      </Typography>
      <Typography mt={2}>
        Deleting this project will permanently remove all associated data and
        cannot be retrieved later
      </Typography>
    </>
  );

  const handleDelete = async () => {
    if (!project?.id) return;

    const deleteconfirmed = await confirm({
      title: "Confirm Delete",
      content: <ConfirmDeleteContent />,
      confirmButtonText: "Yes, Delete",
      confirmColor: "error.main",
      cancelColor: "grey.300",
      cancelButtonText: "No, Cancel",
      width: "400px",
    });
    if (!deleteconfirmed) return;

    try {
      await deleteProject({ projectId: project.id.toString() });
      enqueueSnackbar("Project deleted successfully", { variant: "success" });
      onSuccess?.();
      onClose();
      employeeReset();
      setEmployeeDebounceSearch("");
    } catch (error) {
      console.error("Failed to delete project:", error);
      enqueueSnackbar("Something went wrong", { variant: "error" });
    }
  };

  const handleDateChange = (
    date: Moment | null,
    setter: (date: Moment) => void
  ) => {
    if (date) {
      setter(date);
    }
  };

  const handleClose = useCallback(() => {
    onClose();
    employeeReset();
    setEmployeeDebounceSearch("");
  }, [employeeReset, onClose]);

  const footerContent = (
    <>
      {mode === "edit" ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: mode === "edit" ? "space-between" : "center",
          }}
        >
          <PopupButton
            backgroundColor="#E57373"
            onClick={handleDelete}
            disabled={isDeleteLoading || isEditLoading}
            loading={isDeleteLoading}
            data-testid="projects-addnew-project-delete"
          >
            Delete
          </PopupButton>
          <Stack direction="row" spacing={2}>
            <PopupButton
              onClick={handleSubmit}
              disabled={isEditLoading || !projectHasChanges}
              loading={isEditLoading}
              data-testid="projects-addnew-project-save"
            >
              Save
            </PopupButton>
            <PopupButton
              backgroundColor={theme.palette.grey[300]}
              onClick={handleClose}
              data-testid="projects-addnew-project-cancel"
            >
              Cancel
            </PopupButton>
          </Stack>
        </Box>
      ) : (
        <Box
          sx={{
            justifyContent: mode !== "add" ? "space-between" : "center",
          }}
        >
          <Stack direction="row" spacing={2} justifyContent="center">
            <PopupButton
              onClick={handleSubmit}
              disabled={isCreateLoading || !isFormValid}
              loading={isCreateLoading}
              data-testid="projects-editproject-save"
            >
              Save
            </PopupButton>
            <PopupButton backgroundColor="#A8A8A8" onClick={handleClose} data-testid="projects-editproject-cancel">
              Cancel
            </PopupButton>
          </Stack>
        </Box>
      )}
    </>
  );

  return (
    <Drawer
      title={mode === "add" ? "Add New Project" : "Edit Project"}
      open={open}
      footerContent={footerContent}
      onClose={handleClose}
    >
      <Stack gap={3} px={1}>
        <Stack gap={1}>
          <Typography variant="body1">Project Name</Typography>
          <StyledTextField
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            placeholder="Enter project name"
            size="small"
          />
        </Stack>
        <Stack direction="row" spacing={3} flex={1}>
          <Stack spacing={1} flex={1}>
            <Typography variant="body1">Start Date</Typography>
            <DatePicker
              width="100%"
              value={startDate}
              onChange={(date) => handleDateChange(date, setStartDate)}
              forcedColor={
                theme.palette.mode === "light" ? "#f6f6f6" : "#434247"
              }
              disableFuture={false}
            />
          </Stack>
          <Stack spacing={1} flex={1}>
            <Typography variant="body1">End Date</Typography>
            <DatePicker
              width="100%"
              value={endDate}
              onChange={(date) => handleDateChange(date, setEndDate)}
              forcedColor={
                theme.palette.mode === "light" ? "#f6f6f6" : "#434247"
              }
              disableFuture={false}
            />
          </Stack>
        </Stack>
        <SearchableDropdownWithInfiniteScroll
          label="Project Admin"
          placeholder="Search Project Admin"
          options={
            adminData?.map((admin) => ({
              label: admin.name,
              value: admin.id.toString(),
              disabled: selectedEmployees.some((emp) => emp.id === admin.id),
            })) || []
          }
          selectedOptions={selectedAdmins.map((admin) => ({
            label: admin.name,
            value: admin.id.toString(),
          }))}
          onSelectionChange={handleAdminChange}
          onSearch={(value) => adminDebouncereset(value)}
          hasMore={adminHasMore}
          loadMore={adminNext}
          isLoading={adminIsLoading}
          error={adminError}
          searchInputTestId="add-new-project-admin-search" 
        />
        <Stack gap={1}>
          <Typography variant="body1">
            Employees ({selectedEmployees.length})
          </Typography>
          <Box
            position="relative"
            sx={{
              height: "100%",
              p: 1,
              backgroundColor:
                theme.palette.mode === "light" ? "#f6f6f6" : "#424146",
              borderRadius: "4px",
            }}
          >
            <Box
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 1,
              }}
            >
              <Search
                placeholder="Search Employee"
                onChange={(e) => {
                  employeedebouncereset(e);
                  setEmployeeSearch(e);
                }}
                fullWidth
                backgroundColor="transparent"
                inputTestId="add-new-project-employee-search"
              />
            </Box>
            <EmployeeList>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  maxHeight: "300px",
                  overflowY: "auto",
                  paddingTop: "10px",
                  backgroundColor: "transparent",
                }}
              >
                {isLoading && <LoadingOverlay isLoading={isLoading} />}
                <InfiniteScrollList
                  hasMore={hasMore}
                  loadMore={next}
                  isLoading={isLoading}
                  error={error}
                >
                  {employeeData.map((employee: User) => (
                    <FormControlLabel
                      disabled={selectedAdmins.some(
                        (admin) => admin.id === employee.id
                      )}
                      key={employee.id}
                      sx={{ pl: "8px" }}
                      control={
                        <CustomCheckbox
                          sx={{
                            padding: "5px",
                          }}
                          checked={selectedEmployees.some(
                            (e) => e.id === employee.id
                          )}
                          onChange={() => handleEmployeeToggle(employee)}
                        />
                      }
                      label={employee.name}
                    />
                  ))}
                </InfiniteScrollList>
              </Box>
            </EmployeeList>
          </Box>
        </Stack>
      </Stack>
    </Drawer>
  );
};

export default ProjectForm;
