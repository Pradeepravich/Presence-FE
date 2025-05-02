import { FC } from "react";
import { User } from "../../services/useUsersApi";
import { Switch } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import {
  EditUserRequest,
  EditUserResponse,
} from "../../services/useEditUserApi";

interface Props {
  user: User;
  field: "presence_enabled" | "is_admin";
  editUser: (
    params?:
      | {
          id: string;
          user: EditUserRequest;
        }
      | undefined
  ) => Promise<EditUserResponse>;
  testId?: string;
  updateData?: any;
}

const UserToggle: FC<Props> = ({
  user,
  field,
  editUser,
  testId = "",
  updateData,
}) => {
  return (
    <div>
      <Switch
        checked={user[field]}
        color="primary"
        onChange={async () => {
          const newStatus = !user[field];
          try {
            const value = await editUser({
              id: String(user?.id),
              user: { [field]: newStatus },
            });
            enqueueSnackbar("Updated Successfully.", {
              variant: "success",
            });
            updateData(value);
          } catch (error) {
            console.error(error);
            enqueueSnackbar("An error occurred", { variant: "error" });
            user[field] = !newStatus;
          }
        }}
        data-testid={testId}
      />
    </div>
  );
};

export default UserToggle;
