import {
  Avatar,
  Box,
  Stack,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import CardComponent from "../design-system/Card";
import Dropdown from "../design-system/Dropdown";
import { useMemo, useState } from "react";
import {
  leaderboardOptions,
  getLeaderboardDescription,
} from "../../utils/constants";
import { useLeaderboardsApi } from "../../services/useLeaderBoardsApi";
import { Moment } from "moment";
import { formatTime } from "../../utils/format";
import LoadingOverlay from "../design-system/LoadingOverlay";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Tooltip from "../design-system/Tooltip";

const MAX_HEIGHT = 30; // Fixed height for max time

const Bar = styled(Box)(() => ({
  width: 70,
  borderTopLeftRadius: 5,
  borderTopRightRadius: 5,
}));

interface OvertimeChartProps {
  startDate: Moment | null | undefined;
  endDate: Moment | null | undefined;
}

const OvertimeChart: React.FC<OvertimeChartProps> = ({
  startDate,
  endDate,
}) => {
  const theme = useTheme(); // Access the theme object
  const isDarkMode = theme.palette.mode === "dark";
  const [leaderboardType, setLeaderboardType] = useState(
    leaderboardOptions[0].value
  );

  const tenantData = useSelector((state: RootState) => state.settings.tenant);

  const LeaderboardParams = useMemo(
    () => ({
      start_date: startDate ? startDate.format("YYYY-MM-DD") : undefined,
      end_date: endDate ? endDate.format("YYYY-MM-DD") : undefined,
      type: leaderboardType,
    }),
    [endDate, leaderboardType, startDate]
  );

  const { value: leardboardsData, isLoading } =
    useLeaderboardsApi(LeaderboardParams);

  const top3 = useMemo(
    () => [leardboardsData?.[1], leardboardsData?.[0], leardboardsData?.[2]],
    [leardboardsData]
  );

  return (
    <CardComponent
      sx={{
        "@media print": { width: "48%" },
        position: "relative",
        minHeight: "calc(100vh - 120px)",
      }}
    >
      <Dropdown
        options={leaderboardOptions}
        value={leaderboardType}
        onChange={(val) => {
          setLeaderboardType(val);
        }}
        forceBackgroundColor="transparent"
      />
      <Typography variant="body2" color="#8D8D8D" ml={1}>
        {getLeaderboardDescription(leaderboardType, tenantData)}
      </Typography>
      {isLoading ? (
        <Box sx={{ height: 200 }}>
          <LoadingOverlay isLoading={isLoading} />
        </Box>
      ) : leardboardsData?.length ? (
        <>
          <Stack
            direction="row"
            gap={2}
            alignItems="flex-end"
            justifyContent="center"
            mt={2}
          >
            {top3.map((d) =>
              d?.total_minutes ? (
                <Stack key={d?.id} alignItems="center" gap={1} mb={2}>
                  <Avatar src={d?.profile_pic} />
                  <Tooltip title={d?.user_name}>
                    <Typography
                      variant="body2"
                      sx={{
                        textAlign: "center",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: "100px",
                      }}
                    >
                      {d?.user_name}
                    </Typography>
                  </Tooltip>
                  <Bar
                    height={
                      d?.user === top3?.[1]?.user
                        ? MAX_HEIGHT
                        : ((d?.total_minutes ?? 0) /
                            (top3[1]?.total_minutes ?? 1)) *
                          MAX_HEIGHT
                    }
                    bgcolor={
                      d?.user === top3?.[1]?.user
                        ? isDarkMode
                          ? "rgba(3, 155, 229, 0.7)" // Dark mode color for the top user
                          : "#039BE5" // Light mode color for the top user
                        : isDarkMode
                        ? "rgba(3, 155, 229, 0.3)" // Dark mode color for other users
                        : "#BBDEFB" // Light mode color for other users
                    }
                  />
                  <Typography variant="body2">
                    {formatTime(d?.total_minutes || 0)}
                  </Typography>
                </Stack>
              ) : (
                ""
              )
            )}
          </Stack>
          <Box maxHeight="calc(100vh - 350px)" overflow="auto">
            {leardboardsData?.slice(3, leardboardsData?.length).map((d) => (
              <Stack
                key={d?.id}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                m={2}
              >
                <Stack direction="row" gap={1} alignItems="center">
                  <Avatar src={d.profile_pic} sx={{ width: 24, height: 24 }} />
                  <Typography variant="body2">{d.user_name}</Typography>
                </Stack>
                <Typography variant="body2">
                  {formatTime(d?.total_minutes || 0)}
                </Typography>
              </Stack>
            ))}
          </Box>
        </>
      ) : (
        <Stack
          sx={{ alignItems: "center", justifyContent: "center", height: 200 }}
        >
          No data to display
        </Stack>
      )}
    </CardComponent>
  );
};

export default OvertimeChart;
