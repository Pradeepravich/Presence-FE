import { FC, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { useTenantApi } from "../services/useTenantApi";
import { setTenant } from "../redux/SettingsSlice";
import { RootState } from "../redux/store";
import { useGetLoggedinUserApi } from "../services/useGetLoggedinUser";
import { setUser } from "../redux/AuthSlice";

const TenantInitializer: FC = () => {
  const dispatch = useDispatch();
  const token = useSelector((data: RootState) => data.auth.token);
  const isLoggedIn = useSelector((data: RootState) => data.auth.isLoggedIn);
  const tenantId = useMemo(() => {
    if (token) {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.tenant_id;
    }
    return null;
  }, [token]);

  const { fetchTenantData } = useTenantApi({
    tenant_id: tenantId,
  });
  const { execute: getUser } = useGetLoggedinUserApi();

  useEffect(() => {
    if (isLoggedIn) {
      getUser().then((userData) => {
        dispatch(setUser(userData.user));
      });
    }
  }, [dispatch, getUser, isLoggedIn]);

  useEffect(() => {
    if (tenantId) {
      fetchTenantData().then((tenantData) => {
        dispatch(setTenant(tenantData));
      });
    }
  }, [dispatch, fetchTenantData, tenantId]);

  return <></>;
};

export default TenantInitializer;
