import {
  Avatar,
  AvatarGroup,
  Box,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import TabNavbar from "../../components/design-system/TabNavbar";
import type { Projects } from "../../services/useProjectsApi";
import useProjectsApi from "../../services/useProjectsApi";
import DetailsCard from "../../components/DetailsCard";
import { formatDate } from "../../utils/format";
import ProjectForm from "./ProjectForm";
import CardComponent from "../../components/design-system/Card";
import InfiniteScrollList from "../../components/InfiniteScrollList";

const Projects = () => {
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<
    Projects | undefined
  >();
  const [formMode, setFormMode] = useState<"add" | "edit">("add");

  const ProjectsApiParams = useMemo(
    () => ({
      page_size: 10,
      search,
    }),
    [search]
  );
  const theme = useTheme();

  const { data, error, hasMore, isLoading, next, reset } =
    useProjectsApi(ProjectsApiParams);

  const handleSearch = (value: string) => {
    setSearch(value);
    reset();
  };

  const handleAddNew = useCallback(() => {
    setFormMode("add");
    setSelectedProject(undefined);
    setIsFormOpen(true);
  }, []);

  const handleEdit = useCallback((project: Projects) => {
    setFormMode("edit");
    setSelectedProject(project);
    setIsFormOpen(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false);
    setSelectedProject(undefined);
    reset();
  }, [reset]);

  return (
    <CardComponent
      sx={{
        height: "calc(100vh - 150px)",
        overflowY: "auto",
      }}
      isLoading={isLoading}
    >
      <TabNavbar
        title="Projects"
        onSearch={handleSearch}
        searchPlaceholder="Search projects..."
        onClick={handleAddNew}
      />
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          mt: 2,
        }}
      >
        <InfiniteScrollList
          hasMore={hasMore}
          loadMore={next}
          isLoading={isLoading}
          error={error}
        >
          {data?.length === 0 && !isLoading ? (
            <Typography
              variant="body1"
              sx={{ gridColumn: "1/-1", textAlign: "center", py: 4 }}
            >
              No results found
            </Typography>
          ) : (
            data?.map((project) => {
              const { admins, employees } = project;

              return (
                <DetailsCard
                  title={project.name}
                  subTitle={`${formatDate(project?.start_date)} - ${formatDate(
                    project?.end_date
                  )}`}
                  key={project.id}
                  onEdit={() => handleEdit(project)}
                  editTestId={`project-edit-${project.id}`} 
                >
                  <Stack direction="column">
                    <Typography variant="body1">
                      {admins.length === 1
                        ? admins[0].name
                        : admins.length > 1
                        ? `${admins[0].name} & ${admins.length - 1} more`
                        : "No managers assigned"}
                    </Typography>
                    <Stack alignItems="flex-start" mt={2}>
                      <AvatarGroup
                        total={employees.length}
                        max={8}
                        slotProps={{
                          surplus: {
                            sx: {
                              width: 32,
                              height: 32,
                              fontSize: 12,
                              color: "common.black",
                            },
                          },
                        }}
                      >
                        {employees.map((emp) => (
                          <Tooltip title={
                            <Typography
                              sx={{
                                color: theme.palette.text.primary,
                              }}
                            >
                              {emp.name}
                            </Typography>
                          } key={emp.name}>
                            <Avatar
                              alt={emp.name}
                              src={emp?.profile_picture}
                              sx={{
                                width: 32,
                                height: 32,
                                ":hover": { zIndex: 2,
                                 },
                              }}
                            />
                          </Tooltip>
                        ))}
                      </AvatarGroup>
                    </Stack>
                  </Stack>
                </DetailsCard>
              );
            })
          )}
        </InfiniteScrollList>
      </Box>
      <ProjectForm
        open={isFormOpen}
        onClose={handleCloseForm}
        project={selectedProject}
        mode={formMode}
        onSuccess={reset}
      />
    </CardComponent>
  );
};

export default Projects;
