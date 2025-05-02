import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  Popover,
  Stack,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import NightlightOutlinedIcon from "@mui/icons-material/NightlightOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
// import LogoutIcon from "@mui/icons-material/Logout";
import Logo from "../assets/logo.svg";
import { FC, PropsWithChildren, useCallback, useMemo, useState } from "react";
import { RootState } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import DowntimeLogsPanel from "./DowntimeLogsPanel";
import useBoolean from "../hooks/useBoolean";
import IconImage from "./design-system/date-range/IconImage";
import { APP_PATHS } from "../utils/constants";
import { toggleTheme } from "../redux/SettingsSlice";
import Link from "./design-system/Link";
import organization from "../assets/organization.svg";
import Tooltip from "./design-system/Tooltip";
import CardComponent from "./design-system/Card";

export const IconButtonBase = styled(ButtonBase)(({ theme }) => ({
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
  paddingTop: theme.spacing(0.2),
  paddingBottom: theme.spacing(0.2),
  borderRadius: theme.shape.borderRadius,
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const Header = styled("header")(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#0f1515" : "#202020",
  color: theme.palette.common.white,
  padding: theme.spacing(1),
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  paddingLeft: theme.spacing(4),
  paddingRight: theme.spacing(4),
  height: 40,
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  zIndex: theme.zIndex.appBar,
}));

const NavLink = styled(Link)<{ isSelected?: boolean }>(
  ({ theme, isSelected }) => ({
    textDecoration: "none",
    color: theme.palette.common.white,
    fontSize: "10px",
    fontWeight: 600,
    padding: "14px 16px",
    backgroundColor: isSelected ? "rgba(255, 255, 255, 0.1)" : "none",
    borderTop: isSelected ? "1px solid #FFFFFF" : "none",
    height: "40px",
    "&:hover": {
      color: theme.palette.common.white,
    },
  })
);

interface Props extends PropsWithChildren {
  pb?: boolean;
}

const LayoutComponent: FC<Props> = ({ children }) => {
  const theme = useTheme();
  const { isLoggedIn, user } = useSelector((state: RootState) => state.auth);
  const mode = useSelector((state: RootState) => state.settings.mode);

  const dispatch = useDispatch();
  const { value: show, setTrue: onOpen, setFalse: onClose } = useBoolean();

  const onLogoutClick = useCallback(() => {
    dispatch({ type: "auth/logout" });
  }, [dispatch]);

  const isProjectAdmin = useSelector(
    (state: RootState) => state.auth.isProjectAdmin
  );

  const navLinks = useMemo(() => {
    const links = [
      {
        to: APP_PATHS.dashboard,
        title: "Timeline",
        isSelected: location.pathname === APP_PATHS.dashboard,
      },
      {
        to: APP_PATHS.analytics,
        title: "Analytics",
        isSelected: location.pathname === APP_PATHS.analytics,
      },
      {
        to: isProjectAdmin
          ? APP_PATHS.newSettingsPage("projects")
          : APP_PATHS.newSettingsPage("employees"),
        title: "Settings",
        isSelected: location.pathname.includes(APP_PATHS.newSettings),
      },
    ];

    if (!user?.is_admin && !isProjectAdmin) {
      return links.filter((li) => li.title !== "Settings");
    }
    return links;
  }, [isProjectAdmin, user]);

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleLogout = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <>
      <Header>
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          sx={{ flexGrow: 1, ml: -1 }}
        >
          <Link to={isLoggedIn ? APP_PATHS.dashboard : APP_PATHS.login}>
            <Stack direction="row" gap={1}>
              <img src={Logo} alt="Logo" />
              <Typography variant="h4" color="common.white">
                Presence
              </Typography>
            </Stack>
          </Link>
          {isLoggedIn && (
            <Stack direction="row">
              {navLinks.map((navLink) => (
                <NavLink
                  key={navLink.to}
                  to={navLink.to}
                  isSelected={navLink.isSelected}
                >
                  {navLink.title}
                </NavLink>
              ))}
            </Stack>
          )}
        </Stack>

        <Stack direction="row">
          {isLoggedIn && (
            <>
              <Button
                size="small"
                variant="outlined"
                onClick={onOpen}
                data-testid="downtime-logs"
              >
                Downtime Logs
              </Button>
              <Link to={APP_PATHS.orgChart}>
                <Tooltip title="Organization Chart">
                  <IconButtonBase sx={{ ml: 1, height: "100%" }}>
                    <IconImage src={organization} width={14} height={14} />
                  </IconButtonBase>
                </Tooltip>
              </Link>
            </>
          )}
          <Tooltip title={`Turn on ${mode === "dark" ? "Light" : "Dark"} mode`}>
            <IconButtonBase
              onClick={() => dispatch(toggleTheme())}
              data-testid={mode === "dark" ? "darkmode" : "lightmode"}
            >
              {mode === "dark" ? (
                <LightModeOutlinedIcon fontSize="inherit" />
              ) : (
                <NightlightOutlinedIcon fontSize="inherit" />
              )}
            </IconButtonBase>
          </Tooltip>

          {isLoggedIn && (
            <Stack direction="row" alignItems="center">
              <Avatar
                alt={user?.name}
                src={user?.profile_picture}
                sx={{
                  cursor: "pointer",
                  width: 24,
                  height: 24,
                  mx: 1.5,
                  mr: -1,
                }}
                onClick={handleLogout}
              />
              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                sx={{ mt: 1 }}
              >
                <CardComponent
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    p: 2,
                  }}
                >
                  <Avatar
                    alt={user?.name}
                    src={user?.profile_picture}
                    sx={{ cursor: "pointer", width: 40, height: 40, mx: 1 }}
                  />
                  <Typography
                    variant="h5"
                    color={theme.palette.text.primary}
                    fontSize={12}
                    my={2}
                  >
                    {user?.name}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      textTransform: "none",
                      color: "#039BE5",
                      backgroundColor: "#E1F5FE",
                    }}
                    onClick={onLogoutClick}
                  >
                    Logout
                  </Button>
                </CardComponent>
              </Popover>
            </Stack>
          )}
        </Stack>
      </Header>

      <Box height="40px" />
      {children}
      <DowntimeLogsPanel show={show} onClose={onClose} />
    </>
  );
};

export default LayoutComponent;
