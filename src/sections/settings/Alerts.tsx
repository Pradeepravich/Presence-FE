import { useState, useEffect, useCallback } from "react";
import { Switch, Typography, Box, Stack } from "@mui/material";
import { useEmailNotificationsApi } from "../../services/useEmailNotifications.Api";
import { useGetEmailNotificationsApi } from "../../services/useGetEmailNotifications.Api";
import { enqueueSnackbar } from "notistack";
import CardComponent from "../../components/design-system/Card";

const notificationMappings: { [key: string]: string } = {
  EMPLOYEE_DAILY_PERFORMANCE_SUMMARY:
    "Email employee their daily performance summary",
  EMPLOYEE_WEEKLY_PERFORMANCE_SUMMARY:
    "Email employee their weekly performance summary",
  EMPLOYEE_MONTHLY_PERFORMANCE_SUMMARY:
    "Email employee their monthly performance summary",
  EMPLOYEE_QUARTERLY_PERFORMANCE_SUMMARY:
    "Email employee their quarterly performance summary",
  EMPLOYEE_ANNUAL_PERFORMANCE_SUMMARY:
    "Email employee their annual performance summary",
  EMPLOYEE_LESS_THAN_4_HOURS_DAILY:
    "Email Employee when they have spent less than 4 hours in a day",
  PROJECT_ADMIN_DAILY_TEAM_PERFORMANCE_SUMMARY:
    "Email Project admin their team’s daily performance summary",
  PROJECT_ADMIN_WEEKLY_TEAM_PERFORMANCE_SUMMARY:
    "Email Project admin their team’s weekly performance summary",
  PROJECT_ADMIN_MONTHLY_TEAM_PERFORMANCE_SUMMARY:
    "Email Project admin their team’s monthly performance summary",
  PROJECT_ADMIN_QUARTERLY_TEAM_PERFORMANCE_SUMMARY:
    "Email Project admin their team’s quarterly performance summary",
  PROJECT_ADMIN_ANNUAL_TEAM_PERFORMANCE_SUMMARY:
    "Email Project admin their team’s annual performance summary",
  PROJECT_ADMIN_TEAM_MEMBER_LESS_THAN_4_HOURS_DAILY:
    "Email Project admin when any team member has spent less than 4 hours in a day",
};

const Alerts = () => {
  const tenantId = 1;
  const { value: notifications, isLoading } =
    useGetEmailNotificationsApi(tenantId);
  const { postNotifications } = useEmailNotificationsApi();
  const [enabled, setEnabled] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (notifications?.email_notifications) {
      setEnabled(
        notifications.email_notifications.reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {} as { [key: string]: boolean })
      );
    }
  }, [notifications]);

  const handleToggle = useCallback(
    async (key: string) => {
      setEnabled((prevEnabled) => {
        const newEnabled = {
          ...prevEnabled,
          [key]: !prevEnabled[key],
        };

        postNotifications({
          tenant_id: tenantId,
          email_notifications: Object.keys(newEnabled).filter(
            (k) => newEnabled[k]
          ),
        })
          .then(() => {
            enqueueSnackbar("Notification settings updated successfully!", {
              variant: "success",
            });
          })
          .catch((error) => {
            console.error("Error updating notifications:", error);
            enqueueSnackbar("Failed to update settings. Please try again.", {
              variant: "error",
            });

            setEnabled((prev) => ({
              ...prev,
              [key]: !prev[key],
            }));
          });

        return newEnabled;
      });
    },
    [postNotifications]
  );

  return (
    <CardComponent sx={{ width: "fit-content" }} isLoading={isLoading}>
      <Box
        sx={{
          maxWidth: "100%",
          minWidth: "60vw",
        }}
        p={1}
      >
        <Typography variant="h5" mb={4.5}>
          Notifications
        </Typography>

        <>
          {Object.keys(notificationMappings).map((key) => (
            <Stack
              justifyContent="space-between"
              alignItems="center"
              direction="row"
              key={key}
              gap={2}
            >
              <Typography>{notificationMappings[key]}</Typography>
              <Switch
                checked={!!enabled[key]}
                onChange={() => handleToggle(key)}
                data-testid={`alerts-toggle-${key}`}
              />
            </Stack>
          ))}
        </>
      </Box>
    </CardComponent>
  );
};

export default Alerts;
