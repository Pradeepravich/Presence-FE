import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Stack,
  IconButton,
  useTheme,
} from "@mui/material";
import {
  closeDialog,
  confirmDialog,
  cancelDialog,
} from "../redux/ConfirmPopupSlice";
import { AppDispatch, RootState } from "../redux/store";
import { Close } from "@mui/icons-material";

const ConfirmDialog = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { dialogSettings, open } = useSelector(
    (state: RootState) => state.confirm
  );

  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={dialogSettings?.onClose || (() => dispatch(closeDialog()))}
      fullWidth
      maxWidth="xs"
      sx={{ color: theme.palette.common.black }}
    >
      {dialogSettings?.title && (
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          position="relative"
        >
          <DialogTitle
            sx={{
              backgroundColor: "grey.700",
              width: "100%",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {dialogSettings.title}
          </DialogTitle>
          <IconButton
            sx={{
              position: "absolute",
              top: "5px",
              right: "5px",
              cursor: "pointer",
            }}
            onClick={() => dispatch(cancelDialog())}
          >
            <Close />
          </IconButton>
        </Stack>
      )}
      {dialogSettings?.content && (
        <DialogContent
          sx={{
            background: theme.palette.mode === "dark" ? "#555555" : "initial",
          }}
        >
          {dialogSettings.content}
        </DialogContent>
      )}

      <DialogActions
        sx={{
          justifyContent: "center",
          background: theme.palette.mode === "dark" ? "#555555" : "initial",
          pb: 2.5,
        }}
      >
        {!dialogSettings?.hasNoConfirmButton && (
          <Button
            onClick={() => dispatch(confirmDialog())}
            variant="contained"
            sx={{
              backgroundColor: "#E57373",
              color: theme.palette.mode === "dark" ? "#555555" : "#ffffff",
            }}
          >
            {dialogSettings?.confirmButtonText || "Yes"}
          </Button>
        )}
        <Button
          onClick={() => dispatch(cancelDialog())}
          variant="contained"
          sx={{
            bgcolor: dialogSettings?.cancelColor,
            color: theme.palette.mode === "dark" ? "#555555" : "#ffffff",
          }}
        >
          {dialogSettings?.cancelButtonText || "Cancel"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
