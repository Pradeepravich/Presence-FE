import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  Box,
  Typography,
  styled,
  TableContainer,
  Stack,
} from "@mui/material";
import { useMemo } from "react";
import MinutesAvatar from "../../components/design-system/MinutesAvatar";
import { convertTo2Digits, generateTimeline } from "../../utils/format";
import { PresenceResult } from "../../services/usePresenceApi";
import { useNavigate } from "react-router-dom";
import { APP_PATHS, AVAILABILITY_STATUSES } from "../../utils/constants";
import { PresenceUserResult } from "../../services/usePresenceUserApi";
import moment from "moment";
import LoadingOverlay from "../../components/design-system/LoadingOverlay";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import InfiniteScrollList from "../../components/InfiniteScrollList";
import ShiftLabel from "../../components/ShiftLabel";
import messagesLogo from "../../assets/messages-logo.svg";
import { StatusLabel } from "../../components/StatusLabel";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.mode === "light" ? "#ECEFF180" : "#028AF61A",
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const getShiftCellStyles = (
  shiftHours: string[],
  hourKey: string,
  status?: string
) => {
  const isShiftHour = shiftHours.includes(hourKey);
  const isStartHour = shiftHours[0] === hourKey;
  const isEndHour = shiftHours[shiftHours.length - 1] === hourKey;
  const isWeekOff = status === "Week Off";

  const sx = {
    borderTop: isShiftHour ? "1px solid #039BE5" : undefined,
    borderBottom: isShiftHour ? "1px solid #039BE5" : undefined,
    borderLeft: isStartHour ? "1px solid #039BE5" : undefined,
    borderRight: isEndHour ? "1px solid #039BE5" : undefined,
    borderTopLeftRadius: isStartHour ? 10 : 0,
    borderBottomLeftRadius: isStartHour ? 10 : 0,
    borderTopRightRadius: isEndHour ? 10 : 0,
    borderBottomRightRadius: isEndHour ? 10 : 0,
  };

  return isWeekOff ? { py: 1, px: 0.25 } : { ...sx, py: 1, px: 0.25 };
};

// Usage

interface CommonProps {
  isLoading: boolean;
  noRecords?: string;
  status: string;
  name?: string;
  hasMore: boolean;
  loadMore: () => void;
  error: Error | null;
}

type PresenceTableProps<T extends boolean = boolean> = CommonProps &
  (T extends true
    ? { isEmployeeSpecific: true; data: PresenceUserResult[] }
    : { isEmployeeSpecific: false; data: PresenceResult[] });

const isUserDashboardView = (
  row: PresenceUserResult | PresenceResult
): row is PresenceUserResult => !("name" in row);

