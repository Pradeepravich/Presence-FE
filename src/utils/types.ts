import { ReactNode } from "react";
import { Dispatch, SetStateAction } from "react";
import { AVAILABILITY_STATUSES } from "./constants";
import { LocationItem } from "../services/useGetLocationsApi";

export type AvailablilityStatusKey =
  (typeof AVAILABILITY_STATUSES)[number]["key"];

export type AvailabilityStatusShortcut =
  (typeof AVAILABILITY_STATUSES)[number]["shortcut"];

export type SetState<S> = Dispatch<SetStateAction<S>>;

export interface LocationProps {
  locations: LocationItem[];
  isLocationsLoading?: boolean;
}

export interface projectsDropdownProps {
  value: string;
  label: string;
  disabled?: boolean;
  role?: "Admin" | "Employee";
}

export interface ConfirmContextType {
  open: boolean;
  setOpen: SetState<boolean>;
  dialogSettings: DialogSettings;
  setCurrentDialogSettings: (settings: DialogSettings) => void;
  setDefaultDialogSettings: () => void;
}

export interface DialogSettings {
  id?: string;
  title: string | React.ReactElement<any>;
  content: ReactNode;
  cancelButtonText: string;
  confirmButtonText: string;
  hasNoConfirmButton?: boolean;
  width?: string;
  height?: string;
  actionBarStyles?: string;
  cancelColor?: string;
  confirmColor?: string;
  closeIcon?: boolean;
  onClose?: VoidFunction;
}
export interface AnalyticUserData {
  id: number;
  manager_name: string;
  profile_picture: string;
  current_shift: string;
  active_projects: string[];
  location: string | null;
  name: string;
  email: string;
  business_phones: string[];
  display_name: string;
  given_name: string;
  job_title: string;
  mobile_phone: string | null;
  office_location: string;
  preferred_language: string | null;
  surname: string;
  department: string;
  company_name: string;
  presence_enabled: boolean;
  manager_internal_id: string;
  city: string | null;
  country: string | null;
  time_zone: string | null;
  is_ms_admin: boolean;
  is_admin: boolean;
  manager_profile_picture: string;
}
