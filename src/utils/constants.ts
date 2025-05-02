import { MS_AUTH_CLIENT_ID, MS_AUTH_REDIRECT_URI } from "../config";
import TickIcon from "../assets/AvailableIcon.svg";
import BusyIcon from "../assets/BusyIcon.svg";
import DNDIcon from "../assets/DNDIcon.svg";
import BRBIcon from "../assets/BRBIcon.svg";
import offlineIcon from "../assets/OfflineStatusIcon.svg";
import moment from "moment";
import { AnalysisLevelType } from "../services/useAnalyticsApi";
import { TenantData } from "../redux/SettingsSlice";
import OutOfOfficeIcon from "../assets/OOOIcon.svg";

export const API_ENDPOINTS = {
  auth: {
    login: "/auth/login/",
    register: "/auth/register-tenant/",
    refresh: "/auth/refresh-token/",
    user: "/auth/user/details/",
  },
  analytics: {
    presence: "/analytics/presence/",
    presence_user: "/analytics/presence/user",
    overview: "/analytics/overview/",
    overview_user: "/analytics/overview/user",
    export: "/analytics/export/presence",
    export_presence_user: "/analytics/export/presence/user",
    detailed: "/analytics/detailed",
  },
  users: {
    dropdown: "/users/dropdown/",
    departments: "/users/departments/",
    allUsers: "/users/",
    livePresenceUser: "/users/live-presence",
    sync: "/users/sync-employees/",
    orgChart: "/users/org_chart/",
  },
  downtimelogs: "/downtime_logs/",
  settings: "/settings",
  newSettings: {
    holidays: "/settings/holidays/",
    locations: "/settings/locations/",
    projects: "/settings/projects/",
    shifts: "/settings/shifts/",
    employeeShiftMapping: "/settings/user-shift-mappings/",
    email_notifications: (tenantId: number | string) =>
      `/settings/email-notifications/?tenant_id=${tenantId}`,
    dropdown_locations: "/settings/locations/all-locations/",
    dropdwon_shifts: "/settings/shifts/all-shifts/",
    assign_projects: "/settings/projects/assign-projects",
    allProjects: "/settings/projects/all-projects",
    allEmployees: "/settings/employees/all-employees",
    allShifts: "/settings/shifts/all-shifts",
    userShiftMapping: "/settings/user-shift-mappings/",
    defaultShifts: "/settings/shifts/default-shifts",
  },
  tenants: "/tenant/",
  leaderBoards: "/leaderboards/",
  errorLogs: "/error-logs",
};

export const APP_PATHS = {
  login: "/",
  signup: "/signup",
  redirect: "/redirect",
  dashboard: "/dashboard",
  settings: "/settings",
  employeeDashboard: (id: string | number) => `/dashboard/${id}`,
  analytics: "/analytics",
  locations: "/locations",
  newSettings: "/settings-new",
  employees: "employees",
  shifts: "shifts",
  holidays: "holidays",
  projects: "projects",
  alerts: "alerts",
  config: "config",
  newSettingsPage: (
    page: "employees" | "shifts" | "holidays" | "projects" | "alerts"
  ) => `/settings-new/${page}`,
  shiftsTab: (tab: "all-shifts" | "employee-shifts") =>
    `/settings-new/shifts/${tab}`,
  allShifts: "all-shifts",
  employeeShiftMapping: "employee-shifts",
  manageLocations: "/manage-locations",
  orgChart: "/org-chart",
  teamsChat: (email: string) =>
    `https://teams.microsoft.com/l/chat/0/0?users=${email}`,
};

const MS_AUTH_URL =
  "https://login.microsoftonline.com/organizations/oauth2/v2.0/authorize";
const MS_AUTH_LOGIN_SCOPE =
  "Presence.Read.All User.ReadBasic.All offline_access";
const MS_AUTH_REGISTER_SCOPE = "Presence.Read.All User.Read.All offline_access";

export const OAUTH_CONFIG = {
  login: `${MS_AUTH_URL}?client_id=${MS_AUTH_CLIENT_ID}&response_type=code&redirect_uri=${MS_AUTH_REDIRECT_URI}&response_mode=query&scope=${MS_AUTH_LOGIN_SCOPE}&state=login&prompt=select_account`,
  register: `${MS_AUTH_URL}?client_id=${MS_AUTH_CLIENT_ID}&response_type=code&redirect_uri=${MS_AUTH_REDIRECT_URI}&response_mode=query&scope=${MS_AUTH_REGISTER_SCOPE}&state=register`,
  logout: `https://login.microsoftonline.com/organizations/oauth2/v2.0/logout?post_logout_redirect_uri=${MS_AUTH_REDIRECT_URI}`,
};

