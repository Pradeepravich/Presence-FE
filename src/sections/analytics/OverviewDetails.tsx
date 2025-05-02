import {
  Typography,
  Stack,
  Avatar,
  styled,
  Button,
  Badge,
  Box,
  List,
  ListItem,
} from "@mui/material";
import CardComponent from "../../components/design-system/Card";
import AvatarWithStatus from "../../components/AvatarWithStatus";
import PhoneIcon from "../../components/icons/PhoneIcon";
import EmailIcon from "../../components/icons/EmailIcon";
import PersonIcon from "../../components/icons/PersonIcon";
import LocationMapIcon from "../../components/icons/LocationMapIcon";
import LocationIcon from "../../components/icons/LocationIcon";
import { Employee } from "../../services/useAnalyticsApi";
import { useNavigate } from "react-router-dom";
import { APP_PATHS, statusIcons } from "../../utils/constants";
import { formatTime } from "../../utils/format";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { AnalyticUserData } from "../../utils/types";

const BorderStack = styled(Stack)({
  paddingTop: 16,
  paddingBottom: 16,
  borderTop: "1px solid #F1F1F1",
  borderBottom: "1px solid #F1F1F1",
  marginTop: 16,
  marginBottom: 16,
  gap: 16,
});

const BorderLine = styled(Box)(() => ({
  paddingBottom: 16,
  borderBottom: "1px solid #F1F1F1",
  marginTop: 16,
  marginBottom: 16,
}));

export interface OverviewDetailsProps {
  user: AnalyticUserData | null;
  employees: Employee[];
  heading: string;
  isSharedSection: boolean;
}

const OverviewDetails: React.FC<OverviewDetailsProps> = ({
  user,
  employees,
  heading,
  isSharedSection,
}) => {
  const navigate = useNavigate();
  const { user: loggedInUser } = useSelector((state: RootState) => state.auth);
  return (
    <CardComponent
      sx={{
        px: 2,
        py: 4,
        height: "calc(100vh - 130px)",
        "@media print": {
          maxHeight: "none !important",
          pageBreakInside: "avoid",
          breakInside: "avoid",
        },
      }}
    >
      {isSharedSection ? (
        <>
          <Typography variant="h3" mb={1}>
            {heading}
          </Typography>
          <Typography
            variant="body2"
            pb={2}
            mb={1}
            borderBottom="1px solid #F1F1F1"
          >
            {employees.length} Employee(s)
          </Typography>
          <Stack
            gap={1}
            sx={{ overflow: "auto", maxHeight: "calc(100vh - 250px)" }}
          >
            {employees.map((employee) => (
              <Stack
                key={employee.id}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
              >
                <Stack direction="row" alignItems="center" gap={1}>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    badgeContent={
                      <img
                        src={statusIcons[employee?.latest_availability]}
                        alt={employee?.latest_availability}
                        style={{
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                        }}
                      />
                    }
                    sx={{
                      "& .MuiBadge-badge": {
                        minWidth: "12px",
                        height: "12px",
                      },
                    }}
                  >
                    <Avatar
                      src={employee.profile_picture}
                      alt={employee.name}
                      sx={{ width: 20, height: 20, borderRadius: "500px" }}
                    />
                  </Badge>
                  <Typography>{employee?.name}</Typography>
                </Stack>
                <Typography>{formatTime(employee?.available_time)}</Typography>
              </Stack>
            ))}
          </Stack>
        </>
      ) : (
        <>
          <AvatarWithStatus
            name={user?.name}
            department={user?.job_title || ""}
            src={user?.profile_picture}
          />
          <BorderStack>
            <Stack direction="row" alignItems="center" gap={1}>
              <EmailIcon />
              <Typography>{user?.email || "-"}</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" gap={1}>
              <PhoneIcon />
              <Typography>{user?.mobile_phone || "-"}</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" gap={1}>
              <LocationIcon />
              <Typography>{user?.office_location || "-"}</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" gap={1}>
              <PersonIcon />
              <Typography>{user?.job_title || "-"}</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" gap={1}>
              <LocationMapIcon />
              <Typography>{user?.city || "-"}</Typography>
            </Stack>
          </BorderStack>
          <Typography variant="caption" fontWeight={600}>
            Reports to
          </Typography>
          <Stack direction="row" justifyContent="space-between" mt={1}>
            <Stack direction="row" alignItems="center" gap={1}>
              <Avatar src={user?.manager_profile_picture} sx={{ width: 30, height: 30 }} />
              <Typography>{user?.manager_name}</Typography>
            </Stack>
            {loggedInUser?.is_admin && (
              <Button
                variant="text"
                sx={{ fontWeight: 600, color: "primary.main", minWidth: "80px" }}
                size="small"
                onClick={() =>
                  navigate(
                    APP_PATHS.employeeDashboard(
                      user?.manager_internal_id as string
                    )
                  )
                }
                data-testid="overView-details-manager-view"
              >
                View
              </Button>
            )}
          </Stack>
          <BorderStack>
  <Typography variant="caption" fontWeight={600}>
    Shift Assigned
  </Typography>
  <Stack direction="row" justifyContent="space-between" alignItems="center">
    <Typography>{user?.current_shift || "-"}</Typography>
  </Stack>
</BorderStack>

{user?.active_projects && user.active_projects.length > 0 && (
  <>
    <Typography variant="caption" fontWeight={600}>
      Projects
    </Typography>
    <List>
      {user.active_projects.map((project) => (
        <ListItem
          key={project}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            padding: 0, 
            paddingTop: 1,
            paddingBottom: 1,
            alignItems: "center",
          }}
        >
          <Typography>{project}</Typography>
        </ListItem>
      ))}
    </List>
    <BorderLine />
  </>
)}
            </>
      )}
    </CardComponent>
  );
};

export default OverviewDetails;
