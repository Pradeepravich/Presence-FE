import { useTheme } from "@mui/material";

const ExpandMoreDownIcon = () => {
  const theme = useTheme();
  return (
    <svg
      width="16"
      height="17"
      viewBox="0 0 16 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_9749_9679)">
        <path
          d="M10.5867 6.695L7.99999 9.28167L5.41332 6.695C5.15332 6.435 4.73332 6.435 4.47332 6.695C4.21332 6.955 4.21332 7.375 4.47332 7.635L7.53332 10.695C7.79332 10.955 8.21332 10.955 8.47332 10.695L11.5333 7.635C11.7933 7.375 11.7933 6.955 11.5333 6.695C11.2733 6.44167 10.8467 6.435 10.5867 6.695Z"
          fill={theme.palette.mode === "light" ? "black" : "white"}
        />
      </g>
      <defs>
        <clipPath id="clip0_9749_9679">
          <rect
            width="16"
            height="16"
            fill="white"
            transform="translate(0 0.5)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export default ExpandMoreDownIcon;
