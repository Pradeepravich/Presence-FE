import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Stack,
  Badge,
  Avatar,
  useTheme,
  styled,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { AVAILABILITY_STATUSES, statusIcons } from "../../utils/constants";
import LiveLabel from "../../components/design-system/LiveLabel";
import {
  AvailabilityStatusShortcut,
  AvailablilityStatusKey,
} from "../../utils/types";
import StatusChip from "../../components/design-system/StatusChip";
import { FC, Dispatch, SetStateAction } from "react";
import { User } from "../../services/useGetLivePresenceUsersApi";
import InfiniteScrollList from "../../components/InfiniteScrollList";
import OutOfOfficeIcon from "../../assets/OOOIcon.svg";

const BadgeImageContent = styled("img")({
  width: "8px",
  height: "8px",
  backgroundColor: "white",
  borderRadius: "50%",
  padding: "1px",
});

interface EmployeeStatusPopupProps {
  open: boolean;
  onClose: () => void;
  selectedStatus: AvailablilityStatusKey | "OOO";
  setSelectedStatus: Dispatch<SetStateAction<AvailablilityStatusKey | "OOO">>;
  statusData: {
    title: AvailabilityStatusShortcut | string;
    value: number | undefined;
    key: AvailablilityStatusKey | string;
  }[];
  employeeData: User[] | null;
  isLoading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  error: Error | null;
  reset: () => void;
  lastUpdatedTime: string;
}

const EmployeeStatusPopup: FC<EmployeeStatusPopupProps> = ({
  open,
  onClose,
  selectedStatus,
  setSelectedStatus,
  statusData,
  employeeData,
  isLoading,
  hasMore,
  loadMore,
  error,
  reset,
  lastUpdatedTime,
}) => {
  const theme = useTheme();
  const handleChipClick = (shortcut: AvailabilityStatusShortcut | "OOO") => {
    if (shortcut === "OOO") {
      setSelectedStatus("OOO");
      reset();
      return;
    }
    const status = AVAILABILITY_STATUSES.find((s) => s.shortcut === shortcut);
    if (status) {
      setSelectedStatus(status.key as AvailablilityStatusKey);
      reset();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      sx={{ borderRadius: "12px", padding: "16px 20px" }}
    >
      <DialogTitle
        sx={{
          backgroundColor:
            theme.palette.mode === "light" ? "grey.400" : "rgba(34, 40, 49, 1)",
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Stack
            direction="row"
            gap={3}
            alignItems="center"
            flexWrap="wrap"
            mb={1}
          >
            <Typography variant="h4">Employees - By status</Typography>
            <LiveLabel time={lastUpdatedTime} direction="row" />
          </Stack>
          <IconButton aria-label="close" onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
        <Stack direction="row" spacing="6px" mb={2} flexWrap="wrap" rowGap={1}>
          {[
            ...AVAILABILITY_STATUSES.map((status) => {
              const data = statusData.find((item) => item.key === status.key);
              return (
                <StatusChip
                  key={status.key}
                  label={`${status.shortcut} (${data?.value || 0})`}
                  onClick={() => handleChipClick(status.shortcut)}
                  src={status.icon}
                  bgColor={theme.palette.mode === "light" ? "#ffffff" : ""}
                  active={status.key === selectedStatus}
                />
              );
            }),
            // Add OOO chip
            <StatusChip
              key="OOO"
              label={`OOO (${
                statusData.find((item) => item.key === "OOO")?.value || 0
              })`}
              onClick={() => handleChipClick("OOO")}
              src={OutOfOfficeIcon} // Make sure you have this icon
              bgColor={theme.palette.mode === "light" ? "#ffffff" : ""}
              active={selectedStatus === "OOO"}
            />,
          ]}
        </Stack>
      </DialogTitle>
      <DialogContent
        sx={{
          backgroundColor:
            theme.palette.mode === "light" ? "#ffffff" : "#121a1c",
        }}
      >
        <Box
          mb={2}
          mt={2}
          sx={{
            height: "30vh",
            overflowY: "auto",
          }}
        >
          {!employeeData?.length ? (
            <Stack alignItems="center" justifyContent="center" height="100%">
              <Typography variant="body1" color="text.secondary">
                {isLoading ? "Loading..." : "No data available"}
              </Typography>
            </Stack>
          ) : (
            <Box display="flex" gap={2} flexWrap="wrap" alignItems="flex-start">
              <InfiniteScrollList
                isLoading={isLoading}
                hasMore={hasMore}
                loadMore={loadMore}
                error={error}
              >
                {employeeData?.map((employee: User) => (
                  <Stack
                    direction="row"
                    gap={1}
                    alignItems="center"
                    sx={{ width: "250px" }}
                    key={employee.id}
                  >
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                      badgeContent={
                        <BadgeImageContent
                          src={statusIcons[selectedStatus]}
                          alt={selectedStatus}
                        />
                      }
                      sx={{
                        "& .MuiBadge-badge": {
                          padding: 0,
                          minWidth: "10px",
                          height: "10px",
                          right: 2,
                        },
                      }}
                    >
                      <Avatar
                        src={employee.profile_picture}
                        alt={employee.name}
                        sx={{ width: 20, height: 20, borderRadius: "500px" }}
                      />
                    </Badge>
                    <Typography
                      sx={{
                        color: theme.palette.mode === "light" ? "#263238" : "",
                      }}
                    >
                      {employee.name}
                    </Typography>
                  </Stack>
                ))}
              </InfiniteScrollList>
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeStatusPopup;
