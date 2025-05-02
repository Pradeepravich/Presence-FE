import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "./AuthSlice";
import SettingsReducer from "./SettingsSlice";
import ConfirmReducer from "./ConfirmPopupSlice";

export const store = configureStore({
  reducer: {
    auth: AuthReducer,
    settings: SettingsReducer,
    confirm: ConfirmReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
