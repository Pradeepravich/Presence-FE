import { Stack, Typography, useTheme } from "@mui/material";
import LayoutComponent from "../components/LayoutComponent";
import MicrosoftButton from "../components/design-system/MicrosoftButton";
import MicrosoftLogo from "../assets/microsoft.svg";
import Logo from "../assets/logo1.png";
import DarkModeLogo from "../assets/dark-mode-logo.svg";
import { APP_PATHS, OAUTH_CONFIG } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import SideBannerSection from "../components/SideBannerSection";
import StackularLogo from "../assets/stackular-logo.svg";
import StackularLogoDark from "../assets/stackular-logo-dark.svg";

const Login = () => {
  const navigate = useNavigate();
  const redirectToLogin = () => {
    window.location.href = OAUTH_CONFIG.login;
  };
  const theme = useTheme();
  const LogoSrc = theme.palette.mode === "light" ? Logo : DarkModeLogo;

  return (
    <LayoutComponent pb={false}>
      <Stack direction="row" width="100%" position="relative" height="100vh">
        <SideBannerSection />
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          width={{ xs: "100%", lg: 500 }}
          py={3}
          gap={7}
        >
          <img src={LogoSrc} alt="brand-logo" height={50} />
          <Stack
            direction="column"
            spacing={3}
            justifyContent="center"
            alignItems="center"
          >
            <Typography variant="h4">If you are an existing user</Typography>

            <MicrosoftButton
              title={
                <Stack direction="row" alignItems="center" spacing={2}>
                  <img src={MicrosoftLogo} alt="Microsoft logo" />
                  <Typography variant="h3">Sign in with Microsoft</Typography>
                </Stack>
              }
              onClick={redirectToLogin}
            />
          </Stack>

          <Stack
            direction="column"
            spacing={3}
            justifyContent="center"
            alignItems="center"
          >
            <Typography variant="h4">If you are a new user</Typography>
            <MicrosoftButton
              title={
                <Typography variant="h3">Create account with us</Typography>
              }
              onClick={() => navigate(APP_PATHS.signup)}
            />
          </Stack>
          <Stack direction="column" alignItems="center" gap={1}>
            <Typography variant="subtitle1" mb={0.5}>
              Powered by
            </Typography>
            <img
              src={
                theme.palette.mode === "light"
                  ? StackularLogo
                  : StackularLogoDark
              }
              alt="logo"
            />
          </Stack>
        </Stack>
      </Stack>
    </LayoutComponent>
  );
};

export default Login;