export const statusIcons: Record<string, string> = {
  Available: TickIcon,
  Busy: BusyIcon,
  BeRightBack: BRBIcon,
  Away: BRBIcon,
  DoNotDisturb: DNDIcon,
  Offline: offlineIcon,
  OOO: OutOfOfficeIcon,
};

export const EMPLOYEE_WORKING_MODES = ["Working", "Idle"];

export const AVAILABILITY_STATUSES = [
  {
    key: "Available",
    value: "Available",
    shortcut: "Available",
    color: "#89CB89",
    icon: TickIcon,
    status: EMPLOYEE_WORKING_MODES[0],
  },
  {
    key: "Busy",
    value: "Busy",
    shortcut: "Busy",
    color: "#F88383",
    icon: BusyIcon,
    status: EMPLOYEE_WORKING_MODES[0],
  },
  {
    key: "DoNotDisturb",
    value: "Do Not Disturb",
    shortcut: "DND",
    color: "rgba(248, 131, 131, 0.5)",
    icon: DNDIcon,
    status: EMPLOYEE_WORKING_MODES[0],
  },
  {
    key: "BeRightBack",
    value: "Be Right Back",
    shortcut: "BRB",
    color: "rgba(250, 183, 83, 0.5)",
    icon: BRBIcon,
    status: EMPLOYEE_WORKING_MODES[1],
  },
  {
    key: "Away",
    value: "Away",
    shortcut: "Away",
    color: "#FAB753",
    icon: BRBIcon,
    status: EMPLOYEE_WORKING_MODES[1],
  },
  {
    key: "Offline",
    value: "Offline",
    shortcut: "Offline",
    color: "#ECEFF1",
    icon: offlineIcon,
    status: EMPLOYEE_WORKING_MODES[1],
  },
] as const;

export const AVAILABILITY_ENUM = AVAILABILITY_STATUSES.reduce<
  Record<string, string>
>((acc, status) => {
  acc[status.value] = status.key;
  return acc;
}, {});

export const WORKING_MODE_STATUSES = AVAILABILITY_STATUSES.slice(0, 3).map(
  (i) => i.key
);

export const NON_WORKING_MODE_STATUSES = AVAILABILITY_STATUSES.slice(3).map(
  (i) => i.key
);

export const AVAILABILITY_STATUS_KEYS = AVAILABILITY_STATUSES.map((s) => s.key);

export const DURATION_TYPES = {
  day: {
    label: "Day",
    startDate: moment().startOf("day"),
    endDate: moment().endOf("day"),
  },
  week: {
    label: "Week",
    startDate: moment().startOf("week"),
    endDate: moment().endOf("week"),
  },
  month: {
    label: "Month",
    startDate: moment().startOf("month"),
    endDate: moment().endOf("month"),
  },
  year: {
    label: "Year",
    startDate: moment().startOf("year"),
    endDate: moment().endOf("year"),
  },
  custom: {
    label: "Custom",
    startDate: moment().startOf("month"),
    endDate: moment(),
  },
};

export const daysViewOptions = Object.entries(DURATION_TYPES).map(
  ([value, { label }]) => ({
    value: value as keyof typeof DURATION_TYPES,
    label,
  })
);

export const analysisLevelOptions: {
  value: AnalysisLevelType;
  label: string;
}[] = [
  { value: "organization", label: "Organization" },
  { value: "department", label: "Department" },
  { value: "project", label: "Projects" },
  { value: "location", label: "Locations" },
  { value: "shift", label: "Shifts" },
  { value: "employee", label: "Employee" },
];

export const DepartmentOptions = [
  { value: "accounts", label: "Accounts" },
  { value: "consulting", label: "Consulting" },
  { value: "design", label: "Design" },
  { value: "devops", label: "DevOps" },
  { value: "engineering", label: "Engineering" },
  { value: "hr", label: "HR" },
  { value: "management", label: "Management" },
  { value: "networking", label: "Networking" },
  { value: "quality_assurance", label: "Quality Assurance" },
];

