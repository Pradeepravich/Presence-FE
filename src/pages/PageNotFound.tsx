import { Stack, Typography } from "@mui/material";
import PageNotFoundLogo from "../assets/page-not-found.svg";
import LayoutComponent from "../components/LayoutComponent";

const PageNotFound = () => {
  return (
    <LayoutComponent>
      <Stack justifyContent="center" alignItems="center" height="100vh">
        <Stack
          justifyContent="center"
          alignItems="center"
          gap={3}
          flexDirection="column"
        >
          <img src={PageNotFoundLogo} alt="Page not found logo" />

          <Stack
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
          >
            <Typography
              variant="body1"
              color="primary"
              fontWeight={600}
              lineHeight={3}
            >
              Oops!! Page not found.
            </Typography>
            <Typography
              variant="body2"
              color="secondary"
              fontWeight={300}
              lineHeight={2}
            >
              This page is no longer there.
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </LayoutComponent>
  );
};

export default PageNotFound;
