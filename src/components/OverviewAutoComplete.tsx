import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import useDebouncedValue from "../hooks/useDebouncedValue";
import { useAllProjectsApi } from "../services/useAllProjectsApi";
import { useUserDropdownApi } from "../services/useUserDropdownApi";
import useGetLocationsApi from "../services/useGetLocationsApi";
import {
  AnalysisLevelType,
  analysisLevelVal,
} from "../services/useAnalyticsApi";
import AutoCompleteSingle, {
  AutoCompleteSingleOption,
} from "./design-system/AutoCompleteSingle";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { getExtremeChildren } from "../utils/LinearToTreeArrayFormat";
import { useAllShiftsApi } from "../services/useAllShiftsApi";

interface props {
  analysisLevel: AnalysisLevelType;
  filterValue: string;
  handleChange: (val: AutoCompleteSingleOption | null) => void;
}

const OverviewAutoComplete = ({
  analysisLevel,
  filterValue,
  handleChange,
}: props) => {
  const [search, setSearch] = useState("");
  const { isEmployee } = useSelector((state: RootState) => state.auth);

  const { user } = useSelector((state: RootState) => state.auth);

  const query = useDebouncedValue(search);
  const { locations } = useGetLocationsApi();

  const { value: projectData, fetchTenantData: loadProjects } =
    useAllProjectsApi(false, false);
  const { value: shifts, fetchTenantData: loadShifts } = useAllShiftsApi(
    false,
    false
  );
  const cachedParams = useMemo(
    () => ({
      query,
      sort: "name",
    }),
    [query]
  );
  const { value: userSearchResults, execute: loadUsers } = useUserDropdownApi(
    cachedParams,
    analysisLevel === analysisLevelVal.emp
  );

  const options = useMemo(() => {
    switch (analysisLevel) {
      case analysisLevelVal.emp:
        return !isEmployee ? userSearchResults?.results || [] : undefined;
      case analysisLevelVal.proj:
        return projectData || [];
      case analysisLevelVal.loc:
        return locations ? getExtremeChildren(locations) : [];
      case analysisLevelVal.shift:
        return shifts || [];
      default:
        return undefined;
    }
  }, [
    analysisLevel,
    isEmployee,
    userSearchResults,
    projectData,
    locations,
    shifts,
  ]);

  const dropdownOptions = useMemo(
    () =>
      options?.map((op) => ({
        label: op.name.toString(),
        value: op.id.toString(),
      })),
    [options]
  );

  const analysisLevelRef = useRef(analysisLevel);

  useLayoutEffect(() => {
    if (
      dropdownOptions &&
      dropdownOptions.length > 0 &&
      analysisLevelRef.current !== analysisLevel
    ) {
      analysisLevelRef.current = analysisLevel;
      handleChange(dropdownOptions[0]);
    }
    if (isEmployee && user)
      handleChange({ value: user.id.toString(), label: user.display_name });
  }, [
    analysisLevel,
    handleChange,
    isEmployee,
    dropdownOptions?.length,
    user,
    dropdownOptions,
  ]);

  useEffect(() => {
    switch (analysisLevel) {
      case analysisLevelVal.emp:
        if (!userSearchResults) loadUsers();
        break;
      case analysisLevelVal.proj:
        if (!projectData) loadProjects();
        break;
      case analysisLevelVal.shift:
        if (!shifts) loadShifts();
        break;
    }
  }, [
    analysisLevel,
    loadProjects,
    loadShifts,
    loadUsers,
    projectData,
    shifts,
    userSearchResults,
  ]);

  return dropdownOptions ? (
    <AutoCompleteSingle
      options={dropdownOptions}
      selectedOption={filterValue}
      inputValue={search}
      setInputValue={setSearch}
      onChange={handleChange}
      backgroundColor="white"
      testId={`overview-autocomplete-${analysisLevel}`}
      height="33px"
    />
  ) : (
    <></>
  );
};

export default OverviewAutoComplete;
