import { Stack, Badge, Avatar, Typography } from "@mui/material";
import { statusIcons } from "../utils/constants";

interface props {
  src?: string;
  name?: string;
  department?: string;
  availabilityStatus?: string;
}

const AvatarWithStatus = ({
  src,
  name,
  department,
  availabilityStatus,
}: props) => {
  const iconSrc = statusIcons[availabilityStatus || "Available"];

  return (
    <Stack
      spacing={1.5}
      justifyContent="center"
      direction="column"
      alignItems="center"
    >
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        badgeContent={<img src={iconSrc} alt={availabilityStatus} />}
      >
        <Avatar src={src} alt={name} sx={{ width: 56, height: 56 }} />
      </Badge>
      <Typography variant="h4">{name}</Typography>
      <Typography variant="caption">{department}</Typography>
    </Stack>
  );
};

export default AvatarWithStatus;
