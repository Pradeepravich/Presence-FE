import {
  Drawer as MuiDrawer,
  Box,
  Typography,
  IconButton,
  Stack,
  useTheme,
  DialogContent,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { ReactNode } from "react";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string | ReactNode;
  children: ReactNode;
  footerContent?: ReactNode;
  width?: number | string;
}

const Drawer: React.FC<DrawerProps> = ({
  open,
  onClose,
  title,
  children,
  footerContent,
  width = 600,
}) => {
  const theme = useTheme();

  return (
    <MuiDrawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: width,
          backgroundColor:
            theme.palette.mode === "light" ? "#FFFFFF" : "#0d0d17",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            p: "10px 20px",
            backgroundColor: "grey.700",
            borderBottom: "1px solid",
            borderColor: theme.palette.divider,
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h4" fontWeight={600}>
              {title}
            </Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </Box>

        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
          }}
        >
          <DialogContent sx={{ flexGrow: 1 }}>{children}</DialogContent>
        </Box>

        {footerContent && (
          <Box
            sx={{
              position: "sticky",
              bottom: 0,
              zIndex: 10,
              px: 4,
              pt: 1,
              pb: 3,
              width: "100%",
            }}
          >
            <Stack sx={{ width: "100%" }}>{footerContent}</Stack>
          </Box>
        )}
      </Box>
    </MuiDrawer>
  );
};

export default Drawer;
