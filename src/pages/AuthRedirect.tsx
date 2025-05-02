import { Stack, Typography } from "@mui/material";
import LayoutComponent from "../components/LayoutComponent";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { useMSLoginApi } from "../services/useMSLoginApi";
import { useMSRegisterApi } from "../services/useMSRegisterApi";
import { useDispatch } from "react-redux";
import { login } from "../redux/AuthSlice";
import { APP_PATHS } from "../utils/constants";

const AuthRedirect = () => {
  const [params] = useSearchParams();
  const code = useMemo(() => params.get("code") as string, [params]);
  const state = useMemo(() => params.get("state"), [params]);

  const { loginUser } = useMSLoginApi(code);
  const { registerUser } = useMSRegisterApi(code);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (code) {
      if (state === "login") {
        loginUser()
          .then((data) => {
            dispatch(login(data));
          })
          .catch(() => {
            navigate(APP_PATHS.login);
          });
      } else if (state === "register") {
        registerUser()
          .then((data) => {
            dispatch(login(data));
          })
          .catch((err) => {
            if (err.status === 409) {
              navigate(APP_PATHS.login);
            } else {
              navigate(APP_PATHS.signup);
            }
          });
      }
    } else {
      navigate(APP_PATHS.login);
    }
  }, [code, dispatch, loginUser, navigate, registerUser, state]);

  return (
    <LayoutComponent>
      <Stack
        alignItems="center"
        justifyContent="center"
        width="100%"
        height="30vh"
      >
        <Typography variant="h2">Hang on while we redirect you...</Typography>
      </Stack>
    </LayoutComponent>
  );
};

export default AuthRedirect;
