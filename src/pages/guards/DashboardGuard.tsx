import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Outlet, useNavigate } from "react-router-dom";
import { APP_PATHS } from "../../utils/constants";
import { useEffect } from "react";

const DashboardGuard = () => {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const isEmployee = useSelector((state: RootState) => state.auth.isEmployee);
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate(APP_PATHS.login);
    } else {
      if (isEmployee && userId) {
        navigate(APP_PATHS.employeeDashboard(userId));
      }
    }
  }, [isLoggedIn, isEmployee, userId, navigate]);

  return <Outlet />;
};

export default DashboardGuard;