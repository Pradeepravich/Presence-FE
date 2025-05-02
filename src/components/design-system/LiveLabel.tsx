import { Box, Stack, Typography, useTheme } from "@mui/material";
import { FC } from "react";

interface LiveLabelProps {
  time: string;
  direction: "row" | "column";
}

const LiveLabel: FC<LiveLabelProps> = ({ time, direction }) => {
  const theme = useTheme();

  return (
    <Stack direction={direction} alignItems="center" gap={1}>
      <Typography variant="body2" sx={{ fontWeight: "400" }}>
        LIVE STATUS
      </Typography>
      <Stack
        sx={{
          width: "fit-content",
          height: "fit-content",
        }}
        alignItems="center"
        borderRadius="4px"
        bgcolor={
          theme.palette.mode === "light" ? "#FFCDD2" : "rgba(248, 131, 131, 1)"
        }
        gap={1}
        direction="row"
        px={0.5}
        py={0.3}
      >
        <Box
          width="6px"
          height="6px"
          borderRadius="100%"
          bgcolor={
            theme.palette.mode === "light" ? "#FE7171" : "rgba(243, 60, 60, 1)"
          }
        />
        <Typography
          variant="body2"
          color={theme.palette.mode === "light" ? "common.black" : "white"}
        >
          {time}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default LiveLabel;
