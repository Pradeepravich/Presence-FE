import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Outlet, useNavigate } from "react-router-dom";
import { APP_PATHS } from "../../utils/constants";
import { useEffect } from "react";

const ProjectAdminGuard = () => {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const isProjectAdmin = useSelector(
    (state: RootState) => state.auth.isProjectAdmin
  );
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate(APP_PATHS.login);
    } else {
      if (!isProjectAdmin && !user?.is_admin) {
        navigate(APP_PATHS.dashboard);
      }
    }
  }, [isProjectAdmin, isLoggedIn, navigate, user?.is_admin]);

  return <Outlet />;
};

export default ProjectAdminGuard;
