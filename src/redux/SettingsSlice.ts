import { PaletteMode } from "@mui/material";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axios";
import { API_ENDPOINTS } from "../utils/constants";
import { LocationItem } from "../services/useGetLocationsApi";

export interface TenantData {
  id: number;
  schema_name: string;
  name: string;
  created_on: string;
  timezone: string;
  overtime_threshold: number;
  night_hawks_start: string | null;
  night_hawks_end: string | null;
  early_birds_start: string | null;
  early_birds_end: string | null;
  regular_working_hours_end: string | null;
  regular_working_hours_start: string | null;
  timeline_hours_end: string | null;
  timeline_hours_start: string | null;
  fetch_presence_in_minutes: number;
}

export interface Settings {
  mode: PaletteMode;
  tenant: TenantData | null;
  locations: null | LocationItem[];
  locationsError?: Error;
  areLocationsLoading: boolean;
}

const initialSettingsState: Settings = {
  mode: (localStorage.getItem("theme") || "light") as PaletteMode,
  tenant: null,
  locations: null,
  locationsError: undefined,
  areLocationsLoading: false,
};

export const fetchLocations = createAsyncThunk(
  "settings/fetchLocations",
  async () => {
    const response = await axiosInstance.get(
      API_ENDPOINTS.newSettings.locations
    );
    return response.data;
  }
);

const settingsSlice = createSlice({
  name: "settings",
  initialState: initialSettingsState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
      localStorage.setItem("theme", state.mode);
    },
    setTenant: (state, action: PayloadAction<TenantData | null>) => {
      state.tenant = action.payload;
    },
    clearLocations: (state) => {
      state.locations = null;
      state.areLocationsLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLocations.pending, (state) => {
        state.areLocationsLoading = true;
      })
      .addCase(fetchLocations.fulfilled, (state, action) => {
        state.areLocationsLoading = false;
        state.locations = action.payload;
        state.locationsError = undefined;
      })
      .addCase(fetchLocations.rejected, (state) => {
        state.areLocationsLoading = false;
        state.locations = null;
        state.locationsError = new Error("Failed to fetch locations");
      });
  },
});

export const { toggleTheme, setTenant, clearLocations } = settingsSlice.actions;
export default settingsSlice.reducer;
