import {
  Stack,
  Typography,
  styled,
  Divider,
  Card,
  Box,
  useTheme,
} from "@mui/material";
import { useMemo } from "react";
import { enqueueSnackbar } from "notistack";
import Dropdown from "../components/design-system/Dropdown";
import { jwtDecode } from "jwt-decode";
import { useEditTenantApi } from "../services/useUpdateTenantApi";
import moment, { Moment } from "moment";
import TimePickerComponent from "../components/design-system/TimePicker";
import {
  timeOptions,
  timezoneOptions,
  cronjobIntervalOptions,
} from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { setTenant, TenantData } from "../redux/SettingsSlice";

export const Container = styled("div")(({ theme }) => ({
  width: "100%",
  padding: theme.spacing(2),
}));

const Settings = () => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const token = useMemo(() => localStorage.getItem("token"), []);
  const tenantData = useSelector((state: RootState) => state.settings.tenant);

  let tenantId: string | null = null;

  if (token) {
    const decodedToken: any = jwtDecode(token);
    tenantId = decodedToken.tenant_id;
  }

  const { execute: editTenant } = useEditTenantApi();

  const handleChange = async (
    field: string,
    value: Moment | null | string | number
  ): Promise<void> => {
    if (!tenantData) return;

    const formatTime = (time: Moment | null | string | number) =>
      moment.isMoment(time) ? time.format("HH:mm:ss") : time;

    const updatedValues = {
      ...tenantData,
      [field]: moment.isMoment(value) ? value.format("HH:mm:ss") : value,
    };

    const payload: TenantData = {
      ...updatedValues,
      id: tenantData.id,
      schema_name: tenantData.schema_name,
      name: tenantData.name,
      created_on: tenantData.created_on,
      timezone: updatedValues.timezone || "",
      overtime_threshold: Number(updatedValues.overtime_threshold),
      night_hawks_start: formatTime(updatedValues.night_hawks_start) as
        | string
        | null,
      night_hawks_end: formatTime(updatedValues.night_hawks_end) as
        | string
        | null,
      early_birds_start: formatTime(updatedValues.early_birds_start) as
        | string
        | null,
      early_birds_end: formatTime(updatedValues.early_birds_end) as
        | string
        | null,
      regular_working_hours_end: formatTime(
        updatedValues.regular_working_hours_end
      ) as string | null,
      regular_working_hours_start: formatTime(
        updatedValues.regular_working_hours_start
      ) as string | null,
      timeline_hours_end: formatTime(updatedValues.timeline_hours_end) as
        | string
        | null,
      timeline_hours_start: formatTime(updatedValues.timeline_hours_start) as
        | string
        | null,
    };

    try {
      await editTenant({
        tenant_id: tenantId,
        tenant: payload,
      });
      dispatch(setTenant(payload));
      enqueueSnackbar("Updated Successfully", { variant: "success" });
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Failed to update", { variant: "error" });
    }
  };

  const getMomentValue = (value: string | null | undefined) => {
    return value ? moment(value, "HH:mm:ss") : null;
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 170px)",
        maxWidth: "100%",
        minWidth: "60vw",
        width: "fit-content",
      }}
      py={1}
      // isLoading={}
    >
      <Stack direction={{ md: "row" }} gap={2} justifyContent="space-between">
        <Stack
          flex={1}
          padding={3}
          component={Card}
          p={{ xs: 1, md: 3 }}
          sx={{ borderRadius: "8px" }}
        >
          <Stack direction="column" gap={3}>
            <Typography variant="h5">Dashboard Configurations</Typography>

            <Stack gap={3}>
              <Stack>
                <Stack
                  direction={{ lg: "row" }}
                  justifyContent="space-between"
                  alignItems="flex-start"
                >
                  <Stack flex={1} gap={0.5}>
                    <Typography variant="body1">Cron Job Interval</Typography>
                    <Typography variant="subtitle1">
                      Interval at which employee's presence get tracked.
                      <br />
                      will be effective from next start of hour
                    </Typography>
                  </Stack>
                  <Stack flex={1}>
                    <Typography variant="caption">Select Interval</Typography>
                    <Dropdown
                      forceBackgroundColor={
                        theme.palette.mode === "light" ? " #f6f6f6" : "#424146"
                      }
                      height="27px"
                      options={cronjobIntervalOptions}
                      value={
                        tenantData?.fetch_presence_in_minutes.toString() || ""
                      }
                      onChange={(value) =>
                        handleChange("fetch_presence_in_minutes", value)
                      }
                      testId="settings-dropdown-timezone"
                    />
                  </Stack>
                </Stack>
                <Divider sx={{ mt: 3 }} />
              </Stack>

              <Stack>
                <Stack
                  direction={{ lg: "row" }}
                  justifyContent="space-between"
                  alignItems="flex-start"
                >
                  <Stack flex={1} gap={0.5}>
                    <Typography variant="body1">Timezone</Typography>
                    <Typography variant="subtitle1">
                      The standard time zone in which an employee's working{" "}
                      <br />
                      hours are scheduled.
                    </Typography>
                  </Stack>
                  <Stack flex={1}>
                    <Typography variant="caption">Timezone</Typography>
                    <Dropdown
                      forceBackgroundColor={
                        theme.palette.mode === "light" ? " #f6f6f6" : "#424146"
                      }
                      height="27px"
                      options={timezoneOptions}
                      value={tenantData?.timezone || ""}
                      onChange={(value) => handleChange("timezone", value)}
                      testId="settings-dropdown-timezone"
                    />
                  </Stack>
                </Stack>
                <Divider sx={{ mt: 3 }} />
              </Stack>

              <Stack>
                <Stack
                  direction={{ lg: "row" }}
                  justifyContent="space-between"
                  alignItems="flex-start"
                >
                  <Stack flex={1} gap={0.5}>
                    <Typography variant="body1">Timeline Hours</Typography>
                    <Typography variant="subtitle1">
                      Employee working hours start and end time in the Presence{" "}
                      <br />
                      dashboard.
                    </Typography>
                  </Stack>
                  <Stack direction="row" gap={3} flex={1}>
                    <Stack flex={1}>
                      <Typography variant="caption">Start Time</Typography>
                      <TimePickerComponent
                        value={getMomentValue(tenantData?.timeline_hours_start)}
                        onAccept={(value) =>
                          handleChange("timeline_hours_start", value)
                        }
                        testId="settings-dropdwon-timelinehours-start"
                      />
                    </Stack>
                    <Stack flex={1}>
                      <Typography variant="caption">End Time</Typography>
                      <TimePickerComponent
                        value={getMomentValue(tenantData?.timeline_hours_end)}
                        onAccept={(value) =>
                          handleChange("timeline_hours_end", value)
                        }
                        testId="settings-dropdwon-timelinehours-end"
                      />
                    </Stack>
                  </Stack>
                </Stack>
                <Divider sx={{ mt: 3 }} />
              </Stack>

              <Stack>
                <Stack
                  direction={{ lg: "row" }}
                  justifyContent="space-between"
                  alignItems="flex-start"
                >
                  <Stack flex={1} gap={0.5}>
                    <Typography variant="body1">
                      Regular Working Hours
                    </Typography>
                    <Typography variant="subtitle1">
                      Employee working hours start and end time as per ,<br />
                      organization policy.
                    </Typography>
                  </Stack>
                  <Stack direction="row" gap={3} flex={1}>
                    <Stack flex={1}>
                      <Typography variant="caption">Start Time</Typography>
                      <TimePickerComponent
                        value={getMomentValue(
                          tenantData?.regular_working_hours_start
                        )}
                        onAccept={(value) =>
                          handleChange("regular_working_hours_start", value)
                        }
                        testId="settings-dropdwon-regularworkinghours-start"
                      />
                    </Stack>
                    <Stack flex={1}>
                      <Typography variant="caption">End Time</Typography>
                      <TimePickerComponent
                        value={getMomentValue(
                          tenantData?.regular_working_hours_end
                        )}
                        onAccept={(value) =>
                          handleChange("regular_working_hours_end", value)
                        }
                        testId="settings-dropdwon-regularworkinghours-end"
                      />
                    </Stack>
                  </Stack>
                </Stack>
                <Divider sx={{ mt: 3 }} />
              </Stack>

              <Stack>
                <Stack
                  direction={{ lg: "row" }}
                  justifyContent="space-between"
                  alignItems="flex-start"
                >
                  <Stack flex={1} gap={0.5}>
                    <Typography variant="body1">Overtime Ninjas</Typography>
                    <Typography variant="subtitle1">
                      Additional hours an employee works beyond their set daily
                      ,<br />
                      hours.
                    </Typography>
                  </Stack>
                  <Stack flex={1}>
                    <Typography variant="caption">
                      Anything above below hours
                    </Typography>
                    <Dropdown
                      forceBackgroundColor={
                        theme.palette.mode === "light" ? " #f6f6f6" : "#424146"
                      }
                      height="27px"
                      options={timeOptions}
                      value={tenantData?.overtime_threshold?.toString() || "0"}
                      onChange={(value) =>
                        handleChange("overtime_threshold", value)
                      }
                      testId="settings-dropdwon-overtimeninjas"
                    />
                  </Stack>
                </Stack>
                <Divider sx={{ mt: 3 }} />
              </Stack>

              <Stack>
                <Stack
                  direction={{ lg: "row" }}
                  justifyContent="space-between"
                  alignItems="flex-start"
                >
                  <Stack flex={1} gap={0.5}>
                    <Typography variant="body1">Early birds</Typography>
                    <Typography variant="subtitle1">
                      Anyone working in the set start and end time will be{" "}
                      <br />
                      considered working early.
                    </Typography>
                  </Stack>
                  <Stack direction="row" gap={3} flex={1}>
                    <Stack flex={1}>
                      <Typography variant="caption">Start Time</Typography>
                      <TimePickerComponent
                        value={getMomentValue(tenantData?.early_birds_start)}
                        onAccept={(value) =>
                          handleChange("early_birds_start", value)
                        }
                        testId="settings-dropdwon-earlybirds-start"
                      />
                    </Stack>
                    <Stack flex={1}>
                      <Typography variant="caption">End Time</Typography>
                      <TimePickerComponent
                        value={getMomentValue(tenantData?.early_birds_end)}
                        onAccept={(value) =>
                          handleChange("early_birds_end", value)
                        }
                        testId="settings-dropdwon-earlybirds-end"
                      />
                    </Stack>
                  </Stack>
                </Stack>
                <Divider sx={{ mt: 3 }} />
              </Stack>

              <Stack>
                <Stack
                  direction={{ lg: "row" }}
                  justifyContent="space-between"
                  alignItems="flex-start"
                >
                  <Stack flex={1} gap={0.5}>
                    <Typography variant="body1">Night Hawks</Typography>
                    <Typography variant="subtitle1">
                      Anyone working in the set start and end time will be ,
                      <br />
                      considered working late.
                    </Typography>
                  </Stack>
                  <Stack direction="row" gap={3} flex={1}>
                    <Stack flex={1}>
                      <Typography variant="caption">Start Time</Typography>
                      <TimePickerComponent
                        value={getMomentValue(tenantData?.night_hawks_start)}
                        onAccept={(value) =>
                          handleChange("night_hawks_start", value)
                        }
                        testId="settings-dropdwon-nighthawks-start"
                      />
                    </Stack>
                    <Stack flex={1}>
                      <Typography variant="caption">End Time</Typography>
                      <TimePickerComponent
                        value={getMomentValue(tenantData?.night_hawks_end)}
                        onAccept={(value) =>
                          handleChange("night_hawks_end", value)
                        }
                        testId="settings-dropdwon-nighthawks-end"
                      />
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Settings;
