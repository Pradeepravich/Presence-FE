import { Button, Stack, Typography, useTheme } from "@mui/material";
import LayoutComponent from "../components/LayoutComponent";
import MicrosoftButton from "../components/design-system/MicrosoftButton";
import { APP_PATHS, OAUTH_CONFIG } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import MicrosoftLogo from "../assets/microsoft.svg";
import SideBannerSection from "../components/SideBannerSection";
import TeamsLogo from "../assets/teams-logo.svg";
import StackularLogo from "../assets/stackular-logo.svg";
import StackularLogoDark from "../assets/stackular-logo-dark.svg";

const Signup = () => {
  const navigate = useNavigate();
  const redirectToSignup = () => {
    window.location.href = OAUTH_CONFIG.register;
  };
  const theme = useTheme();

  return (
    <LayoutComponent pb={false}>
      <Stack direction="row" width="100%" position="relative" height="100vh">
        <SideBannerSection />
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          width={{ xs: "100%", lg: 500 }}
          gap={7}
          // sx={{
          //   background:
          //     theme.palette.mode === "light"
          //       ? "#ffffff"
          //       : "linear-gradient(180deg, rgba(127, 127, 213, 0.3) 0%, rgba(134, 168, 231, 0.3) 50%, rgba(145, 234, 228, 0.3) 100%)",
          // }}
        >
          <Stack
            direction="column"
            spacing={3}
            justifyContent="center"
            alignItems="center"
            width="305px"
          >
            <Stack
              direction="column"
              spacing="9px"
              justifyContent="center"
              alignItems="center"
            >
              <Typography variant="h3">If you are a new user</Typography>
              <Typography variant="body2" color={theme.palette.grey[100]}>
                Please create a account with us.
              </Typography>
            </Stack>
            <Stack alignItems="center" width="100%">
              <MicrosoftButton
                title={
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <img src={TeamsLogo} alt="Teams Logo" />
                    <Typography variant="h3">
                      Open in Microsoft Teams
                    </Typography>
                  </Stack>
                }
                onClick={redirectToSignup}
              />
            </Stack>
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              width="100%"
            >
              <Typography
                variant="body2"
                color={theme.palette.grey[300]}
                my={1}
              >
                or
              </Typography>
            </Stack>
            <Stack alignItems="center" width="100%">
              <MicrosoftButton
                title={
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <img src={MicrosoftLogo} alt="Microsoft Logo" />
                    <Typography variant="h3">Sign Up with Microsoft</Typography>
                  </Stack>
                }
                onClick={redirectToSignup}
              />
            </Stack>
          </Stack>
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="center"
          >
            <Typography variant="h5">Already an existing user ? </Typography>
            <Button
              variant="text"
              size="small"
              sx={{
                textTransform: "none",
              }}
              onClick={() => navigate(APP_PATHS.login)}
            >
              Sign In
            </Button>
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

export default Signup;