export const leaderboardOptions = [
  {
    value: "overtime_ninjas",
    label: "🥷🏻 Overtime Ninjas",
    description: (tenant: TenantData | null) =>
      `Spent more time than ${tenant?.overtime_threshold || 9} hours`,
  },
  {
    value: "weekend_hustlers",
    label: "🗓️ Weekend Hustlers",
    description: "Works on  Weekends too",
  },
  {
    value: "recharge_royals",
    label: "⚡️ Recharge royals",
    description: "Spent more time taking breaks",
  },
  {
    value: "night_hawks",
    label: "🦅 Night Hawks",
    description: (tenant: TenantData | null) => {
      const startTime = tenant?.night_hawks_start
        ? moment(tenant.night_hawks_start, "HH:mm:ss").format("hh:mm A")
        : "12:00 AM";
      return `Works late post ${startTime}`;
    },
  },
  {
    value: "early_birds",
    label: "🐥 Early Birds",
    description: (tenant: TenantData | null) => {
      const startTime = tenant?.early_birds_start
        ? moment(tenant.early_birds_start, "HH:mm:ss").format("hh:mm A")
        : "09:00 AM";
      return `Works early before ${startTime}`;
    },
  },
];

export const getLeaderboardDescription = (
  type: string,
  tenant?: TenantData | null
) => {
  const option = leaderboardOptions.find((option) => option.value === type);
  if (!option) return "";
  return typeof option.description === "function"
    ? option.description(tenant || null)
    : option.description;
};

export const cronjobIntervalOptions = [
  { label: "2 minutes", value: "2" },
  { label: "3 minutes", value: "3" },
  { label: "5 minutes", value: "5" },
  { label: "6 minutes", value: "6" },
  { label: "10 minutes", value: "10" },
  { label: "15 minutes", value: "15" },
];

