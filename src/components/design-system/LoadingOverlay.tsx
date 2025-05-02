import { Backdrop, CircularProgress } from "@mui/material";
import { FC } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

interface LoadingOverlayProps {
  isLoading: boolean;
  height?: string;
}

const LoadingOverlay: FC<LoadingOverlayProps> = ({ isLoading, height }) => {
  const themeMode = useSelector((state: RootState) => state.settings.mode);

  return (
    <Backdrop
      open={isLoading}
      sx={{
        position: "absolute",
        zIndex: 1000,
        color: "common.white",
        backgroundColor:
          themeMode === "light" ? "rgba(0, 0, 0, 0.5)" : "rgba(0, 0, 0, 0.7)",
        height,
      }}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default LoadingOverlay;
