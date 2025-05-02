import { useEffect, useMemo, useState } from "react";
import LayoutComponent from "../components/LayoutComponent";
import { Box, Stack } from "@mui/material";
import PresenceSection from "../sections/dashboard/PresenceSection";
import Filters from "../sections/employee-dashboard/Filters";
import usePresenceUserApi, {
  PresenceUserRequestParams,
} from "../services/usePresenceUserApi";
import moment, { Moment } from "moment";
import { useParams } from "react-router-dom";
import { usePresenceUserOverviewApi } from "../services/usePresenceUserOverviewApi";
import { getSameDayLastWeek } from "../utils/date";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import EmployeeHeader from "../sections/dashboard/EmployeeHeader";

const EmployeeDashboard = () => {
  const [workingStatus, setWorkingStatus] = useState<"working" | "idle">(
    "working"
  );
  const [startDate, setStartDate] = useState<Moment | null>(
    getSameDayLastWeek()
  );
  const [endDate, setEndDate] = useState<Moment | null>(moment().endOf("day"));
  const params = useParams();
  const user = useSelector((state: RootState) => state.auth.user);
  const isEmployee = useSelector((state: RootState) => state.auth.isEmployee);
  const authenticatedUserId = user?.id;

  const empId = useMemo(
    () => (!isEmployee ? Number(params.userId) : Number(authenticatedUserId)),
    [authenticatedUserId, isEmployee, params.userId]
  );

  const presenceUserParams: PresenceUserRequestParams = useMemo(() => {
    return {
      start_date: startDate?.format("YYYY-MM-DD") as string,
      end_date: endDate?.format("YYYY-MM-DD") as string,
      user_id: empId,
      availability: workingStatus === "working" ? "active" : "idle",
      page_size: 20,
    };
  }, [empId, endDate, startDate, workingStatus]);

  const { isLoading, data, error, hasMore, next, reset } =
    usePresenceUserApi(presenceUserParams);

  const { userPresenceOverview } = usePresenceUserOverviewApi(empId);

  useEffect(() => {
    if (empId) {
      reset();
    }
  }, [empId, reset]);

  return (
    <LayoutComponent>
      <Stack direction="row">
        <Box width={"100%"}>
          <EmployeeHeader />
          <Filters
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            name={userPresenceOverview?.name}
            email={userPresenceOverview?.email_id}
            workingStatus={workingStatus}
            reset={reset}
            employeeId={Number(params.userId)}
          />
          <PresenceSection
            setWorkingStatus={setWorkingStatus}
            workingStatus={workingStatus}
            isEmployeeSpecific={true}
            isLoading={isLoading}
            name={userPresenceOverview?.name || ""}
            data={data}
            error={error}
            hasMore={hasMore}
            loadMore={next}
            reset={reset}
            setFiltersPopupOpen={() => {}}
            timezone={userPresenceOverview?.timezone}
          />
        </Box>
      </Stack>
    </LayoutComponent>
  );
};

export default EmployeeDashboard;
