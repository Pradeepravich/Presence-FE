import { Box, Stack, styled, Typography } from "@mui/material";
import EmployeeStatusPopup from "./EmployeeListWithStatusPopup";
import { useEffect, useMemo, useState } from "react";
import { AvailablilityStatusKey } from "../../utils/types";
import { AVAILABILITY_STATUSES } from "../../utils/constants";
import { PresenceOverviewResponse } from "../../services/usePresenceOverviewApi";
import useGetLivePresenceUsersApi from "../../services/useGetLivePresenceUsersApi";
import useCronjob from "../../hooks/useCron";

const LiveListItem = styled(Box)(({ theme }) => ({
  width: 65,
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
  paddingTop: theme.spacing(0.5),
  paddingBottom: theme.spacing(0.5),
  borderRadius: 4,
  outline: theme.palette.mode === "dark" ? "none" : "0px solid #E0E0E0",
  outlineColor: theme.palette.text.disabled,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "flex-start",
  gap: 0.5,
  cursor: "pointer",
  backgroundColor: theme.palette.background.paper,
}));

interface StatusItem {
  label: string;
  count: number;
  key: string;
}

interface LiveListProps {
  presenceOverview: PresenceOverviewResponse | null;
  lastUpdatedTime: string;
}

const LiveList = ({ presenceOverview, lastUpdatedTime }: LiveListProps) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<
    AvailablilityStatusKey | "OOO"
  >("Available");
  const statusData = useMemo(
    () => [
      // Spread the mapped array instead of returning it directly
      ...AVAILABILITY_STATUSES.map((status) => ({
        title: status.shortcut,
        value: presenceOverview?.counts[status.key],
        key: status.key,
      })),
      // Add OOO status
      {
        title: "OOO",
        value: presenceOverview?.counts?.OOO || 0,
        key: "OOO",
      },
    ],
    [presenceOverview]
  );
  const statusList: StatusItem[] = useMemo(
    () => [
      ...AVAILABILITY_STATUSES.map((i) => ({
        label: i.shortcut,
        count: presenceOverview?.counts?.[i.key] || 0,
        key: i.key,
      })),
      {
        label: "OOO",
        count: presenceOverview?.counts?.OOO || 0,
        key: "OOO" as AvailablilityStatusKey,
      },
    ],
    [presenceOverview]
  );
  const {
    isLoading: isEmployeeDataLoading,
    next,
    data,
    error,
    hasMore,
    reset,
    loadMore,
  } = useGetLivePresenceUsersApi(
    {
      availability: selectedStatus,
      page_size: 40,
    },
    false
  );

  useCronjob(() => {
    reset();
  }, 5);

  const handleAllStatuses = () => {
    setSelectedStatus("Available");
    setIsPopupOpen(true);
    reset();
  };
  const handleOpenPopup = (status: AvailablilityStatusKey) => {
    setSelectedStatus(status);
    setIsPopupOpen(true);
    reset();
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    reset();
    setSelectedStatus("Available");
  };

  useEffect(() => {
    if (selectedStatus && isPopupOpen) {
      loadMore();
    }
  }, [isPopupOpen, loadMore, reset, selectedStatus]);

  const totalStatuses = statusList.reduce(
    // Exclude 'OOO' statuses from the total count
    (acc, status) => (status.key === "OOO" ? acc : acc + status.count),
    0
  );

  return (
    <Stack direction="row" gap={1} alignItems="flex-start">
      <LiveListItem key="all" onClick={handleAllStatuses}>
        <Typography
          sx={{
            color: "text.dark",
            fontSize: 10,
            fontFamily: "Sora",
            fontWeight: 400,
            wordWrap: "break-word",
          }}
        >
          All
        </Typography>
        <Typography
          sx={{
            textAlign: "center",
            color: "#039BE5",
            fontSize: 14,
            fontFamily: "Sora",
            fontWeight: 700,
            wordWrap: "break-word",
          }}
        >
          {totalStatuses}
        </Typography>
      </LiveListItem>
      {statusList.map((status) => (
        <LiveListItem
          key={status.label}
          onClick={() => handleOpenPopup(status.key as AvailablilityStatusKey)}
        >
          <Typography
            sx={{
              color: "text.dark",
              fontSize: 10,
              fontFamily: "Sora",
              fontWeight: 400,
              wordWrap: "break-word",
            }}
          >
            {status.label}
          </Typography>
          <Typography
            sx={{
              textAlign: "center",
              color: "#039BE5",
              fontSize: 14,
              fontFamily: "Sora",
              fontWeight: 700,
              wordWrap: "break-word",
            }}
          >
            {status.count}
          </Typography>
        </LiveListItem>
      ))}
      <EmployeeStatusPopup
        open={isPopupOpen}
        onClose={handleClosePopup}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        statusData={statusData}
        isLoading={isEmployeeDataLoading}
        employeeData={data}
        error={error}
        hasMore={hasMore}
        loadMore={next}
        reset={reset}
        lastUpdatedTime={lastUpdatedTime}
      />
    </Stack>
  );
};

export default LiveList;
