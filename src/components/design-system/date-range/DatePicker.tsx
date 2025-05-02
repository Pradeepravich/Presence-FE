  import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
  import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
  import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers/DatePicker";
  import { FC, useEffect, useRef, useState } from "react";
  import { Box } from "@mui/material";
  import moment, { Moment } from "moment";
  import useBgColor from "../../../hooks/useBgColor";
  import ExpandMoreDownIcon from "../../icons/ExpandMoreDownIcon";

interface DatePickerProps {
  value: Moment | null;
  onChange: (date: Moment | null) => void;
  backgroundColor?: string;
  testId?: string;
  width?: string;
  disableFuture?: boolean;
  maxDate?: Moment;
  shouldDisableDate?: (date: Moment) => boolean;
  readOnly?: boolean;
  height?: string; // Added height prop
  forcedColor?: string;
}

const DatePicker: FC<DatePickerProps> = ({
  value,
  onChange,
  backgroundColor,
  forcedColor,
  testId,
  width = "190px",
  disableFuture = true,
  maxDate,
  shouldDisableDate,
  readOnly = true,
  height = "33px",
}) => {
  const { bgColor } = useBgColor(backgroundColor);
  const isTodaySelected = value?.isSame(moment(), "day");
  const [open, setOpen] = useState(false);

    const CustomExpandIcon: FC<{
      className?: string;
    }> = ({ className }) => {
      return (
        <div className={className} onClick={() => setOpen(!open)}
        style={{
          width: "32px",
          height: "32px",  
        }}>
          <ExpandMoreDownIcon />
        </div>
      );
    };
    // Ref to access the input field inside the DatePicker
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
      moment.updateLocale("en", {
        week: {
          dow: 0,
        },
      });
    }, []);

  return (
    <Box sx={{ "& input": { cursor: "pointer" }, display: "inline-block" }}>
      <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en">
        <MuiDatePicker
          open={open}
          onClose={() => setOpen(false)}
          slotProps={{
            actionBar: { actions: ["today"] },
            textField: {
              sx: {
                "& .MuiInputBase-root": {
                  paddingRight: "16px",
                  paddingTop: 0,
                  height,
                  display: "flex",
                  alignItems: "center",
                },
                "& input": {
                  paddingTop: "9px",
                  paddingBottom: "9px",
                },
                "& fieldset": { display: "none" },
                backgroundColor: forcedColor || bgColor,
                borderRadius: "4px",
                width: width,
              },
              inputProps: {
                readOnly,
                ref: inputRef, // Attach the ref to the input field
              },
              onClick: () => {
                setOpen(true);
              },
            },
            day: {
              sx: {
                "&.Mui-disabled": {
                  color: "grey.500",
                },
              },
            },
          }}
          value={value}
          onChange={onChange}
          disableFuture={disableFuture}
          maxDate={maxDate}
          shouldDisableDate={shouldDisableDate}
          closeOnSelect
          format={isTodaySelected ? "Today (DD MMM YYYY)" : "DD MMM YYYY"}
          slots={{
            openPickerIcon: CustomExpandIcon,
          }}
          data-testid={testId}
        />
      </LocalizationProvider>
    </Box>
  );
};

  export default DatePicker;
