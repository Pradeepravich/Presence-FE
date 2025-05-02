import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DialogSettings } from "../utils/types";
import { AppDispatch } from "./store";

const defaultDialogState: DialogSettings = {
  title: "Are you sure?",
  content: "Do you really wanna do this action?",
  cancelButtonText: "Cancel",
  confirmButtonText: "Yes",
  hasNoConfirmButton: false,
  width: "auto",
  cancelColor: "info",
  confirmColor: "info",
  closeIcon: true,
  onClose: undefined,
};

let resolveCallback: (result: boolean) => void = () => {};
let rejectCallback: () => void = () => {};

interface ConfirmState {
  open: boolean;
  dialogSettings: DialogSettings;
}

const initialState: ConfirmState = {
  open: false,
  dialogSettings: defaultDialogState,
};

const confirmSlice = createSlice({
  name: "confirm",
  initialState,
  reducers: {
    openDialog: (state, action: PayloadAction<Partial<DialogSettings>>) => {
      state.open = true;
      state.dialogSettings = { ...defaultDialogState, ...action.payload };
    },
    closeDialog: (state) => {
      state.open = false;
      state.dialogSettings = defaultDialogState;
      rejectCallback();
    },
    confirmDialog: (state) => {
      state.open = false;
      state.dialogSettings = defaultDialogState;
      resolveCallback(true);
    },
    cancelDialog: (state) => {
      state.open = false;
      state.dialogSettings = defaultDialogState;
      resolveCallback(false);
    },
  },
});

export const { openDialog, closeDialog, confirmDialog, cancelDialog } =
  confirmSlice.actions;

// Async function with proper types
export const confirmAsync =
  (settings: Partial<DialogSettings>) =>
  (dispatch: AppDispatch): Promise<boolean> => {
    dispatch(openDialog(settings));
    return new Promise<boolean>((resolve, reject) => {
      resolveCallback = resolve;
      rejectCallback = reject;
    });
  };

export default confirmSlice.reducer;
