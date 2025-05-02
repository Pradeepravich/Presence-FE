import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Outlet, useNavigate } from "react-router-dom";
import { APP_PATHS } from "../../utils/constants";
import { useEffect } from "react";

const AdminGuard = () => {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const isAdmin = useSelector((state: RootState) => state.auth.user?.is_admin);
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate(APP_PATHS.login);
    } else {
      if (!isAdmin && userId) {
        navigate(APP_PATHS.employeeDashboard(userId));
      }
    }
  }, [isAdmin, isLoggedIn, navigate, userId]);

  return <Outlet />;
};

export default AdminGuard;
