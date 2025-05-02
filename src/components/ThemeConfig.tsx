import { Shadows, ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { FC, PropsWithChildren, useMemo } from "react";

const ThemeConfig: FC<PropsWithChildren> = ({ children }) => {
  const themeMode = useSelector((state: RootState) => state.settings.mode);
  const isLight = useMemo(() => themeMode === "light", [themeMode]);

  const shadow = isLight
    ? "0px 2px 4px 0px rgba(0, 0, 0, 0.12)"
    : "0px 2px 4px 0px rgba(205, 181, 181, 0.15)";
  const shadows: Shadows = ["none", ...Array(24).fill(shadow)] as Shadows;

  const theme = createTheme({
    palette: {
      mode: themeMode,
      primary: {
        main: "#039BE5",
      },
      secondary: {
        main: "#919EAB",
      },
      common: {
        black: "#000000",
        white: "#FFFFFF",
      },
      grey: {
        [100]: "#999999",
        [200]: "#F6F6F6",
        [300]: "#A8A8A8",
        [400]: isLight ? "#ECEFF1" : "#131A37",
        [500]: isLight ? "#8C8C8C" : "#ffffff",
        [600]: isLight ? "#EEEEEE80" : "#54545580",
        [700]: isLight ? "#EEEEEE" : "#0F1515",
        [800]: isLight ? "#ECEFF1" : "#222831",
        [900]: isLight ? "#555555" : "#A8A8A8",
      },
      success: {
        main: "#00BA00",
      },
      customColors: {
        100: isLight ? "#ffffff" : "#3a3a41",
        200: isLight ? "#FFCDD2" : "#FF9C9C",
        300: "#4FC3F7",
        400: "#29B6F6",
        500: "#03A9F4",
        600: "#039BE5",
        700: "#0288D1",
        800: "#0277BD",
        900: "#01579B",
      },
    },
    components: {
      MuiFab: {
        styleOverrides: {
          sizeSmall: {
            fontSize: 12,
            width: 20,
            minHeight: "unset",
            maxHeight: 20,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
          },
          contained: {
            backgroundColor: "#039BE5",
            color: "#fff",
            fontWeight: 600,
            fontSize: "10px",
            lineHeight: "12.6px",
            padding: "8px",
            borderRadius: "4px",
          },
          outlined: {
            backgroundColor: "transparent",
            color: "#fff",
            borderColor: "#fff",
            "&.MuiButton-sizeSmall": {
              fontSize: "10px",
            },
          },
          text: {
            backgroundColor: isLight ? "white" : "#555555",
            color: isLight ? "black" : "white",
            fontSize: 10,
          },
        },
      },
      MuiInput: {
        styleOverrides: {
          input: {
            "&.MuiOutlinedInput-root": {
              padding: 0,
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: isLight ? "#FFFFFF" : "#2f2f37",
            transparency: false,
          },
        },
      },
    },
    typography: {
      fontFamily: "'Sora', sans-serif",
      h1: {
        fontSize: 20,
        lineHeight: "normal",
        fontWeight: "bolder",
      },
      h2: {
        fontSize: 18,
        lineHeight: "normal",
        fontWeight: "bold",
      },
      h3: {
        fontSize: 16,
        lineHeight: "normal",
        fontWeight: "bold",
      },
      h4: {
        fontSize: 14,
        lineHeight: "normal",
        fontWeight: "bold",
      },
      h5: {
        fontSize: 12,
        lineHeight: "normal",
        fontWeight: 600,
      },
      body1: {
        fontSize: 11,
        lineHeight: "normal",
      },
      body2: {
        fontSize: 10,
        lineHeight: "normal",
      },
      subtitle1: {
        color: "#A8A8A8",
        fontSize: 9,
        lineHeight: "normal",
      },
      caption: {
        fontSize: 9,
      },
    },

    shadows,
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />

      {children}
    </ThemeProvider>
  );
};

export default ThemeConfig;
