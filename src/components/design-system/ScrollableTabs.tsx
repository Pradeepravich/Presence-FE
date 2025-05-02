import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { IconButton, Stack, Tabs } from "@mui/material";
import { PropsWithChildren } from "react";

const ScrollableTabs = ({ children }: PropsWithChildren) => {
  return (
    <Tabs
      scrollButtons
      variant="scrollable"
      ScrollButtonComponent={(p) => {
        return (
          <Stack onClick={p.onClick}>
            <IconButton size="small">
              {p.direction === "left" ? <ChevronLeft /> : <ChevronRight />}
            </IconButton>
          </Stack>
        );
      }}
      value={false}
      sx={{ minHeight: "unset" }}
    >
      {children}
    </Tabs>
  );
};

export default ScrollableTabs;
