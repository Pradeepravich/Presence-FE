import { FC, memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Box, styled } from "@mui/material";
import useBoolean from "../../hooks/useBoolean";
import AddNodePanel from "./AddNodePanel";

const LabelDisplay = styled(Box)(({ theme }) => ({
  width: 100,
  height: 36,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.25)",
  fontWeight: 600,
  fontSize: 11,
  backgroundColor:
    theme.palette.mode === "light"
      ? theme.palette.common.white
      : theme.palette.common.black,
  color: "#3282B8",
  borderRadius: 4,
  border: "1px dashed #039BE5",
  cursor: "pointer",
  position: "relative",
}));

interface AddNewLocationNodeProps {
  data: {
    label: string;
    onAdd: (location: string, timezone: string) => void;
  };
}

const AddNewLocationNode: FC<AddNewLocationNodeProps> = memo(({ data }) => {
  const { value, setFalse, setTrue } = useBoolean();
  return (
    <>
      <Handle type="target" position={Position.Left} isConnectable={false} />
      <LabelDisplay onClick={setTrue}>+ Add New</LabelDisplay>
      <AddNodePanel
        open={value}
        onClose={setFalse}
        onClick={(text, timezone) => {
          data.onAdd(text, timezone);
          setFalse();
        }}
      />
    </>
  );
});

export default AddNewLocationNode;
