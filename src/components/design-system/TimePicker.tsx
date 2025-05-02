import {
  LocalizationProvider,
  TimePicker as MuiTimePicker,
} from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import { Moment } from "moment";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTheme } from "@mui/material";

interface TimePickerProps {
  label?: string;
  value: Moment | null;
  onAccept: (value: Moment | null) => void;
  testId?: string;
  width?: string;
  height?: string;
}

const TimePickerComponent: React.FC<TimePickerProps> = ({
  label = "",
  value,
  onAccept,
  testId = "",
  width = "100%",
  height
}) => {
  const theme = useTheme();
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <div data-testid={testId}>
        <MuiTimePicker
          label={label}
          value={value}
          onAccept={onAccept}
          disableOpenPicker={false}
          slots={{
            openPickerIcon: ExpandMoreIcon,
          }}
          slotProps={{
            textField: {
              inputProps: {
                readOnly: true,
              },
              sx: {
                "& .MuiInputBase-root": {
                  paddingRight: "16px",
                  paddingTop: 0,
                  fontSize: "12px",
                  height: height || "auto"
                },
                "& input": {
                  paddingTop: "5px",
                  paddingBottom: "5px",
                },
                "& fieldset": { display: "none" },
                backgroundColor:
                  theme.palette.mode === "light" ? " #f6f6f6" : "#424146",
                borderRadius: "4px", 
                width: width,
              },
            },
          }}
          viewRenderers={{
            hours: renderTimeViewClock,
            minutes: renderTimeViewClock,
            seconds: renderTimeViewClock,
          }}
        />
      </div>
    </LocalizationProvider>
  );
};

export default TimePickerComponent;
