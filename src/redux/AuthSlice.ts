import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LoginResponseUser, MSLoginResponse } from "../services/useMSLoginApi";

interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
  user: LoginResponseUser | null;
  isEmployee: boolean | null;
  isManager: boolean | string | null;
  isProjectAdmin: boolean | string | null;
  isAdmin: boolean | string | null;
}

const initialState: AuthState = {
  isLoggedIn: localStorage.getItem("token") ? true : false,
  token: localStorage.getItem("token"),
  user: JSON.parse(localStorage.getItem("user") || "null"),
  isEmployee: localStorage.getItem("isEmployee") === "true",
  isManager: localStorage.getItem("isManager") === "true",
  isProjectAdmin: localStorage.getItem("isProjectAdmin") === "true",
  isAdmin: localStorage.getItem("isAdmin") === "true",
};

const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<LoginResponseUser>) => {
      const user = action.payload;
      const isManager = !user?.is_admin && user?.is_manager;
      const isProjectAdmin = !user?.is_admin && user?.is_project_admin;
      const isEmployee =
        !user?.is_manager && !user?.is_project_admin && !user?.is_admin;
      state.isLoggedIn = true;
      state.user = user;
      state.isManager = isManager;
      state.isProjectAdmin = isProjectAdmin;
      state.isEmployee = isEmployee;
      state.isAdmin = user?.is_admin;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("isManager", String(isManager));
      localStorage.setItem("isProjectAdmin", String(isProjectAdmin));
      localStorage.setItem("isEmployee", String(isEmployee));
      localStorage.setItem("isAdmin", String(user?.is_admin));
    },

    login: (state, action: PayloadAction<MSLoginResponse>) => {
      const { access_token, user, refresh_token } = action.payload;
      const isManager = !user?.is_admin && user?.is_manager;
      const isProjectAdmin = !user?.is_admin && user?.is_project_admin;
      const isEmployee =
        !user?.is_manager && !user?.is_project_admin && !user?.is_admin;
      state.isLoggedIn = true;
      state.user = user;
      state.token = access_token;
      state.isManager = isManager;
      state.isProjectAdmin = isProjectAdmin;
      state.isEmployee = isEmployee;
      state.isAdmin = user?.is_admin;

      localStorage.setItem("token", access_token);
      localStorage.setItem("refreshToken", refresh_token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("isManager", String(isManager));
      localStorage.setItem("isProjectAdmin", String(isProjectAdmin));
      localStorage.setItem("isEmployee", String(isEmployee));
      localStorage.setItem("isAdmin", String(user?.is_admin));
    },

    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.token = null;
      state.isManager = null;
      state.isProjectAdmin = null;
      state.isEmployee = null;

      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      localStorage.removeItem("isManager");
      localStorage.removeItem("isProjectAdmin");
      localStorage.removeItem("isEmployee");
    },
  },
});
export const { login, logout, setUser } = AuthSlice.actions;
export default AuthSlice.reducer;
