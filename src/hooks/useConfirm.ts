import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { DialogSettings } from "../utils/types";
import {
  confirmAsync,
  confirmDialog,
  cancelDialog,
  closeDialog,
} from "../redux/ConfirmPopupSlice";

const useConfirm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { open, dialogSettings } = useSelector(
    (state: RootState) => state.confirm
  );

  const confirm = useCallback(
    (settings: Partial<DialogSettings>) => dispatch(confirmAsync(settings)),
    [dispatch]
  );

  const onConfirm = useCallback(() => {
    dispatch(confirmDialog());
  }, [dispatch]);

  const onCancel = useCallback(() => {
    dispatch(cancelDialog());
  }, [dispatch]);

  const onClose = useCallback(() => {
    dispatch(closeDialog());
  }, [dispatch]);

  return {
    confirm,
    onConfirm,
    onCancel,
    onClose,
    open,
    dialogSettings,
  };
};

export default useConfirm;
