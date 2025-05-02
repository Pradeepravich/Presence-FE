import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Outlet, useNavigate } from "react-router-dom";
import { APP_PATHS } from "../../utils/constants";
import { useEffect } from "react";

const GuestGuard = () => {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
      navigate(APP_PATHS.dashboard);
    }
  }, [isLoggedIn, navigate]);

  return <Outlet />;
};

export default GuestGuard;
