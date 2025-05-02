import { useMemo, useState } from "react";
import { AutoCompleteMultipleOption } from "../../components/design-system/AutoCompleteMultiple";
import AutoCompleteSingle from "../../components/design-system/AutoCompleteSingle";
import { useUserDropdownApi } from "../../services/useUserDropdownApi";
import useDebouncedValue from "../../hooks/useDebouncedValue";

interface props {
  getSearchedEmployee: (val: AutoCompleteMultipleOption | null) => void;
}
const EmployeeAutoComplete = ({ getSearchedEmployee }: props) => {
  const [user, setUser] = useState("");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);

  const params = useMemo(
    () => ({
      query: debouncedSearch,
      sort: "name",
      isAll: true,
    }),
    [debouncedSearch]
  );

  const { value: userSearchResults } = useUserDropdownApi(params);

  const userOptions: AutoCompleteMultipleOption[] = useMemo(
    () =>
      userSearchResults?.results?.map?.((user) => ({
        label: user.name,
        value: user.id.toString(),
      })) || [],
    [userSearchResults]
  );

  const handleChange = (val: AutoCompleteMultipleOption | null) => {
    getSearchedEmployee(val);
    setUser(val?.value || "");
  };

  return (
    <AutoCompleteSingle
      options={userOptions}
      selectedOption={user}
      inputValue={search}
      setInputValue={setSearch}
      onChange={handleChange}
      placeholder="Search Employee"
    />
  );
};

export default EmployeeAutoComplete;
