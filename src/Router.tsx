import { useRoutes } from "react-router-dom";
import AuthGuard from "./pages/guards/AuthGuard";
import GuestGuard from "./pages/guards/GuestGuard";
import AdminGuard from "./pages/guards/AdminGuard";
import DashboardGuard from "./pages/guards/DashboardGuard";
import ProjectAdminGuard from "./pages/guards/ProjectAdminGuard";

import useScrollToTop from "./hooks/useScrollToTop";
import { APP_PATHS } from "./utils/constants";

// Direct imports — no lazy loading
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AuthRedirect from "./pages/AuthRedirect";
import Dashboard from "./pages/Dashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import Overview from "./pages/Overview";
import SettingsPage from "./pages/SettingsPage";
import Config from "./pages/Settings";
import Projects from "./sections/settings/Projects";
import Holidays from "./sections/settings/HolidaysContent";
import Alerts from "./sections/settings/Alerts";
import ShiftTabs from "./sections/settings/ShiftTabs";
import Employees from "./sections/settings/SettingsEmployeeTable";
import Shifts from "./sections/settings/ShiftContent";
import ShiftMappings from "./sections/settings/ShiftMappings";
import PageNotFound from "./pages/PageNotFound";
import ManageLocations from "./pages/ManageLocations";
import OrgChart from "./pages/OrgChart";

const Router = () => {
  useScrollToTop();

  const routes = useRoutes([
    {
      path: "",
      element: <GuestGuard />,
      children: [
        { path: APP_PATHS.login, element: <Login /> },
        { path: APP_PATHS.signup, element: <Signup /> },
        { path: APP_PATHS.redirect, element: <AuthRedirect /> },
      ],
    },
    {
      path: APP_PATHS.dashboard,
      element: <DashboardGuard />,
      children: [{ path: "", element: <Dashboard /> }],
    },
    {
      path: APP_PATHS.newSettings,
      element: <SettingsPage />,
      children: [
        {
          path: APP_PATHS.employees,
          element: <AdminGuard />,
          children: [{ path: "", element: <Employees /> }],
        },
        {
          path: APP_PATHS.shifts,
          element: <AdminGuard />,
          children: [
            {
              path: "",
              element: <ShiftTabs />,
              children: [
                { path: APP_PATHS.allShifts, element: <Shifts /> },
                {
                  path: APP_PATHS.employeeShiftMapping,
                  element: <ShiftMappings />,
                },
              ],
            },
          ],
        },
        {
          path: APP_PATHS.holidays,
          element: <AdminGuard />,
          children: [{ path: "", element: <Holidays /> }],
        },
        {
          path: APP_PATHS.projects,
          element: <ProjectAdminGuard />,
          children: [{ path: "", element: <Projects /> }],
        },
        {
          path: APP_PATHS.alerts,
          element: <AdminGuard />,
          children: [{ path: "", element: <Alerts /> }],
        },
        {
          path: APP_PATHS.config,
          element: <AdminGuard />,
          children: [{ path: "", element: <Config /> }],
        },
      ],
    },
    {
      path: APP_PATHS.manageLocations,
      element: <AdminGuard />,
      children: [{ path: "", element: <ManageLocations /> }],
    },
    {
      path: "",
      element: <AuthGuard />,
      children: [
        { path: APP_PATHS.orgChart, element: <OrgChart /> },
        {
          path: APP_PATHS.employeeDashboard(":userId"),
          element: <EmployeeDashboard />,
        },
        {
          path: APP_PATHS.analytics,
          children: [{ path: "", element: <Overview /> }],
        },
      ],
    },
    {
      path: "*",
      element: <PageNotFound />,
    },
  ]);

  return routes;
};

export default Router;
