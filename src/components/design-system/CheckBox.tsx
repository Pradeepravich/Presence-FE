import React from "react";
import { Checkbox } from "@mui/material";

const OnIcon = () => (
  <svg
    width="16"
    height="17"
    viewBox="0 0 16 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5 0.5C2.23858 0.5 0 2.73858 0 5.5V11.5C0 14.2614 2.23858 16.5 5 16.5H11C13.7614 16.5 16 14.2614 16 11.5V5.5C16 2.73858 13.7614 0.5 11 0.5H5ZM5.73875 10.6808C5.96404 10.9083 6.27101 11.0362 6.59121 11.036C6.91088 11.0369 7.21763 10.9099 7.44316 10.6833L11.3272 6.79923C11.6244 6.5019 11.6242 6.01999 11.3269 5.72284C11.0297 5.42572 10.5479 5.42572 10.2507 5.72284L6.59121 9.38231L5.29932 8.09095C5.00211 7.79383 4.51998 7.79419 4.22276 8.09131C3.92562 8.38864 3.92576 8.87055 4.2231 9.1677L5.73875 10.6808Z"
      fill="#039BE5"
    />
  </svg>
);

const OffIcon = () => (
  <svg
    width="16"
    height="17"
    viewBox="0 0 16 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="0.5" y="1" width="15" height="15" rx="4.5" stroke="#A8A8A8" />
  </svg>
);

interface CustomCheckboxProps {
  checked: boolean;
  onChange?: () => void;
  sx?: object;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  checked,
  onChange,
  sx,
}) => {
  return (
    <Checkbox
      sx={{ ...sx }}
      checked={checked}
      onChange={onChange}
      icon={<OffIcon />}
      checkedIcon={<OnIcon />}
    />
  );
};

export default CustomCheckbox;
