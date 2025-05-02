import { InfoOutlined } from "@mui/icons-material";
import { Stack, Typography } from "@mui/material";
import Tooltip from "../../components/design-system/Tooltip";

interface props {
  children: string;
  title?: string;
}
const Description = ({ children, title }: props) => (
  <Stack direction={"row"} gap={0.5} alignItems="center">
    <Typography>{children}</Typography>
    <Tooltip title={title}>
      <InfoOutlined style={{ fontSize: 12 }} />
    </Tooltip>
  </Stack>
);

export default Description;