export const timezoneOptions = [
  {
    value: "UTC",
    label: "UTC",
  },
  {
    value: "Etc/GMT+12",
    label: "(GMT -12:00) GMT+12",
  },
  {
    value: "Etc/GMT+11",
    label: "(GMT -11:00) GMT+11, Midway, Niue, and others",
  },
  {
    value: "Etc/GMT+10",
    label: "(GMT -10:00) GMT+10, HST, Hawaii, and others",
  },
  {
    value: "Pacific/Marquesas",
    label: "(GMT -10:30) Marquesas",
  },
  {
    value: "America/Adak",
    label: "(GMT -09:00) Adak, Aleutian, Atka, and others",
  },
  {
    value: "America/Anchorage",
    label: "(GMT -08:00) Alaska, Anchorage, GMT+8, and others",
  },
  {
    value: "America/Creston",
    label: "(GMT -07:00) Arizona, BajaNorte, BajaSur, and others",
  },
  {
    value: "America/Bahia_Banderas",
    label: "(GMT -06:00) Bahia Banderas, Belize, Boise, and others",
  },
  {
    value: "America/Atikokan",
    label: "(GMT -05:00) Acre, Atikokan, Beulah, and others",
  },
  {
    value: "America/Anguilla",
    label: "(GMT -04:00) Anguilla, Antigua, Aruba, and others",
  },
  {
    value: "America/Araguaina",
    label: "(GMT -03:00) Araguaina, Atlantic, Bahia, and others",
  },
  {
    value: "America/St_Johns",
    label: "(GMT -03:30) Newfoundland, St Johns",
  },
  {
    value: "America/Miquelon",
    label: "(GMT -02:00) DeNoronha, GMT+2, Miquelon, and others",
  },
  {
    value: "America/Godthab",
    label: "(GMT -01:00) Cape Verde, GMT+1, Godthab, and others",
  },
  {
    value: "Africa/Abidjan",
    label: "(GMT +00:00) Abidjan, Accra, Azores, and others",
  },
  {
    value: "Africa/Algiers",
    label: "(GMT +01:00) Algiers, Bangui, Belfast, and others",
  },
  {
    value: "Africa/Blantyre",
    label: "(GMT +02:00) Amsterdam, Andorra, Belgrade, and others",
  },
  {
    value: "Africa/Addis_Ababa",
    label: "(GMT +03:00) Addis Ababa, Aden, Amman, and others",
  },
  {
    value: "Asia/Tehran",
    label: "(GMT +03:30) Iran, Tehran",
  },
  {
    value: "Asia/Baku",
    label: "(GMT +04:00) Astrakhan, Baku, Dubai, and others",
  },
  {
    value: "Asia/Kabul",
    label: "(GMT +04:30) Kabul",
  },
  {
    value: "Antarctica/Mawson",
    label: "(GMT +05:00) Almaty, Aqtau, Aqtobe, and others",
  },
  {
    value: "Asia/Calcutta",
    label: "(GMT +05:30) Calcutta, Colombo, Kolkata",
  },
  {
    value: "Asia/Kathmandu",
    label: "(GMT +05:45) Kathmandu, Katmandu",
  },
  {
    value: "Asia/Bishkek",
    label: "(GMT +06:00) Bishkek, Chagos, Dacca, and others",
  },
  {
    value: "Asia/Rangoon",
    label: "(GMT +06:30) Cocos, Rangoon, Yangon",
  },
  {
    value: "Antarctica/Davis",
    label: "(GMT +07:00) Bangkok, Barnaul, Christmas, and others",
  },
  {
    value: "Antarctica/Casey",
    label: "(GMT +08:00) Brunei, Casey, Choibalsan, and others",
  },
  {
    value: "Australia/Eucla",
    label: "(GMT +08:45) Eucla",
  },
  {
    value: "Asia/Chita",
    label: "(GMT +09:00) Chita, Dili, GMT-9, and others",
  },
  {
    value: "Australia/Adelaide",
    label: "(GMT +09:30) Adelaide, Broken Hill, Darwin, and others",
  },
  {
    value: "Antarctica/DumontDUrville",
    label: "(GMT +10:00) ACT, Brisbane, Canberra, and others",
  },
  {
    value: "Australia/LHI",
    label: "(GMT +10:30) LHI, Lord Howe",
  },
  {
    value: "Asia/Magadan",
    label: "(GMT +11:00) Bougainville, Efate, GMT-11, and others",
  },
  {
    value: "Antarctica/McMurdo",
    label: "(GMT +12:00) Anadyr, Auckland, Fiji, and others",
  },
  {
    value: "NZ-CHAT",
    label: "(GMT +12:45) Chatham, NZ-CHAT",
  },
  {
    value: "Etc/GMT-13",
    label: "(GMT +13:00) Apia, Enderbury, Fakaofo, and others",
  },
  {
    value: "Etc/GMT-14",
    label: "(GMT +14:00) GMT-14, Kiritimati",
  },
];

export const timeOptions = Array.from({ length: 24 }, (_, index) => {
  const hour = Math.floor(index / 2) + 1;
  const isHalfHour = index % 2 !== 0;
  const value = isHalfHour ? hour + 0.5 : hour;

  const hourText = hour === 1 ? "1 hour" : `${hour} hours`;
  const minuteText = isHalfHour ? "30 minutes" : "";

  return {
    value: value.toString(),
    label: minuteText ? `${hourText} ${minuteText}` : hourText,
  };
});

export const workingLegends = (isLightMode: boolean) => [
  {
    color: isLightMode ? "#C5FFD1" : "rgba(49, 117, 116, 1)",
    label: "Actively Working",
  },
  {
    color: isLightMode ? "#FFE0B2" : "rgba(212, 155, 84, 1)",
    label: "Partially Active",
  },
  {
    color: isLightMode ? "#FFCDD2" : "rgba(255, 156, 156, 1)",
    label: "Less Active",
  },
  {
    color: isLightMode ? "#A8A8A8" : "rgba(47, 47, 56, 1)",
    label: "No Activity",
  },
];

export const idleLegends = (isLightMode: boolean) => [
  {
    color: isLightMode ? "#C5FFD1" : "rgba(49, 117, 116, 1)",
    label: "Less Idle",
  },
  {
    color: isLightMode ? "#FFE0B2" : "rgba(212, 155, 84, 1)",
    label: "Partially Idle",
  },
  {
    color: isLightMode ? "#FFCDD2" : "rgba(255, 156, 156, 1)",
    label: "Mostly Idle",
  },
  {
    color: isLightMode ? "#A8A8A8" : "rgba(47, 47, 56, 1)",
    label: "No Activity",
  },
];