const PresenceTable = <T extends boolean>({
  data,
  isLoading,
  isEmployeeSpecific,
  noRecords = "No Data found",
  status,
  name,
  hasMore,
  loadMore,
  error,
}: PresenceTableProps<T>) => {
  const navigate = useNavigate();
  const tenantData = useSelector((state: RootState) => state.settings.tenant);

  const timeline = useMemo(() => {
    if (tenantData?.timeline_hours_start && tenantData?.timeline_hours_end) {
      return generateTimeline(
        tenantData.timeline_hours_start,
        tenantData.timeline_hours_end
      );
    }
    return [];
  }, [tenantData]);

  const timelineWithNextHourForTooltip = useMemo(() => {
    return timeline.map((item, idx) => {
      const next = timeline[idx + 1];
      return {
        currentLabel: idx % 2 === 1 ? "" : item.label,
        currentHour: item.hour24,
        nextLabel: next ? next.label : item.label,
        nextHour: next ? next.hour24 : item.hour24,
      };
    });
  }, [timeline]);

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      <LoadingOverlay isLoading={isLoading} height="80vh" />
      <TableContainer
        sx={{ maxHeight: "calc(100vh - 200px)", position: "relative" }}
      >
        <Table
          stickyHeader
          size="small"
          sx={{ minHeight: !data.length ? "400px" : "auto" }}
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ borderBottom: "none" }} />
              {timelineWithNextHourForTooltip.map((hourItem, idx) => {
                return (
                  <TableCell
                    key={idx}
                    sx={{ px: { xs: "2px", lg: 0 }, borderBottom: "none", textAlign: "center" }}
                  >
                    <Typography variant="subtitle1" color="text.secondary">
                      {hourItem.currentLabel}
                    </Typography>
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>

          <TableBody>
            {data.length > 0 ? (
              <InfiniteScrollList
                hasMore={hasMore}
                isLoading={isLoading}
                loadMore={loadMore}
                error={error}
                isElementInTable={true}
              >
                {data.map((row) => (
                  <StyledTableRow key={(row as PresenceResult).id}>
                    {!isUserDashboardView(row) ? (
                      <TableCell
                        sx={{
                          cursor: "pointer",
                          width: 180,
                          position: "relative",
                          paddingRight: "30px",
                          "&:hover .messages-icon": {
                            display: "block",
                          },
                          borderBottom: "none",
                        }}
                        data-testid={`employee-row-${row.id}`}
                        onClick={() =>
                          navigate(APP_PATHS.employeeDashboard(row.id))
                        }
                      >
                        <Stack
                          direction="row"
                          justifyContent="end"
                          alignItems="center"
                          gap={1}
                          sx={{ position: "relative" }}
                        >
                          <Box textAlign="right">
                            <Typography
                              noWrap
                              variant="body1"
                              sx={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                maxWidth: "120px",
                                cursor: "pointer",
                              }}
                              data-testid={`employee-name-${row.id}`}
                            >
                              {row.name}
                            </Typography>
                            {row.status ? (
                              <StatusLabel status={row.status} />
                            ) : (
                              <ShiftLabel
                                shiftMinutes={row.shift_minutes}
                                workedMinutes={row.total_time}
                              />
                            )}
                          </Box>
                          <Box sx={{ position: "relative" }}>
                            <Avatar
                              alt={row.name}
                              src={row.profile_picture}
                              data-testid={`employee-avatar-${row.id}`}
                              sx={{ cursor: "pointer" }}
                            />
                            {row.latest_availability && (
                              <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="end"
                                gap={1}
                                sx={{
                                  position: "absolute",
                                  right: 0,
                                  bottom: 0,
                                }}
                              >
                                {AVAILABILITY_STATUSES.map(
                                  (status) =>
                                    status.key === row.latest_availability && (
                                      <img
                                        key={status.key}
                                        src={status.icon}
                                        alt={row.latest_availability}
                                        style={{
                                          width: "12px",
                                          height: "12px",
                                        }}
                                      />
                                    )
                                )}
                              </Stack>
                            )}
                          </Box>
                          <Box
                            className="messages-icon"
                            sx={{
                              display: "none",
                              position: "absolute",
                              paddingleft: "15px",
                              right: -20, // Position the icon beside the avatar
                              top: "50%",
                              transform: "translateY(-50%)",
                              cursor: "pointer",
                            }}
                            onClick={(e) => {
                              window.open(
                                APP_PATHS.teamsChat(row.email!),
                                "_blank"
                              );
                              e.stopPropagation(); // Prevent the click event from bubbling up to the TableCell
                            }}
                          >
                            <img src={messagesLogo} alt="messages" />
                          </Box>
                        </Stack>
                      </TableCell>
                    ) : (
                      <TableCell sx={{ width: 200, borderBottom: "none" }}>
                        <Box
                          minWidth={150}
                          display="flex"
                          justifyContent="end"
                          gap={1}
                        >
                          <Box textAlign="right">
                            <Typography>
                              {moment(row.date).format("ddd, Do MMM YYYY")}
                            </Typography>
                            <Typography variant="caption" color="#757474">
                              {row.status ? (
                                <StatusLabel status={row.status} />
                              ) : (
                                <ShiftLabel
                                  shiftMinutes={row.shift_minutes}
                                  workedMinutes={row.total_time}
                                />
                              )}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                    )}
                    {timeline.map((item) => {
                      const hourEnd = item.hour24;
                      const hourStart = (hourEnd - 1 + 24) % 24;
                      const hourKey = `${convertTo2Digits(hourStart + 1)}:00`;
                      const formattedHourkey =
                        hourKey === "24:00" ? "00:00" : hourKey;
                      const startLabel = moment({ hour: hourStart }).format(
                        "h A"
                      );
                      const endLabel = item.label;
                      const minutes = row.hourly_data[hourKey] || 0;
                      const tooltipTitle = `${
                        !isEmployeeSpecific ? row.name : name
                      } was ${status} for ${minutes} mins between ${startLabel} - ${endLabel}`;

                      return (
                        <TableCell
                          key={item.hour24}
                          sx={{ p: 0, borderBottom: "none" }}
                        >
                          <Stack
                            sx={getShiftCellStyles(
                              row.shift_hours,
                              formattedHourkey,
                              row.status
                            )}
                            alignItems="center"
                            justifyContent="center"
                          >
                            <MinutesAvatar
                              value={minutes}
                              title={tooltipTitle}
                            />
                          </Stack>
                        </TableCell>
                      );
                    })}
                  </StyledTableRow>
                ))}
              </InfiniteScrollList>
            ) : (
              <TableRow>
                <TableCell colSpan={25} align="center">
                  <Typography variant="body1" color="text.secondary">
                    {noRecords}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PresenceTable;
