import { Box, Stack, Typography } from "@mui/material";

const WorkingIcon = () => {
  return (
    <Stack direction="row" alignItems="center" gap={0.5}>
      <Box
        sx={{
          width: 8,
          height: 8,
          background: "#028AF6",
          borderRadius: "50%",
        }}
      />
      <Typography
        sx={{
          color: "text.dark",
          fontSize: 10,
          fontFamily: "Sora",
          fontWeight: 400,
          wordWrap: "break-word",
        }}
      >
        {"Working"}
      </Typography>
    </Stack>
  );
};

export default WorkingIcon;
