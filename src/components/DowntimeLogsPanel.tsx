import { Drawer, useTheme } from "@mui/material";
import { useState } from "react";
import { DateRange } from "./design-system/date-range/DateRangePicker";
import moment from "moment";
import DowntimeLogs from "./DowntimeLogs";

interface PanelProps {
  show: boolean;
  onClose: () => void;
}

const initialStartOfWeek = moment().startOf("week");
const initialEndOfWeek = moment().endOf("week");

const DowntimeLogsPanel = ({ show, onClose }: PanelProps) => {
  const [range, setRange] = useState<DateRange>([
    initialStartOfWeek,
    initialEndOfWeek,
  ]);
  const handleClosePanel = () => {
    setRange([moment().startOf("week"), moment().endOf("week")]);
    onClose();
  };
  const theme = useTheme();

  return (
    <Drawer
      open={show}
      anchor="right"
      variant="temporary"
      sx={{
        "& .MuiDrawer-paper": {
          width: {
            lg: 600,
            xs: "80%",
            backgroundColor:
              theme.palette.mode === "light" ? "#FFFFFF" : "#0d0d17",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          },
        },
      }}
      onClose={handleClosePanel}
      SlideProps={{ unmountOnExit: true }}
    >
      <DowntimeLogs
        range={range}
        setRange={setRange}
        handleClosePanel={handleClosePanel}
      />
    </Drawer>
  );
};

export default DowntimeLogsPanel;
