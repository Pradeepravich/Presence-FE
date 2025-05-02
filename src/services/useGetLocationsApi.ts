import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { clearLocations, fetchLocations } from "../redux/SettingsSlice";

export interface LocationItem {
  id: number;
  name: string;
  timezone: string;
  created_at: string;
  updated_at?: string;
  is_deleted: boolean;
  parent: number | null;
  subLocations?: LocationItem[];
}

const MAX_ERROR_COUNT = 3;

const useGetLocationsApi = () => {
  const dispatch = useDispatch<AppDispatch>();
  const locations = useSelector((state: RootState) => state.settings.locations);
  const areLocationsLoading = useSelector(
    (state: RootState) => state.settings.areLocationsLoading
  );
  const fetchError = useSelector(
    (state: RootState) => state.settings.locationsError
  );

  const [errorCount, setErrorCount] = useState(0);

  useEffect(() => {
    if (fetchError) {
      setErrorCount((prev) => prev + 1);
    } else {
      setErrorCount(0);
    }
  }, [fetchError]);

  useEffect(() => {
    if (errorCount >= MAX_ERROR_COUNT) return;

    if (!locations && !areLocationsLoading) {
      dispatch(fetchLocations());
    }
  }, [areLocationsLoading, dispatch, locations, errorCount]);

  const refresh = useCallback(() => {
    if (errorCount < MAX_ERROR_COUNT) {
      dispatch(clearLocations());
      dispatch(fetchLocations());
    }
  }, [dispatch, errorCount]);

  return { locations, refresh, areLocationsLoading, errorCount };
};

export default useGetLocationsApi;
