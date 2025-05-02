import { styled, TextField } from "@mui/material";

export const PanelTextField = styled(TextField)(({ theme }) => ({
  backgroundColor: theme.palette.grey[600],
  border: "none",
  borderRadius: "4px",
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
    borderRadius: "4px",
  },
  "& .MuiInputBase-input": {
    padding: "10px 12px",
    boxSizing: "border-box",
    borderRadius: "4px",
  },
  "& .MuiOutlinedInput-input": {
    padding: "10px 12px",
    height: "100%",
    boxSizing: "border-box",
    borderRadius: "4px",
  },
}));
